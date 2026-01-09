'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/storage';

export default function SettingsPage() {
    const { isLoaded, data, addChild, deleteChild, setActiveChild } = useAppStore();
    const [newName, setNewName] = useState('');

    if (!isLoaded) return <div className="text-center">Loading...</div>;

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        addChild(newName.trim());
        setNewName('');
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`${name}くん/ちゃんを削除しますか？`)) {
            deleteChild(id);
        }
    };

    return (
        <div>
            <h1>せってい</h1>

            <section className="card">
                <h2>子どもリスト</h2>
                {data.children.length === 0 ? (
                    <p className="muted text-center">まだ登録されていません</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.children.map((child) => (
                            <div key={child.id} className="flex-row flex-between" style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                                <div className="flex-row">
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: child.id === data.activeChildId ? 'var(--primary)' : 'var(--gray)'
                                        }}
                                    />
                                    <span style={{ fontWeight: child.id === data.activeChildId ? 'bold' : 'normal', fontSize: '1.1rem' }}>
                                        {child.name}
                                    </span>
                                </div>
                                <div className="flex-row">
                                    <button
                                        onClick={() => setActiveChild(child.id)}
                                        className="btn-primary"
                                        style={{ padding: '8px 12px', fontSize: '0.9rem', borderRadius: '8px', marginBottom: 0, width: 'auto' }}
                                        disabled={child.id === data.activeChildId}
                                    >
                                        {child.id === data.activeChildId ? '選択中' : '選ぶ'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(child.id, child.name)}
                                        className="btn-danger"
                                        style={{ padding: '8px 12px', fontSize: '0.9rem', borderRadius: '8px', marginBottom: 0, width: 'auto' }}
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="card">
                <h2>子どもを追加</h2>
                <form onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="なまえを入力（例：たろう）"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        追加する
                    </button>
                </form>
            </section>

            <div className="text-center muted" style={{ marginTop: '2rem' }}>
                バージョン: {data.version}
            </div>
        </div>
    );
}
