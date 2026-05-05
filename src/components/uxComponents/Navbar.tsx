'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiSearch, FiBell, FiX, FiMaximize, FiMinimize, FiLogOut } from 'react-icons/fi';

const SUGGESTIONS = [
  'Finaliser maquette landing',
  'Review PR #42',
  'Réunion équipe vendredi',
];

const NOTIFS = [
  { text: 'Marie a commenté une tâche', time: 'il y a 5 min', dot: true },
  { text: 'Tâche "API auth" marquée terminée', time: 'il y a 1h', dot: false },
  { text: 'Rappel : deadline projet demain', time: 'il y a 2h', dot: true },
];

const IconBtn = ({
  onClick, children, title,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 32, height: 32, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'none', border: '1px solid #e8e6e1',
      borderRadius: 8, cursor: 'pointer', color: '#888580', position: 'relative',
      transition: 'all 0.15s', flexShrink: 0,
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.background = '#f5f4f1';
      (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.background = 'none';
      (e.currentTarget as HTMLButtonElement).style.color = '#888580';
    }}
  >
    {children}
  </button>
);

export default function Navbar({ title = "Vue d'ensemble" }: { title?: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  return (
    <header style={{
      height: 56,
      background: '#fff',
      borderBottom: '1px solid #e8e6e1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      zIndex: 10,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <h1 style={{ fontSize: 13.5, fontWeight: 500, color: '#1a1a1a', margin: 0, letterSpacing: '-0.01em' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

        {/* Search */}
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="open"
              initial={{ width: 32, opacity: 0.5 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 32, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#f5f4f1', border: '1px solid #e8e6e1',
                borderRadius: 8, padding: '0 10px', height: 32, overflow: 'hidden',
                position: 'relative',
              }}
            >
              <FiSearch size={13} style={{ color: '#888580', flexShrink: 0 }} />
              <input
                autoFocus
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Rechercher..."
                style={{
                  border: 'none', background: 'none', outline: 'none',
                  fontSize: 12.5, color: '#1a1a1a', width: '100%',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchVal(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0aeaa', display: 'flex', padding: 0, flexShrink: 0 }}
              >
                <FiX size={13} />
              </button>
              {searchVal.length === 0 && (
                <div style={{
                  position: 'absolute', top: 38, left: 0, right: 0,
                  background: '#fff', border: '1px solid #e8e6e1',
                  borderRadius: 9, padding: '4px',
                  animation: 'fadeDown 0.15s ease',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}>
                  <p style={{ fontSize: 10.5, color: '#b0aeaa', padding: '4px 8px', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Récent</p>
                  {SUGGESTIONS.map(s => (
                    <div key={s} style={{
                      padding: '7px 8px', fontSize: 12.5, color: '#888580',
                      borderRadius: 6, cursor: 'pointer', transition: 'background 0.12s',
                      display: 'flex', alignItems: 'center', gap: 8,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f5f4f1'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                      <FiSearch size={11} style={{ color: '#c8c6c2' }} />
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.button
              key="closed"
              onClick={() => setSearchOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                width: 32, height: 32, display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: 'none', border: '1px solid #e8e6e1',
                borderRadius: 8, cursor: 'pointer', color: '#888580', transition: 'all 0.15s',
              }}
              whileHover={{ backgroundColor: '#f5f4f1' }}
            >
              <FiSearch size={13} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <IconBtn onClick={() => setNotifOpen(!notifOpen)} title="Notifications">
            <FiBell size={13} />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 5, height: 5, borderRadius: '50%',
              background: '#1a1a1a', border: '1.5px solid #fff',
              pointerEvents: 'none',
            }} />
          </IconBtn>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: 40, right: 0,
                  width: 280, background: '#fff',
                  border: '1px solid #e8e6e1', borderRadius: 12,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid #f0efeb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: '#1a1a1a' }}>Notifications</span>
                  <span style={{ fontSize: 11, color: '#b0aeaa', cursor: 'pointer' }}>Tout lire</span>
                </div>
                {NOTIFS.map((n, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start',
                    borderBottom: i < NOTIFS.length - 1 ? '1px solid #f5f4f1' : 'none',
                    transition: 'background 0.12s', cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: n.dot ? '#1a1a1a' : '#e8e6e1' }} />
                    <div>
                      <p style={{ fontSize: 12.5, color: '#1a1a1a', margin: '0 0 2px', lineHeight: 1.4 }}>{n.text}</p>
                      <p style={{ fontSize: 11, color: '#b0aeaa', margin: 0 }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: '#e8e6e1', margin: '0 2px' }} />

        {/* Fullscreen */}
        <IconBtn onClick={toggleFullscreen} title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}>
          {isFullscreen ? <FiMinimize size={13} /> : <FiMaximize size={13} />}
        </IconBtn>

        {/* Logout */}
        <button
          title="Se déconnecter"
          onClick={() => { /* handle logout */ }}
          style={{
            width: 32, height: 32, display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'none', border: '1px solid #e8e6e1',
            borderRadius: 8, cursor: 'pointer', color: '#888580',
            transition: 'all 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#fff0f0';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#fcd0d0';
            (e.currentTarget as HTMLButtonElement).style.color = '#c0392b';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e6e1';
            (e.currentTarget as HTMLButtonElement).style.color = '#888580';
          }}
        >
          <FiLogOut size={13} />
        </button>
      </div>
    </header>
  );
}