"use client";

import { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

export default function PublicMobileView() {
    const { members, divisions, lastUpdated, isLoading } = useAppContext();

    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
    const [isOverdue, setIsOverdue] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [seasonNumber, setSeasonNumber] = useState<number>(0);

    useEffect(() => {
        setHasMounted(true);
        
        // Calculate season on client only to avoid hydration mismatch
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const sY = 2026;
        setSeasonNumber((y - sY) * 12 + m);

        const saved = localStorage.getItem('resonance_last_shuffle');
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);
        
        const updateTimer = () => {
          const currentTime = new Date();
          const diff = endOfMonth.getTime() - currentTime.getTime();

          if (diff <= 0) {
            if (saved) {
                const lastDate = new Date(saved);
                const shuffledThisMonth = lastDate.getMonth() === now.getMonth() && lastDate.getFullYear() === now.getFullYear();
                if (!shuffledThisMonth) setIsOverdue(true);
            } else {
                setIsOverdue(true);
            }
            const overdueDiff = Math.abs(diff);
            setTimeLeft({
                d: Math.floor(overdueDiff / (1000 * 60 * 60 * 24)),
                h: Math.floor((overdueDiff / (1000 * 60 * 60)) % 24),
                m: Math.floor((overdueDiff / (1000 * 60)) % 60),
                s: Math.floor((overdueDiff / 1000) % 60)
            });
          } else {
            setIsOverdue(false);
            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60)
            });
          }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Syncing with resonance...</p>
            </div>
        );
    }

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDivision, setSelectedDivision] = useState<string>('Unassigned');

    // Filter only Active members
    const activeMembers = useMemo(() => members.filter(m => m.status === 'Active'), [members]);

    // Handle Search and Auto-Switch Division
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 1) {
            // Find the first matching active member
            const foundMember = activeMembers.find(m => 
                m.name.toLowerCase().includes(query.toLowerCase())
            );

            // If found, automatically switch the dropdown to their division
            if (foundMember) {
                setSelectedDivision(foundMember.division);
            }
        }
    };

    // Filter members for the currently selected division
    const displayedMembers = useMemo(() => {
        let divisionMembers = activeMembers.filter(m => m.division === selectedDivision);

        // If a search query exists, further filter the box to highlight the person
        if (searchQuery.trim() !== '') {
             divisionMembers = divisionMembers.filter(m => 
                 m.name.toLowerCase().includes(searchQuery.toLowerCase())
             );
        }

        // Sort: Captains first, then Vice Captains, then Members
        return divisionMembers.sort((a, b) => {
            const roleOrder = { 'Captain': 1, 'Vice Captain': 2, 'Member': 3 };
            return roleOrder[a.role] - roleOrder[b.role];
        });
    }, [activeMembers, selectedDivision, searchQuery]);


    // Formatting the timestamp (Only on client to avoid hydration mismatch)
    const formattedDate = useMemo(() => {
        if (!hasMounted || !lastUpdated) return 'Syncing...';
        try {
            const dateObj = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(dateObj);
        } catch (e) {
            return 'Just now';
        }
    }, [hasMounted, lastUpdated]);

    return (
        <div className={styles.mobileContainer}>
            <header className={styles.mobileHeader}>
                <h1 className="text-gradient">RESONANCE 余情</h1>
                
                {hasMounted && (
                    <>
                        <div className={styles.seasonBadge}>SEASON {seasonNumber}</div>
                        
                        <div className={`${styles.publicTimer} ${isOverdue ? styles.overdue : ''}`}>
                            <span className={styles.timerLabel}>{isOverdue ? 'SHUFFLE OVERDUE' : 'NEXT SHUFFLE IN'}</span>
                            <span className={styles.timerValue}>
                                {timeLeft ? `${timeLeft.d}d ${timeLeft.h}h ${timeLeft.m}m` : '--:--:--'}
                            </span>
                        </div>
                    </>
                )}

                <p className={styles.subtitle}>Public Roster View</p>
                <p className={styles.creatorCredit}>Made by ぎ𝟏 𝐊𝐨𝐮𝐫𝐞𝐧</p>
            </header>

            <div className={styles.searchSection}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search your name..."
                        className={`${styles.searchInput} glass`}
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className={styles.divisionSelector}>
                <label className={styles.label}>Select Division</label>
                <select 
                    className={`${styles.selectDropdown} glass`}
                    value={selectedDivision}
                    onChange={(e) => {
                        setSelectedDivision(e.target.value);
                        setSearchQuery(''); // Clear search when manually switching
                    }}
                >
                    <option value="Unassigned">Unassigned</option>
                    {divisions.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            <div className={`${styles.divisionBox} glass animate-fade`}>
                <h2 className={styles.boxTitle}>{selectedDivision}</h2>
                <div className={styles.memberList}>
                    {displayedMembers.length > 0 ? (
                        displayedMembers.map(member => (
                            <div key={member.id} className={styles.memberItem}>
                                <div className={styles.memberAvatar}>
                                    {member.name ? member.name[0].toUpperCase() : '?'}
                                </div>
                                <div className={styles.memberInfo}>
                                    <span className={styles.memberName}>{member.name || 'Unknown'}</span>
                                    <span className={`${styles.memberRole} ${member.role ? styles[member.role.replace(' ', '')] : ''}`}>
                                        {member.role || 'Member'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            No active members found in this division.
                        </div>
                    )}
                </div>
            </div>

            <footer className={styles.footer}>
                <p>Last updated: <span>{formattedDate}</span></p>
            </footer>
        </div>
    );
}
