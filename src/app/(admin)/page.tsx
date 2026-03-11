"use client";

import { useAppContext } from "@/context/AppContext";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const { members, divisions, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Fetching dashboard data...</p>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.status === 'Active').length;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2 className={styles.greeting}>Welcome back, <span className="text-gradient">Admin</span></h2>
        <p className={styles.subtext}>Here's what's happening with RESONANCE today.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass`}>
          <h3>Total Talent</h3>
          <p className={styles.statValue}>{members.length}</p>
        </div>
        <div className={`${styles.statCard} glass`}>
          <h3>Active Now</h3>
          <p className={styles.statValue} style={{ color: 'var(--accent-secondary)' }}>{activeMembers}</p>
        </div>
        <div className={`${styles.statCard} glass`}>
          <h3>Divisions</h3>
          <p className={styles.statValue}>{divisions.length}</p>
        </div>
      </div>

      <section className={styles.quickView}>
        <div className={`${styles.sectionHeader}`}>
          <h3>Recently Added</h3>
          <Link href="/master-list" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.recentList}>
          {members.slice(-3).reverse().map(member => (
            <div key={member.id} className={`${styles.memberRow} glass`}>
              <div className={styles.memberInfo}>
                <div className={styles.miniAvatar}>{member.name[0].toUpperCase()}</div>
                <div>
                  <p className={styles.memberName}>{member.name}</p>
                  <p className={styles.memberMeta}>{member.division} • {member.range || 'No range set'}</p>
                </div>
              </div>
              <div className={`${styles.statusBadge} ${styles[member.status.toLowerCase()]}`}>
                {member.status}
              </div>
            </div>
          ))}
          {members.length === 0 && <p className={styles.emptyMsg}>No talent found in database.</p>}
        </div>
      </section>
    </div>
  );
}
