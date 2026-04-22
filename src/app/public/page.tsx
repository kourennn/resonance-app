"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Member } from '@/lib/mockData';
import styles from './page.module.css';

const RANK_LABELS: Record<string, string> = {
    'Joker (low-tier)': '🃏 Joker (low-tier)',
    'Joker (mid-tier)': '🃏 Joker (mid-tier)',
    'Joker (high-tier)': '🃏 Joker (high-tier)',
    'Jack (low-tier)': '♠ Jack (low-tier)',
    'Jack (mid-tier)': '♠ Jack (mid-tier)',
    'Jack (high-tier)': '♠ Jack (high-tier)',
    'Queen (low-tier)': '♛ Queen (low-tier)',
    'Queen (mid-tier)': '♛ Queen (mid-tier)',
    'Queen (high-tier)': '♛ Queen (high-tier)',
    'King (low-tier)': '♔ King (low-tier)',
    'King (mid-tier)': '♔ King (mid-tier)',
    'King (high-tier)': '♔ King (high-tier)',
    'Ace (low-tier)': '◆ Ace (low-tier)',
    'Ace (mid-tier)': '◆ Ace (mid-tier)',
    'Ace (high-tier)': '◆ Ace (high-tier)',
    Joker: '🃏 Joker',
    Jack: '♠ Jack',
    Queen: '♛ Queen',
    King: '♔ King',
    Ace: '◆ Ace',
};

type Tab = 'Roster' | 'Leaderboards' | 'Guide' | 'Contact';

function calculateAge(birthday?: string) {
    if (!birthday) return null;
    const dob = new Date(birthday);
    if (isNaN(dob.getTime())) return null;
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

function getDynamicRank(score: number): string {
    if (typeof score !== 'number' || score < 1.0) return 'Unranked';
    
    let baseRank = '';
    if (score >= 9.0) baseRank = 'Ace';
    else if (score >= 7.9) baseRank = 'King';
    else if (score >= 6.0) baseRank = 'Queen';
    else if (score >= 4.5) baseRank = 'Jack';
    else baseRank = 'Joker';
    
    let tier = '';
    if (score >= 7.0) tier = 'high-tier';
    else if (score >= 5.0) tier = 'mid-tier';
    else tier = 'low-tier';
    
    return `${baseRank} (${tier})`;
}

function isBirthdayToday(birthday?: string) {
    if (!birthday) return false;
    const dob = new Date(birthday);
    if (isNaN(dob.getTime())) return false;
    const today = new Date();
    return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
}

function getRankThemeClass(rank?: string) {
    if (!rank || rank === 'Unranked') return styles.rankUnranked;
    const baseRank = rank.split(' ')[0];
    return styles[`rank${baseRank}`] || styles.rankUnranked;
}

export default function PublicMobileView() {
    const { members, divisions, lastUpdated, isLoading } = useAppContext();

    const [activeTab, setActiveTab] = useState<Tab>('Roster');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [mottoIndex, setMottoIndex] = useState(0);

    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
    const [isOverdue, setIsOverdue] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [seasonNumber, setSeasonNumber] = useState<number>(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDivision, setSelectedDivision] = useState<string>('All Divisions');
    const prevDivisionsRef = useRef<string[]>([]);

    // Audio State
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        setHasMounted(true);
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

    useEffect(() => {
        if (!isLoading && divisions.length > 0) {
            if (selectedDivision !== 'All Divisions' && selectedDivision !== 'Unassigned' && !divisions.includes(selectedDivision)) {
                setSelectedDivision('All Divisions');
            }
            prevDivisionsRef.current = divisions;
        }
    }, [divisions, isLoading, selectedDivision]);

    const activeMembers = useMemo(() => members.filter(m => m.status === 'Active'), [members]);

    const mottoMembers = useMemo(() => {
        const withMottos = activeMembers.filter(m => m.motto && m.motto.trim().length > 0);
        return withMottos.sort(() => Math.random() - 0.5);
    }, [activeMembers]);

    useEffect(() => {
        if (mottoMembers.length <= 1) return;
        const interval = setInterval(() => {
            setMottoIndex((prev) => (prev + 1) % mottoMembers.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [mottoMembers]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim().length > 0) setSelectedDivision('All Divisions');
    };

    const displayedMembers = useMemo(() => {
        let divisionMembers = activeMembers;
        if (selectedDivision !== 'All Divisions') {
            divisionMembers = divisionMembers.filter(m => m.division === selectedDivision);
        }
        if (searchQuery.trim() !== '') {
             divisionMembers = divisionMembers.filter(m => 
                 m.name.toLowerCase().includes(searchQuery.toLowerCase())
             );
        }
        return divisionMembers.sort((a, b) => {
            const roleOrder = { 'Captain': 1, 'Vice Captain': 2, 'Member': 3 };
            return roleOrder[a.role] - roleOrder[b.role];
        });
    }, [activeMembers, selectedDivision, searchQuery]);

    const leaderboardMembers = useMemo(() => {
        const ranked = activeMembers.filter(m => (m.rank_score || 0) > 0);
        const sorted = [...ranked]
            .sort((a, b) => (b.rank_score || 0) - (a.rank_score || 0));
        
        let currentRank = 0;
        let lastScore = -1;
        const validMembers = [];
        
        for (const member of sorted) {
            if (member.rank_score !== lastScore) {
                currentRank++;
            }
            lastScore = member.rank_score || 0;
            
            if (currentRank > 10) break;
            
            validMembers.push(member);
        }
        
        return validMembers;
    }, [activeMembers]);

    const formattedDate = useMemo(() => {
        if (!hasMounted || !lastUpdated) return 'Syncing...';
        try {
            const dateObj = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
            return new Intl.DateTimeFormat('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', hour12: true
            }).format(dateObj);
        } catch (e) {
            return 'Just now';
        }
    }, [hasMounted, lastUpdated]);

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Syncing with resonance...</p>
            </div>
        );
    }

    const renderRosterTab = () => (
        <>
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
                        setSearchQuery(''); 
                    }}
                >
                    <option value="All Divisions">All Divisions</option>
                    <option value="Unassigned">Unassigned</option>
                    {divisions.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            <div className={`${styles.divisionBox} glass animate-fade`}>
                <div className={styles.boxHeader}>
                    <h2 className={styles.boxTitle}>{selectedDivision === 'All Divisions' ? 'All Members' : selectedDivision}</h2>
                    {selectedDivision === 'Equinox' && <span className={styles.equinoxBadge}>Girls Only</span>}
                </div>
                <div className={styles.memberList}>
                    {displayedMembers.length > 0 ? (
                        displayedMembers.map(member => (
                            <motion.div 
                                key={member.id} 
                                className={`${styles.memberItem} ${getRankThemeClass(member.rank)}`}
                                onClick={() => setSelectedMember(member)}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className={styles.memberAvatar}>
                                    {member.name ? member.name[0].toUpperCase() : '?'}
                                </div>
                                <div className={styles.memberInfo}>
                                    <div className={styles.memberNameRow}>
                                        <span className={styles.memberName}>
                                            {member.name || 'Unknown'} 
                                            {isBirthdayToday(member.birthday) && <span className={styles.birthdayIcon} title="Birthday Today!">🎂</span>}
                                        </span>
                                        <span className={styles.rankBadge}>
                                            {member.rank && member.rank !== 'Unranked' ? RANK_LABELS[member.rank] || member.rank : 'Unranked'}
                                        </span>
                                    </div>
                                    <div className={styles.memberMetaRow}>
                                        <span className={`${styles.memberRole} ${member.role ? styles[member.role.replace(' ', '')] : ''}`}>
                                            {member.role || 'Member'}
                                        </span>
                                        <span className={styles.metaTag}>{member.division}</span>
                                        {calculateAge(member.birthday) && (
                                            <span className={styles.metaAge}>Age {calculateAge(member.birthday)}</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>No active members found.</div>
                    )}
                </div>
            </div>
        </>
    );

    const renderLeaderboardsTab = () => (
        <div className={`${styles.divisionBox} glass animate-fade`}>
            <div className={styles.boxHeader}>
                <h2 className={styles.boxTitle}>Global Leaderboards</h2>
                <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Top ranked members by score</p>
            </div>
            <div className={styles.memberList}>
                {leaderboardMembers.length > 0 ? (
                     (() => {
                        let currentRank = 0;
                        let lastScore = -1;
                        
                        const items = leaderboardMembers.map((member, index) => {
                            if (member.rank_score !== lastScore) {
                                currentRank++;
                            }
                            lastScore = member.rank_score || 0;

                            const dynRank = getDynamicRank(member.rank_score || 0);

                            return (
                                <motion.div 
                                    key={member.id} 
                                    className={`${styles.memberItem} ${getRankThemeClass(dynRank)}`}
                                    onClick={() => setSelectedMember(member)}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={styles.leaderboardRank}>
                                        #{currentRank}
                                    </div>
                                    <div className={styles.memberAvatar}>
                                        {member.name ? member.name[0].toUpperCase() : '?'}
                                    </div>
                                    <div className={styles.memberInfo}>
                                        <div className={styles.memberNameRow}>
                                            <span className={styles.memberName}>{member.name || 'Unknown'}</span>
                                            <span className={styles.scoreBadge}>{member.rank_score} PTS</span>
                                        </div>
                                        <div className={styles.memberMetaRow}>
                                            <span className={styles.rankBadge}>
                                                {RANK_LABELS[dynRank] || dynRank}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        });

                        if (items.length < 10) {
                            for (let i = items.length; i < 10; i++) {
                                currentRank++;
                                items.push(
                                    <div key={`empty-${i}`} className={`${styles.memberItem} ${styles.rankUnranked}`} style={{ opacity: 0.4, cursor: 'default' }}>
                                        <div className={styles.leaderboardRank}>#{currentRank}</div>
                                        <div className={styles.memberAvatar}>?</div>
                                        <div className={styles.memberInfo}>
                                            <div className={styles.memberNameRow}>
                                                <span className={styles.memberName}>Unranked Spot</span>
                                                <span className={styles.scoreBadge}>-- PTS</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        }

                        return items;
                     })()
                ) : (
                    <div className={styles.emptyState}>No ranked members to display yet.</div>
                )}
            </div>
            <div className={styles.leaderboardFooter}>
                <p>Raise your rank to climb the leaderboards!</p>
            </div>
        </div>
    );

    return (
        <div className={styles.mobileContainer}>
            <header className={styles.mobileHeader}>
                <div className={styles.headerTopRow}>
                    <h1 className="text-gradient">RESONANCE 余情</h1>
                    <button className={styles.musicToggle} onClick={toggleMusic} title={isPlaying ? "Pause Music" : "Play Music"}>
                        {isPlaying ? '🔊' : '🔈'}
                    </button>
                    <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
                </div>
                
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
                <p className={styles.creatorCredit}>Made by ぎ𝟏 𝐊𝐨𝐮𝐫𝐞𝐧</p>
            </header>

            {mottoMembers.length > 0 && (
                <div className={`${styles.mottoSlideshow} glass animate-fade`}>
                    <div className={styles.mottoContent} key={mottoIndex}>
                        <p className={styles.slideshowMotto}>"{mottoMembers[mottoIndex].motto}"</p>
                        <p className={styles.slideshowName}>— {mottoMembers[mottoIndex].name}</p>
                    </div>
                </div>
            )}

            <div className={styles.tabBar}>
                {(['Roster', 'Leaderboards', 'Guide', 'Contact'] as Tab[]).map(tab => (
                    <motion.button 
                        key={tab}
                        className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                        whileTap={{ scale: 0.93 }}
                    >
                        {tab}
                    </motion.button>
                ))}
            </div>

            {activeTab === 'Roster' && renderRosterTab()}
            {activeTab === 'Leaderboards' && renderLeaderboardsTab()}
            {activeTab === 'Guide' && (
                <div className={`${styles.guideBox} glass animate-fade`}>
                    <h2 className={styles.guideTitle}>Rankings Guide</h2>
                    <pre className={styles.guideText}>
{`Give points depending on their participation, how active they are etc.

Once they reach a certain number of points, they'll move up sa hierarchy. 

Another is they'll receive points also depending on how accurate ung vms na sinesend nila, ung captains bahala mag evaluate

For being active the highest points is 50 points 
(This is given every day)

For every participation on activities/collabs 40 points 

For evaluation of vms 100 points is highest pts one may attain 

𝗥𝗮𝗻𝗸𝘀 𝗮𝗿𝗲:  
Ace (9.0 above)
King (7.9 - 8.9)
Queen  (6.0 - 7.8)
𝑱𝒂𝒄𝒌 (4.5 - 5.9)
𝐉𝐨𝐤𝐞𝐫 (1.8 - 4.4)


Tiers:
Low tier: (1.0 - 4.9)

Mid tier (5.0- 6.9)

High tier (7.0 - 10.10)`}
                    </pre>
                </div>
            )}
            {activeTab === 'Contact' && (
                <div className={`${styles.comingSoonBox} glass animate-fade`}>
                    <h2>Contact Us</h2>
                    <p>Coming Soon...</p>
                </div>
            )}

            <footer className={styles.footer}>
                <p>Last updated: <span>{formattedDate}</span></p>
            </footer>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <motion.div 
                        className={styles.modalOverlay} 
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setSelectedMember(null);
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className={`${styles.profileModal} ${getRankThemeClass(selectedMember.rank)}`}
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                if (offset.y > 100 || velocity.y > 500) {
                                    setSelectedMember(null);
                                }
                            }}
                        >
                            <div className={styles.dragHandle}></div>
                            <button className={styles.closeModalBtn} onClick={() => setSelectedMember(null)}>✕</button>
                            
                            <div className={styles.modalHeader}>
                                <div className={styles.modalAvatar}>
                                    {selectedMember.name ? selectedMember.name[0].toUpperCase() : '?'}
                                </div>
                                <h2 className={styles.modalName}>
                                    {selectedMember.name}
                                    {isBirthdayToday(selectedMember.birthday) && <span title="Birthday Today!" className={styles.modalBdayIcon}>🎂</span>}
                                </h2>
                                <p className={styles.modalRank}>{RANK_LABELS[selectedMember.rank || 'Unranked'] || 'Unranked'}</p>
                                
                                {selectedMember.motto && (
                                    <p className={styles.modalMotto}>"{selectedMember.motto}"</p>
                                )}
                            </div>

                            <div className={styles.modalStatsGrid}>
                                <div className={styles.statBox}>
                                    <span className={styles.statLabel}>Role</span>
                                    <span className={`${styles.statValue} ${selectedMember.role ? styles[selectedMember.role.replace(' ', '')] : ''}`}>{selectedMember.role}</span>
                                </div>
                                <div className={styles.statBox}>
                                    <span className={styles.statLabel}>Division</span>
                                    <span className={styles.statValue}>{selectedMember.division}</span>
                                </div>
                                <div className={styles.statBox}>
                                    <span className={styles.statLabel}>Score</span>
                                    <span className={styles.statValue}>{selectedMember.rank_score || 0} pts</span>
                                </div>
                                {calculateAge(selectedMember.birthday) && (
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Age</span>
                                        <span className={styles.statValue}>{calculateAge(selectedMember.birthday)}</span>
                                    </div>
                                )}
                            </div>

                            {selectedMember.top_characters && selectedMember.top_characters.length > 0 && (
                                <div className={styles.modalCharacters}>
                                    <span className={styles.charactersLabel}>Top Characters</span>
                                    <div className={styles.charactersList}>
                                        {selectedMember.top_characters.map((char, i) => (
                                            <span key={i} className={styles.characterTag}>{char}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
