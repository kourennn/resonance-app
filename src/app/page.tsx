"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const { members, divisions, isLoading } = useAppContext();
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);
  const [lastShuffle, setLastShuffle] = useState<string | null>(null);

  // Constants
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  
  // Season Logic: Cumulative months since January 2026 (Season 1)
  const startYear = 2026;
  const seasonNumber = (currentYear - startYear) * 12 + currentMonth;

  // Progress logic
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const monthProgress = (now.getDate() / daysInMonth) * 100;

  useEffect(() => {
    // Load last shuffle from storage
    const saved = localStorage.getItem('resonance_last_shuffle');
    setLastShuffle(saved);

    // Timer logic
    const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);
    
    const updateTimer = () => {
      const currentTime = new Date();
      const diff = endOfMonth.getTime() - currentTime.getTime();

      if (diff <= 0) {
        // Check if shuffle happened this month
        if (saved) {
            const lastDate = new Date(saved);
            const shuffledThisMonth = lastDate.getMonth() === now.getMonth() && lastDate.getFullYear() === now.getFullYear();
            if (!shuffledThisMonth) setIsOverdue(true);
        } else {
            setIsOverdue(true);
        }

        // Calculate time passed since target
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
  }, [currentMonth, currentYear, now]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
        total: members.length,
        active: members.filter(m => m.status === 'Active').length,
        idle: members.filter(m => m.status === 'Idle').length,
        males: members.filter(m => m.gender === 'Male').length,
        females: members.filter(m => m.gender === 'Female').length,
        captains: members.filter(m => m.role === 'Captain').length,
        vcs: members.filter(m => m.role === 'Vice Captain').length,
        members: members.filter(m => m.role === 'Member').length,
    };
  }, [members]);

  // Chart data
  const divisionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    divisions.forEach(d => counts[d] = 0);
    members.forEach(m => {
        if (counts[m.division] !== undefined) counts[m.division]++;
    });
    return counts;
  }, [members, divisions]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Syncing systems...</p>
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(divisionCounts), 1);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className={styles.dashboard}>
      <section className={`${styles.seasonBanner} animate-fade`}>
        <div className={styles.bannerContent}>
            <h1 className={styles.seasonTitle}>Resonance 余情</h1>
            <p className={styles.seasonSub}>Season {seasonNumber}</p>
            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${monthProgress}%` }}></div>
                </div>
                <span className={styles.progressLabel}>{Math.round(monthProgress)}% Completion</span>
            </div>
        </div>
        {lastShuffle && <span className={styles.lastShuffle}>Last Synchronized: {lastShuffle}</span>}
      </section>

      <div className={`${styles.topRow} animate-fade`} style={{ animationDelay: '0.1s' }}>
          <div className={styles.greetingSection}>
            <h2 className={styles.greeting}>{getGreeting()}, <span className="text-gradient">Kouren</span></h2>
            <p className={styles.subtext}>Database synchronized. All systems operational.</p>
          </div>
          
          <div className={`${styles.timerCard} glass ${isOverdue ? styles.overdue : ''}`}>
            <div className={styles.timerHeader}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className={styles.timerLabel}>{isOverdue ? 'SHUFFLE OVERDUE' : 'NEXT SHUFFLE'}</span>
            </div>
            <div className={styles.timerValue}>
                {timeLeft ? `${timeLeft.d}d ${timeLeft.h}h ${timeLeft.m}m` : '00:00:00'}
            </div>
            {isOverdue && <p className={styles.overdueText}>Immediate attention required.</p>}
          </div>
      </div>

      <div className={`${styles.statsGrid} animate-fade`} style={{ animationDelay: '0.2s' }}>
          <div className={`${styles.statCard} glass`}>
            <div className={styles.statHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3>Total Members</h3>
            </div>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={`${styles.statCard} glass`}>
            <div className={styles.statHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <h3>Active / Idle</h3>
            </div>
            <span className={styles.statValue} style={{ color: 'var(--accent-secondary)' }}>
                {stats.active} 
                <small className={styles.statSmall}>/ {stats.idle}</small>
            </span>
          </div>
          <div className={`${styles.statCard} glass`}>
            <div className={styles.statHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <h3>Gender M/F</h3>
            </div>
            <span className={styles.statValue}>{stats.males} <small className={styles.statSmall}>/ {stats.females}</small></span>
          </div>
          <div className={`${styles.statCard} glass`}>
            <div className={styles.statHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <h3>Leadership</h3>
            </div>
            <span className={styles.statValue}>{stats.captains + stats.vcs}</span>
            <span className={styles.statDetail}>{stats.captains} Capt | {stats.vcs} VC</span>
          </div>
      </div>

      <div className={`${styles.middleRow} animate-fade`} style={{ animationDelay: '0.3s' }}>
          <section className={`${styles.chartCard} glass`}>
              <div className={styles.sectionHeader}>
                  <h3>Division Distribution</h3>
              </div>
              <div className={styles.barChart}>
                  {Object.entries(divisionCounts).map(([name, count], index) => (
                      <div key={name} className={styles.barWrapper}>
                          <div 
                              className={styles.bar} 
                              style={{ 
                                height: `${(count / maxCount) * 100}%`,
                                animationDelay: `${0.4 + (index * 0.1)}s`
                              }}
                          >
                              <div className={styles.barTooltip}>{count} Members</div>
                          </div>
                          <span className={styles.barLabel}>{name}</span>
                      </div>
                  ))}
              </div>
          </section>

          <section className={`${styles.quickView} glass`}>
            <div className={styles.sectionHeader}>
              <h3>Recent Inductions</h3>
              <Link href="/master-list" className={styles.viewAll}>View All</Link>
            </div>
            <div className={styles.recentList}>
              {members.slice(-4).reverse().map((member, index) => (
                <div 
                    key={member.id} 
                    className={`${styles.memberRow} glass`}
                    style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
                >
                  <div className={styles.memberInfo}>
                    <div className={styles.miniAvatar} style={{ background: index % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                        {member.name[0].toUpperCase()}
                    </div>
                    <p className={styles.memberName}>{member.name}</p>
                  </div>
                  <span className={`${styles.genderIcon} ${member.gender === 'Male' ? styles.genderM : styles.genderF}`}>
                    {member.gender === 'Male' ? '♂' : '♀'}
                  </span>
                </div>
              ))}
            </div>
          </section>
      </div>
    </div>
  );
}
