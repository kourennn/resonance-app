"use client";

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

function MemberSearchDropdown({
    divisionName,
    onAssign,
}: {
    divisionName: string;
    onAssign: (memberId: string) => void;
}) {
    const { members } = useAppContext();
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const available = useMemo(
        () =>
            members.filter(
                (m) =>
                    m.status !== 'Idle' &&
                    m.division !== divisionName &&
                    m.name.toLowerCase().includes(search.toLowerCase())
            ),
        [members, divisionName, search]
    );

    const handleSelect = (id: string) => {
        onAssign(id);
        setSearch('');
        setOpen(false);
    };

    return (
        <div className={styles.dropdownWrapper}>
            <button
                className={styles.assignBtn}
                onClick={() => setOpen((v) => !v)}
                type="button"
            >
                {open ? '✕ Close' : '＋ Assign Member'}
            </button>
            {open && (
                <div className={styles.dropdownPanel}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search member..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.dropdownSearch}
                    />
                    <ul className={styles.dropdownList}>
                        {available.length === 0 ? (
                            <li className={styles.dropdownEmpty}>No results</li>
                        ) : (
                            available.map((m) => (
                                <li
                                    key={m.id}
                                    className={styles.dropdownItem}
                                    onClick={() => handleSelect(m.id)}
                                >
                                    <span className={styles.dropdownName}>{m.name}</span>
                                    <span className={styles.dropdownMeta}>{m.role} · {m.division}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function Divisions() {
    const {
        members,
        divisions,
        addDivision,
        deleteDivision,
        updateDivisionName,
        updateMemberDivision,
        isLoading,
    } = useAppContext();

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Syncing with database...</p>
            </div>
        );
    }

    const [newDivisionName, setNewDivisionName] = useState('');
    const [editingDivision, setEditingDivision] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleAddDivision = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDivisionName.trim()) {
            addDivision(newDivisionName.trim());
            setNewDivisionName('');
        }
    };

    const handleSaveEdit = (oldName: string) => {
        if (editName.trim() && editName.trim() !== oldName) {
            updateDivisionName(oldName, editName.trim());
        }
        setEditingDivision(null);
    };

    const sortMembers = (arr: typeof members) => {
        const order = { Captain: 1, 'Vice Captain': 2, Member: 3 };
        return [...arr].sort((a, b) => order[a.role] - order[b.role]);
    };

    const getDisplayName = (name: string, role: string) => {
        if (role === 'Captain') return `Capt. ${name}`;
        if (role === 'Vice Captain') return `VC ${name}`;
        return name;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className="text-gradient">Divisions Overview</h2>
                <p className={styles.subtext}>Manage specialty teams and assign talent.</p>
                <form onSubmit={handleAddDivision} className={styles.addDivisionForm}>
                    <input
                        type="text"
                        placeholder="New division name..."
                        value={newDivisionName}
                        onChange={(e) => setNewDivisionName(e.target.value)}
                        className="glass"
                    />
                    <button type="submit" className={styles.primaryBtn}>Add Division</button>
                </form>
            </header>

            <div className={styles.grid}>
                {divisions.map((division) => {
                    const divMembers = sortMembers(members.filter((m) => m.division === division && m.status !== 'Idle'));
                    return (
                        <div key={division} className={styles.divisionCard}>
                            <div className={styles.divisionHeader}>
                                {editingDivision === division ? (
                                    <div className={styles.editControls}>
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="glass"
                                            autoFocus
                                        />
                                        <button onClick={() => handleSaveEdit(division)} className={styles.iconBtn}>💾</button>
                                        <button onClick={() => setEditingDivision(null)} className={styles.iconBtn}>❌</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.headerTitleRow}>
                                            <h3>{division}</h3>
                                            <div className={styles.actionIcons}>
                                                <button onClick={() => { setEditingDivision(division); setEditName(division); }} className={styles.iconBtn}>✏️</button>
                                                <button onClick={() => deleteDivision(division)} className={styles.iconBtn}>🗑️</button>
                                            </div>
                                        </div>
                                        <span className={styles.count}>{divMembers.length} Members</span>
                                    </>
                                )}
                            </div>

                            <div className={styles.memberList}>
                                {divMembers.length === 0 ? (
                                    <p className={styles.emptyMsg}>No members yet. Assign one below.</p>
                                ) : (
                                    divMembers.map((member) => (
                                        <div key={member.id} className={styles.memberItem}>
                                            <div className={styles.memberMain}>
                                                <span className={`${styles.indicator} ${styles[member.status.toLowerCase()]}`}></span>
                                                <p className={`${styles.memberName} ${member.role === 'Captain' ? styles.captainName : member.role === 'Vice Captain' ? styles.vcName : ''}`}>
                                                    {getDisplayName(member.name, member.role)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <MemberSearchDropdown
                                divisionName={division}
                                onAssign={(id) => updateMemberDivision(id, division)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
