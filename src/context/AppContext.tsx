"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from '@/lib/mockData';
import { supabase } from '@/lib/supabaseClient';

type AppContextType = {
    members: Member[];
    divisions: string[];
    lastUpdated: Date;
    isLoading: boolean;
    addMember: (member: Omit<Member, 'id'>) => void;
    updateMemberDivision: (memberId: string, newDivision: string) => void;
    updateMemberStatus: (memberId: string, newStatus: 'Active' | 'Idle') => void;
    updateMember: (memberId: string, updates: Partial<Member>) => void;
    deleteMember: (memberId: string) => void;
    addDivision: (divisionName: string) => void;
    deleteDivision: (divisionName: string) => void;
    updateDivisionName: (oldName: string, newName: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [members, setMembers] = useState<Member[]>([]);
    const [divisions, setDivisions] = useState<string[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(true);

    const triggerUpdate = () => setLastUpdated(new Date());

    // Initial Fetch
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            
            // Fetch Divisions
            const { data: divData } = await supabase
                .from('divisions')
                .select('name')
                .order('name');
            if (divData) setDivisions(divData.map(d => d.name));

            // Fetch Members
            const { data: memData } = await supabase
                .from('members')
                .select('*')
                .order('created_at', { ascending: true });
            if (memData) setMembers(memData as Member[]);

            setIsLoading(false);
        };

        fetchData();

        // Real-time Subscriptions
        const memberChannel = supabase
            .channel('members_changes')
            .on('postgres_changes', { event: '*', table: 'members', schema: 'public' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setMembers(prev => [...prev, payload.new as Member]);
                } else if (payload.eventType === 'UPDATE') {
                    setMembers(prev => prev.map(m => m.id === payload.new.id ? payload.new as Member : m));
                } else if (payload.eventType === 'DELETE') {
                    setMembers(prev => prev.filter(m => m.id !== payload.old.id));
                }
                triggerUpdate();
            })
            .subscribe();

        const divisionChannel = supabase
            .channel('divisions_changes')
            .on('postgres_changes', { event: '*', table: 'divisions', schema: 'public' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setDivisions(prev => [...prev, payload.new.name].sort());
                } else if (payload.eventType === 'UPDATE') {
                    setDivisions(prev => prev.map(d => d === payload.old.name ? payload.new.name : d).sort());
                } else if (payload.eventType === 'DELETE') {
                    setDivisions(prev => prev.filter(d => d !== payload.old.name));
                }
                triggerUpdate();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(memberChannel);
            supabase.removeChannel(divisionChannel);
        };
    }, []);

    const addMember = async (memberData: Omit<Member, 'id'>) => {
        await supabase.from('members').insert([memberData]);
    };

    const updateMemberDivision = async (memberId: string, newDivision: string) => {
        await supabase.from('members').update({ division: newDivision }).eq('id', memberId);
    };

    const updateMemberStatus = async (memberId: string, newStatus: 'Active' | 'Idle') => {
        await supabase.from('members').update({ status: newStatus }).eq('id', memberId);
    };

    const updateMember = async (memberId: string, updates: Partial<Member>) => {
        await supabase.from('members').update(updates).eq('id', memberId);
    };

    const deleteMember = async (memberId: string) => {
        if (confirm("Are you sure you want to delete this member?")) {
            await supabase.from('members').delete().eq('id', memberId);
        }
    };

    const addDivision = async (divisionName: string) => {
        if (!divisions.includes(divisionName)) {
            await supabase.from('divisions').insert([{ name: divisionName }]);
        }
    };

    const deleteDivision = async (divisionName: string) => {
        if (confirm(`Are you sure you want to delete the division "${divisionName}"?`)) {
            // First, update members in this division to Unassigned
            await supabase.from('members').update({ division: 'Unassigned' }).eq('division', divisionName);
            // Then delete the division
            await supabase.from('divisions').delete().eq('name', divisionName);
        }
    };

    const updateDivisionName = async (oldName: string, newName: string) => {
        if (!divisions.includes(newName)) {
            // First, update members
            await supabase.from('members').update({ division: newName }).eq('division', oldName);
            // Then update division name
            await supabase.from('divisions').update({ name: newName }).eq('name', oldName);
        }
    };

    return (
        <AppContext.Provider value={{
            members,
            divisions,
            lastUpdated,
            isLoading,
            addMember,
            updateMemberDivision,
            updateMemberStatus,
            updateMember,
            deleteMember,
            addDivision,
            deleteDivision,
            updateDivisionName
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
