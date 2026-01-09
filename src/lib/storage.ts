'use client';

import { useState, useEffect, useCallback } from 'react';
import { StorageData, Child, CheckItem } from './types';

const STORAGE_KEY = 'forgotten-checklist-v1';

const INITIAL_DATA: StorageData = {
    children: [],
    activeChildId: null,
    daily: {},
    version: 1,
};

export function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

// Low-level storage access
function loadFromStorage(): StorageData {
    if (typeof window === 'undefined') return INITIAL_DATA;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return INITIAL_DATA;
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to load data', e);
        return INITIAL_DATA;
    }
}

function saveToStorage(data: StorageData) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save data', e);
    }
}

// Main hook
export function useAppStore() {
    const [data, setData] = useState<StorageData>(INITIAL_DATA);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load on mount
    useEffect(() => {
        const loaded = loadFromStorage();
        setData(loaded);
        setIsLoaded(true);
    }, []);

    // Save on change (debouncing could be added if needed, but for this size direct save is fine)
    useEffect(() => {
        if (isLoaded) {
            saveToStorage(data);
        }
    }, [data, isLoaded]);

    const addChild = useCallback((name: string) => {
        const newChild: Child = {
            id: generateId(),
            name,
            items: [], // Start with empty, or maybe default items?
        };
        setData((prev) => {
            const newData = {
                ...prev,
                children: [...prev.children, newChild],
                // If it's the first child, make them active
                activeChildId: prev.activeChildId || newChild.id
            };
            return newData;
        });
    }, []);

    const deleteChild = useCallback((childId: string) => {
        setData((prev) => {
            const newChildren = prev.children.filter(c => c.id !== childId);
            let newActiveId = prev.activeChildId;
            if (newActiveId === childId) {
                newActiveId = newChildren.length > 0 ? newChildren[0].id : null;
            }
            return {
                ...prev,
                children: newChildren,
                activeChildId: newActiveId
            };
        });
    }, []);

    const setActiveChild = useCallback((childId: string) => {
        setData(prev => ({ ...prev, activeChildId: childId }));
    }, []);

    const updateChildItems = useCallback((childId: string, items: CheckItem[]) => {
        setData(prev => ({
            ...prev,
            children: prev.children.map(c => c.id === childId ? { ...c, items } : c)
        }));
    }, []);

    const updateChildName = useCallback((childId: string, name: string) => {
        setData(prev => ({
            ...prev,
            children: prev.children.map(c => c.id === childId ? { ...c, name } : c)
        }));
    }, []);

    const toggleCheck = useCallback((childId: string, date: string, itemId: string) => {
        setData(prev => {
            const childDaily = prev.daily[childId] || {};
            const dayRecord = childDaily[date] || { checkedItemIds: [] };
            const isChecked = dayRecord.checkedItemIds.includes(itemId);

            let newCheckedIds;
            if (isChecked) {
                newCheckedIds = dayRecord.checkedItemIds.filter(id => id !== itemId);
            } else {
                newCheckedIds = [...dayRecord.checkedItemIds, itemId];
            }

            return {
                ...prev,
                daily: {
                    ...prev.daily,
                    [childId]: {
                        ...childDaily,
                        [date]: { checkedItemIds: newCheckedIds }
                    }
                }
            };
        });
    }, []);

    // Helper getters
    const activeChild = data.children.find(c => c.id === data.activeChildId) || null;

    const getDailyStatus = useCallback((childId: string, date: string) => {
        return data.daily[childId]?.[date]?.checkedItemIds || [];
    }, [data.daily]);

    // Completion rate logic
    const getCompletionRateData = useCallback((childId: string) => {
        // Past 7 days
        const history = [];
        const now = new Date();
        // If child doesn't exist or has no items, return 0s?
        const child = data.children.find(c => c.id === childId);
        const totalItems = child?.items.length || 0;

        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            const checkedCount = data.daily[childId]?.[dateKey]?.checkedItemIds.length || 0;
            // Avoid division by zero
            const rate = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
            history.push({ date: dateKey, rate, checkedCount, totalItems });
        }
        return history;
    }, [data]);

    return {
        data,
        isLoaded,
        addChild,
        deleteChild,
        setActiveChild,
        updateChildItems,
        updateChildName,
        toggleCheck,
        activeChild,
        getDailyStatus,
        getCompletionRateData
    };
}
