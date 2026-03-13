"use client";

import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

type SimulatedAssignment = {
    memberId: string;
    division: string;
    name: string;
    gender: string;
    role: string;
    history?: string[]; // [last1, last2]
};

export default function ShufflePage() {
    const { members, divisions, updateMember, isLoading } = useAppContext();
    const [assignments, setAssignments] = useState<SimulatedAssignment[]>([]);
    const [lastShuffleDate, setLastShuffleDate] = useState<string | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Initial simulation on load or when members change
    useEffect(() => {
        if (!isLoading && members.length > 0 && assignments.length === 0) {
            handleReroll();
        }
        
        // Load last shuffle from localStorage
        const saved = localStorage.getItem('resonance_last_shuffle');
        if (saved) setLastShuffleDate(saved);
    }, [isLoading, members.length]);

    const activeMembers = useMemo(() => members.filter(m => m.status === 'Active'), [members]);
    
    // Logic members: 
    // 1. Captains and VCs (Stay put)
    // 2. Males (Shuffled across divisions EXCEPT Okinawa)
    // 3. Females (Manually assigned, but initially unassigned in simulation)
    
    const handleReroll = () => {
        const newAssignments: SimulatedAssignment[] = [];
        
        // 1. Keep Captains and VCs
        const fixed = activeMembers.filter(m => m.role !== 'Member');
        fixed.forEach(m => {
            newAssignments.push({
                memberId: m.id,
                division: m.division,
                name: m.name,
                gender: m.gender,
                role: m.role,
                history: [m.last_division_1 || '', m.last_division_2 || '']
            });
        });

        // 2. Shuffle Active Males with Balanced Distribution & History Avoidance
        const activeMales = activeMembers.filter(m => m.role === 'Member' && m.gender === 'Male');
        const targetDivisions = divisions.filter(d => d !== 'Okinawa');
        
        if (targetDivisions.length > 0) {
            // Shuffle males list for randomness
            const shuffledMales = [...activeMales].sort(() => Math.random() - 0.5);
            
            // Track counts to keep balance
            const divCounts: Record<string, number> = {};
            targetDivisions.forEach(d => divCounts[d] = 0);

            shuffledMales.forEach(m => {
                // Find valid divisions (not in last 2 shuffles)
                const forbidden = [m.last_division_1, m.last_division_2].filter(Boolean);
                let validDivs = targetDivisions.filter(d => !forbidden.includes(d));
                
                // Fallback: if all divisions are forbidden (unlikely), allow any
                if (validDivs.length === 0) validDivs = targetDivisions;

                // Pick the one among valid ones that has the least members currently assigned
                const chosenDiv = validDivs.reduce((prev, curr) => 
                    divCounts[curr] < divCounts[prev] ? curr : prev
                );

                divCounts[chosenDiv]++;
                newAssignments.push({
                    memberId: m.id,
                    division: chosenDiv,
                    name: m.name,
                    gender: m.gender,
                    role: m.role,
                    history: [m.last_division_1 || '', m.last_division_2 || '']
                });
            });
        }

        // 3. Keep Females as Unassigned
        const activeFemales = activeMembers.filter(m => m.role === 'Member' && m.gender === 'Female');
        activeFemales.forEach(m => {
            newAssignments.push({
                memberId: m.id,
                division: 'Unassigned',
                name: m.name,
                gender: m.gender,
                role: m.role,
                history: [m.last_division_1 || '', m.last_division_2 || '']
            });
        });

        setAssignments(newAssignments);
    };

    const handleManualAssign = (memberId: string, division: string) => {
        setAssignments(prev => prev.map(a => 
            a.memberId === memberId ? { ...a, division } : a
        ));
    };

    const handleCommit = async () => {
        if (password !== 'RESONANCE') {
            alert('Incorrect password. Access denied.');
            return;
        }

        setIsSaving(true);
        try {
            const updates = assignments
                .filter(a => a.division !== 'Unassigned')
                .map(a => {
                    const originalMember = members.find(m => m.id === a.memberId);
                    if (!originalMember || originalMember.division === a.division) return null;

                    // Update History ONLY for those affected by the Great Shuffle (Male Members)
                    // Females and Leadership are unaffected by the cooldown logic.
                    const isAutoShuffled = originalMember.role === 'Member' && originalMember.gender === 'Male';
                    
                    const updateData: any = { division: a.division };
                    
                    if (isAutoShuffled) {
                        updateData.last_division_1 = originalMember.division;
                        updateData.last_division_2 = originalMember.last_division_1;
                    }

                    return updateMember(a.memberId, updateData);
                })
                .filter(Boolean);
            
            await Promise.all(updates);
            
            const now = new Date().toLocaleString();
            setLastShuffleDate(now);
            localStorage.setItem('resonance_last_shuffle', now);
            
            alert('Shuffle commited successfully!');
            setShowPasswordModal(false);
            setPassword('');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save changes.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Syncing data...</p>
            </div>
        );
    }

    const unassignedFemales = assignments.filter(a => a.division === 'Unassigned');

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className="text-gradient">Shuffle Center</h2>
                    <p className={styles.subtext}>Balanced distribution & Okinawa specialized routine.</p>
                </div>
                {lastShuffleDate && (
                    <div className={styles.lastShuffle}>
                        🕒 Last Shuffle: {lastShuffleDate}
                    </div>
                )}
            </header>

            <div className={styles.simulationHeader}>
                <div className={styles.simInfo}>
                    <div className={styles.simTitle}>🛠️ Simulation Mode Active</div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Changes are not saved until you confirm with password.</p>
                </div>
                <div className={styles.simControls}>
                    <button className={styles.rerollBtn} onClick={handleReroll}>🔄 Reroll Males</button>
                    <button className={styles.confirmBtn} onClick={() => setShowPasswordModal(true)}>✅ Commit Shuffle</button>
                </div>
            </div>

            <div className={styles.mainLayout}>
                <div className={styles.divisionsGrid}>
                    {divisions.map(division => {
                        const divMembers = assignments.filter(a => a.division === division);
                        const isOkinawa = division === 'Okinawa';

                        return (
                            <div key={division} className={`${styles.divisionCard} glass ${isOkinawa ? styles.isOkinawa : ''}`}>
                                <div className={styles.cardHeader}>
                                    <h3>{division}</h3>
                                    {isOkinawa && <span className={styles.okinawaBadge}>Girls Only</span>}
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{divMembers.length}</span>
                                </div>
                                <div className={styles.memberList}>
                                    {divMembers.length === 0 ? (
                                        <p className={styles.emptyMsg}>Empty Division</p>
                                    ) : (
                                        divMembers.map(m => (
                                            <div key={m.memberId} className={styles.memberItem}>
                                                <span>
                                                    <span className={m.gender === 'Male' ? styles.genderMale : styles.genderFemale}>
                                                        {m.gender === 'Male' ? '♂' : '♀'}
                                                    </span> {m.name}
                                                    {m.role !== 'Member' && <strong style={{ marginLeft: '6px', fontSize: '0.7rem', color: 'var(--accent-primary)' }}>{m.role === 'Captain' ? 'CAPT' : 'VC'}</strong>}
                                                </span>
                                                {m.role === 'Member' && (
                                                    <button 
                                                        className={styles.removeBtn} 
                                                        onClick={() => handleManualAssign(m.memberId, 'Unassigned')}
                                                        title="Unassign"
                                                    >❌</button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.sidebar}>
                    <div className={`${styles.unassignedPanel} glass`}>
                        <div className={styles.panelTitle}>🎀 Pending Female Assignment</div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Assign active females to Okinawa or other divisions below.
                        </p>
                        <div className={styles.unassignedList}>
                            {unassignedFemales.length === 0 ? (
                                <p className={styles.emptyMsg}>All females assigned.</p>
                            ) : (
                                unassignedFemales.map(m => (
                                    <div key={m.memberId} className={styles.unassignedMember}>
                                        <div className={styles.memberMeta}>
                                            <span className={styles.genderFemale}>♀ {m.name}</span>
                                        </div>
                                        <select 
                                            className={styles.assignSelect}
                                            onChange={(e) => handleManualAssign(m.memberId, e.target.value)}
                                            value="Unassigned"
                                        >
                                            <option value="Unassigned">Select Division...</option>
                                            {divisions.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <div className={styles.passwordModal}>
                    <div className={`${styles.modalContent} glass`}>
                        <h3 style={{ fontSize: '1.5rem' }}>Security Verification</h3>
                        <p>Please enter the admin password to confirm the great shuffle.</p>
                        <input 
                            type="password" 
                            className={styles.passwordInput} 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowPasswordModal(false)}>Cancel</button>
                            <button 
                                className={styles.confirmFinalBtn} 
                                onClick={handleCommit}
                                disabled={isSaving}
                            >
                                {isSaving ? <div className={styles.spinner}></div> : 'Authorize Shuffle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
