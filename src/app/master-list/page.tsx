"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import styles from './page.module.css';

const ROLES = ['Captain', 'Vice Captain', 'Member'] as const;
const GENDERS = ['Male', 'Female', 'Other'] as const;
const STATUSES = ['Active', 'Idle'] as const;

type FormData = {
    name: string;
    role: 'Captain' | 'Vice Captain' | 'Member';
    gender: 'Male' | 'Female' | 'Other';
    division: string;
    status: 'Active' | 'Idle';
    range: string;
    specialties: string;
};

const defaultForm: FormData = {
    name: '',
    role: 'Member',
    gender: 'Male',
    division: 'Unassigned',
    status: 'Active',
    range: '',
    specialties: '',
};

export default function MasterList() {
    const { members, divisions, addMember, updateMemberStatus, updateMember, deleteMember, isLoading } = useAppContext();

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Syncing with database...</p>
            </div>
        );
    }
    
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [genderFilter, setGenderFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [divisionFilter, setDivisionFilter] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<FormData>(defaultForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<FormData>>({});

    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'All' || m.role === roleFilter;
        const matchesGender = genderFilter === 'All' || m.gender === genderFilter;
        const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
        const matchesDivision = divisionFilter === 'All' || m.division === divisionFilter;
        return matchesSearch && matchesRole && matchesGender && matchesStatus && matchesDivision;
    });

    const activeFilterCount = [
        roleFilter !== 'All',
        genderFilter !== 'All',
        statusFilter !== 'All',
        divisionFilter !== 'All'
    ].filter(Boolean).length;

    const resetFilters = () => {
        setRoleFilter('All');
        setGenderFilter('All');
        setStatusFilter('All');
        setDivisionFilter('All');
        setSearch('');
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleStartEdit = (member: any) => {
        setEditingId(member.id);
        setEditForm({
            name: member.name,
            role: member.role,
            gender: member.gender,
        });
    };

    const handleSaveEdit = (id: string) => {
        updateMember(id, {
            name: editForm.name,
            role: editForm.role as any,
            gender: editForm.gender as any,
        });
        setEditingId(null);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        addMember({
            name: form.name.trim(),
            role: form.role,
            gender: form.gender,
            division: form.division,
            status: form.status,
            range: form.range,
            specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
        });
        setForm(defaultForm);
        setShowForm(false);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitleRow}>
                    <h2 className="text-gradient">Master Talent List</h2>
                    <span className={styles.memberCount}>({filteredMembers.length})</span>
                </div>
                <div className={styles.filtersWrapper}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            className="glass"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterMenuRow}>
                        <div className={styles.filterDropdownContainer}>
                            <button 
                                className={`${styles.filterToggleBtn} ${activeFilterCount > 0 ? styles.hasActiveFilters : ''}`}
                                onClick={() => setShowFilters(v => !v)}
                            >
                                🎯 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                            </button>
                            
                            {showFilters && (
                                <div className={`${styles.filterPanel} glass`}>
                                    <div className={styles.filterSection}>
                                        <label>Role</label>
                                        <select className={styles.filterSelect} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                            <option value="All">All Roles</option>
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.filterSection}>
                                        <label>Gender</label>
                                        <select className={styles.filterSelect} value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
                                            <option value="All">All Genders</option>
                                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.filterSection}>
                                        <label>Status</label>
                                        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                            <option value="All">All Statuses</option>
                                            <option value="Active">Active</option>
                                            <option value="Idle">Idle</option>
                                        </select>
                                    </div>
                                    <div className={styles.filterSection}>
                                        <label>Division</label>
                                        <select className={styles.filterSelect} value={divisionFilter} onChange={(e) => setDivisionFilter(e.target.value)}>
                                            <option value="All">All Divisions</option>
                                            <option value="Unassigned">Unassigned</option>
                                            {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.filterActions}>
                                        <button onClick={resetFilters} className={styles.resetBtn}>Reset All</button>
                                        <button onClick={() => setShowFilters(false)} className={styles.applyBtn}>Done</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className={styles.addBtn} onClick={() => setShowForm(v => !v)}>
                            {showForm ? '✕ Cancel' : '＋ Add Talent'}
                        </button>
                    </div>
                </div>
            </header>

            {showForm && (
                <form onSubmit={handleSubmit} className={`${styles.addForm} glass`}>
                    <h3 className={styles.formTitle}>Induct New Talent</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label>Name *</label>
                            <input name="name" placeholder="Stage name or alias" className="glass" value={form.name} onChange={handleFormChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Role</label>
                            <select name="role" className="glass" value={form.role} onChange={handleFormChange}>
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Gender</label>
                            <select name="gender" className="glass" value={form.gender} onChange={handleFormChange}>
                                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Status</label>
                            <select name="status" className="glass" value={form.status} onChange={handleFormChange}>
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Division</label>
                            <select name="division" className="glass" value={form.division} onChange={handleFormChange}>
                                <option value="Unassigned">Unassigned</option>
                                {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Vocal Range</label>
                            <input name="range" placeholder="e.g. Baritone, Soprano" className="glass" value={form.range} onChange={handleFormChange} />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Specialties <span className={styles.hint}>(comma-separated)</span></label>
                        <input name="specialties" placeholder="e.g. Goku, Naruto, Batman" className="glass" value={form.specialties} onChange={handleFormChange} />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitBtn}>✓ Induct Member</button>
                    </div>
                </form>
            )}

            <div className={`${styles.tableWrapper} glass`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Gender</th>
                            <th>Division</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map(member => (
                            <tr key={member.id} className={member.status === 'Idle' ? styles.idleRow : ''}>
                                <td>
                                    {editingId === member.id ? (
                                        <input
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleEditChange}
                                            className={styles.inlineInput}
                                        />
                                    ) : (
                                        <div className={styles.nameCell}>
                                            <div className={styles.avatar}>{member.name[0].toUpperCase()}</div>
                                            {member.name}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {editingId === member.id ? (
                                        <select
                                            name="role"
                                            value={editForm.role}
                                            onChange={handleEditChange}
                                            className={styles.inlineSelect}
                                        >
                                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    ) : (
                                        <span className={`${styles.roleBadge} ${styles[member.role.replace(' ', '')]}`}>
                                            {member.role}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {editingId === member.id ? (
                                        <select
                                            name="gender"
                                            value={editForm.gender}
                                            onChange={handleEditChange}
                                            className={styles.inlineSelect}
                                        >
                                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    ) : (
                                        member.gender
                                    )}
                                </td>
                                <td><span className={styles.divisionTag}>{member.division}</span></td>
                                <td>
                                    <select
                                        className={`${styles.statusSelect} ${styles[member.status.toLowerCase()]}`}
                                        value={member.status}
                                        onChange={(e) => updateMemberStatus(member.id, e.target.value as any)}
                                    >
                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        {editingId === member.id ? (
                                            <>
                                                <button onClick={() => handleSaveEdit(member.id)} className={styles.saveBtn} title="Save">💾</button>
                                                <button onClick={handleCancelEdit} className={styles.cancelBtn} title="Cancel">❌</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleStartEdit(member)} className={styles.editBtnIcon} title="Edit">✏️</button>
                                                <button onClick={() => deleteMember(member.id)} className={styles.deleteBtn} title="Delete">🗑️</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
