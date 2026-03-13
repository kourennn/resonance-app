import Link from 'next/link';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    return (
        <aside className={`${styles.sidebar} glass`}>
            <div className={styles.logo}>
                <h1 className="text-gradient">RESONANCE</h1>
            </div>

            <nav className={styles.nav}>
                <Link href="/" className={styles.navItem}>
                    <span className={styles.icon}>📋</span> Dashboard
                </Link>
                <Link href="/master-list" className={styles.navItem}>
                    <span className={styles.icon}>🗃️</span> Master List
                </Link>
                <Link href="/divisions" className={styles.navItem}>
                    <span className={styles.icon}>🎭</span> Divisions
                </Link>
                <Link href="/shuffle" className={styles.navItem}>
                    <span className={styles.icon}>🔀</span> Shuffle
                </Link>
            </nav>

            <div className={styles.footer}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>A</div>
                    <div>
                        <p className={styles.userName}>Admin User</p>
                        <p className={styles.userRole}>Master List Lead</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
