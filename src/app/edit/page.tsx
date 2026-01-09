'use client';

import { useState } from 'react';
import { useAppStore, generateId } from '@/lib/storage';
import { CheckItem } from '@/lib/types';
import Link from 'next/link';

export default function EditPage() {
    const { isLoaded, activeChild, updateChildItems } = useAppStore();
    const [newItemLabel, setNewItemLabel] = useState('');

    if (!isLoaded) return <div className="text-center">Loading...</div>;

    if (!activeChild) {
        return (
            <div className="text-center" style={{ marginTop: '2rem' }}>
                <p>子どもが選択されていません。</p>
                <Link href="/settings" className="btn btn-primary" style={{ marginTop: '1rem', width: 'auto' }}>
                    設定画面へ
                </Link>
            </div>
        );
    }

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemLabel.trim()) return;

        const newItem: CheckItem = {
            id: generateId(),
            label: newItemLabel.trim(),
        };

        updateChildItems(activeChild.id, [...activeChild.items, newItem]);
        setNewItemLabel('');
    };

    const handleDeleteItem = (itemId: string) => {
        if (window.confirm('この項目を削除しますか？')) {
            const newItems = activeChild.items.filter(i => i.id !== itemId);
            updateChildItems(activeChild.id, newItems);
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...activeChild.items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        updateChildItems(activeChild.id, newItems);
    };

    return (
        <div>
            <h1>項目のへんしゅう</h1>
            <p className="text-center" style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
                {activeChild.name} さんの持ち物
            </p>

            <section className="card">
                <form onSubmit={handleAddItem} className="flex-row">
                    <input
                        type="text"
                        placeholder="新しい項目（例：ハンカチ）"
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        style={{ marginBottom: 0 }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginBottom: 0, padding: '16px' }}>
                        追加
                    </button>
                </form>
            </section>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeChild.items.map((item, index) => (
                    <div key={item.id} className="card flex-row flex-between" style={{ padding: '12px', alignItems: 'center', marginBottom: 0 }}>
                        <span style={{ fontSize: '1.2rem', flex: 1 }}>{item.label}</span>

                        <div className="flex-row">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <button
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        background: index === 0 ? '#eee' : 'var(--primary-light)',
                                        color: index === 0 ? '#ccc' : 'var(--primary)'
                                    }}
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === activeChild.items.length - 1}
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        background: index === activeChild.items.length - 1 ? '#eee' : 'var(--primary-light)',
                                        color: index === activeChild.items.length - 1 ? '#ccc' : 'var(--primary)'
                                    }}
                                >
                                    ▼
                                </button>
                            </div>

                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="btn-danger"
                                style={{ width: 'auto', marginBottom: 0, padding: '8px 12px', borderRadius: '8px', marginLeft: '8px' }}
                            >
                                削除
                            </button>
                        </div>
                    </div>
                ))}

                {activeChild.items.length === 0 && (
                    <p className="text-center muted">項目がありません。追加してください。</p>
                )}
            </div>
        </div>
    );
}
