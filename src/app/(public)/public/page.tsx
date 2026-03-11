"use client";

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

export default function PublicMobileView() {
    const { members, divisions, lastUpdated, isLoading } = useAppContext();

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


    // Formatting the timestamp
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(lastUpdated);

    return (
        <div className={styles.mobileContainer}>
            <header className={styles.mobileHeader}>
                <h1 className="text-gradient">RESONANCE 余情</h1>
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
                                    {member.name[0].toUpperCase()}
                                </div>
                                <div className={styles.memberInfo}>
                                    <span className={styles.memberName}>{member.name}</span>
                                    <span className={`${styles.memberRole} ${styles[member.role.replace(' ', '')]}`}>
                                        {member.role}
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
