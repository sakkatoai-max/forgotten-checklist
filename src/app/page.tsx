'use client';

import { useAppStore } from '@/lib/storage';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isLoaded, activeChild, toggleCheck, getDailyStatus, getCompletionRateData } = useAppStore();
  const router = useRouter();

  // Use state to avoid hydration mismatch for date
  const [todayKey, setTodayKey] = useState<string>('');
  const [displayDate, setDisplayDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setTodayKey(`${year}-${month}-${day}`);
    setDisplayDate(`${month}月${day}日`);
  }, []);

  // Completion stats
  const stats = useMemo(() => {
    if (!activeChild) return [];
    return getCompletionRateData(activeChild.id);
  }, [activeChild, getCompletionRateData]);

  if (!isLoaded) return <div className="text-center" style={{ marginTop: '2rem' }}>Loading...</div>;

  if (!activeChild) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2>ようこそ！</h2>
        <p style={{ marginBottom: '2rem' }}>まずは設定で子どもを追加してください。</p>
        <Link href="/settings" className="btn btn-primary">
          はじめる
        </Link>
      </div>
    );
  }

  const checkedIds = todayKey ? getDailyStatus(activeChild.id, todayKey) : [];
  const allRef = activeChild.items.length > 0;
  const progress = allRef ? Math.round((checkedIds.length / activeChild.items.length) * 100) : 0;

  return (
    <div>
      <header className="flex-row flex-between" style={{ marginBottom: '1rem', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', textAlign: 'left' }}>
            {displayDate} 本日のチェック
          </h1>
          <p className="muted">Hi, {activeChild.name}!</p>
        </div>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `conic-gradient(var(--success) ${progress}%, var(--gray) ${progress}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {progress}%
        </div>
      </header>

      {activeChild.items.length === 0 ? (
        <div className="card text-center">
          <p style={{ marginBottom: '1rem' }}>チェック項目がありません。</p>
          <Link href="/edit" className="btn btn-primary" style={{ width: 'auto' }}>
            項目を追加する
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginBottom: '2rem' }}>
          {activeChild.items.map(item => {
            const isChecked = checkedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(activeChild.id, todayKey, item.id)}
                className={`btn ${isChecked ? 'btn-primary' : ''}`}
                style={{
                  background: isChecked ? 'var(--success)' : 'white',
                  color: isChecked ? 'white' : 'var(--foreground)',
                  border: isChecked ? 'none' : '2px solid var(--gray)',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  fontSize: '1.4rem',
                  padding: '24px',
                  marginBottom: 0,
                  position: 'relative',
                  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <span style={{
                  fontSize: '1.8rem',
                  marginRight: '16px',
                  display: 'inline-block',
                  width: '32px',
                  textAlign: 'center'
                }}>
                  {isChecked ? '✓' : '○'}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Completion History */}
      {stats.some(d => d.rate > 0) && (
        <section className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>これまでのきろく</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100px' }}>
            {stats.slice().reverse().map((dayStat, idx) => (
              <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  height: `${Math.max(dayStat.rate, 5)}%`,
                  background: dayStat.date === todayKey ? 'var(--primary)' : 'var(--primary-light)',
                  borderRadius: '4px',
                  margin: '0 4px',
                  minHeight: '4px'
                }} />
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>
                  {dayStat.date.slice(5).replace('-', '/')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="text-center" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/edit" className="muted" style={{ textDecoration: 'underline' }}>項目をへんしゅう</Link>
        <Link href="/settings" className="muted" style={{ textDecoration: 'underline' }}>設定</Link>
      </div>

    </div>
  );
}
