import { members, initialDivisions } from "@/lib/mockData";
import styles from "./page.module.css";

export default function Home() {
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
          <p className={styles.statValue}>{initialDivisions.length}</p>
        </div>
      </div>

      <section className={styles.quickView}>
        <div className={`${styles.sectionHeader}`}>
          <h3>Recently Added</h3>
          <button className={styles.viewAll}>View All</button>
        </div>
        <div className={styles.recentList}>
          {members.slice(0, 3).map(member => (
            <div key={member.id} className={`${styles.memberRow} glass`}>
              <div className={styles.memberInfo}>
                <div className={styles.miniAvatar}>{member.name[0]}</div>
                <div>
                  <p className={styles.memberName}>{member.name}</p>
                  <p className={styles.memberMeta}>{member.division} • {member.range}</p>
                </div>
              </div>
              <div className={`${styles.statusBadge} ${styles[member.status.toLowerCase()]}`}>
                {member.status}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
