'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  FiGrid, FiFolder, FiCalendar,
  FiUsers, FiSettings, FiChevronLeft, FiPlus, FiInbox,
} from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

const NAV_ITEMS = [
  { icon: FiGrid,        label: 'Vue d\'ensemble', href: ROUTES.DASHBOARD.ROOT },
  { icon: FiInbox,       label: 'Mes tâches',      href: ROUTES.DASHBOARD.TASKS },
  { icon: FiFolder,      label: 'Projets',          href: ROUTES.DASHBOARD.PROJECTS },
  { icon: FiCalendar,    label: 'Calendrier',       href: ROUTES.DASHBOARD.CALENDAR },
  { icon: FiUsers,       label: 'Équipe',           href: ROUTES.DASHBOARD.TEAM },
];

const PROJECTS = [
  { name: 'Site vitrine', color: '#1a1a1a' },
  { name: 'App mobile',   color: '#888580' },
  { name: 'API v2',       color: '#b0aeaa' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: '100vh',
        background: '#fff',
        borderRight: '1px solid #e8e6e1',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Logo + toggle */}
      <div style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: collapsed ? '0 18px' : '0 16px 0 18px',
        borderBottom: '1px solid #f0efeb',
        flexShrink: 0,
      }}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <div style={{
                width: 26, height: 26, background: '#1a1a1a',
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Image src="/icon.svg" alt="structure" width={24} height={24} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', fontFamily: "'DM Mono', monospace", letterSpacing: '-0.02em' }}>
                structure
              </span>
            </motion.div>
          )}
          {collapsed && (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: 26, height: 26, background: '#1a1a1a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white"/>
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5"/>
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#b0aeaa', padding: 4, display: 'flex', borderRadius: 5,
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; (e.currentTarget as HTMLButtonElement).style.background = '#f5f4f1'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#b0aeaa'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >
            <FiChevronLeft size={14} />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#b0aeaa', padding: 4, display: 'flex', borderRadius: 5,
              transform: 'rotate(180deg)',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; (e.currentTarget as HTMLButtonElement).style.background = '#f5f4f1'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#b0aeaa'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >
            <FiChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href || (href !== ROUTES.DASHBOARD.ROOT && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '8px 10px' : '8px 10px',
                borderRadius: 8,
                background: active ? '#f5f4f1' : 'transparent',
                color: active ? '#1a1a1a' : '#888580',
                fontSize: 12.5, fontWeight: active ? 500 : 400,
                transition: 'all 0.15s',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#f9f8f7'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <Icon size={14} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ overflow: 'hidden' }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}

        {/* Projects section */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: 20 }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 10px', marginBottom: 6,
            }}>
              <span style={{ fontSize: 10.5, fontWeight: 500, color: '#b0aeaa', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Projets
              </span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b0aeaa', display: 'flex', padding: 2 }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#b0aeaa'; }}>
                <FiPlus size={12} />
              </button>
            </div>
            {PROJECTS.map(p => (
              <Link key={p.name} href="#" style={{ textDecoration: 'none', display: 'block', marginBottom: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 8, fontSize: 12.5,
                  color: '#888580', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f9f8f7'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                  <span>{p.name}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Settings */}
      <div style={{ padding: '8px', borderTop: '1px solid #f0efeb', flexShrink: 0 }}>
        <Link href={ROUTES.DASHBOARD.SETTINGS} style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 8,
            color: '#888580', fontSize: 12.5,
            transition: 'background 0.15s',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f9f8f7'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
          >
            <FiSettings size={14} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  Paramètres
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Avatar */}
        <Link href={ROUTES.DASHBOARD.PROFIL} style={{ textDecoration: 'none', display: 'block' }}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 10px 6px', borderRadius: 8,
                transition: 'background 0.15s', cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f9f8f7'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#1a1a1a', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10.5, fontWeight: 500, color: '#fff',
              }}>
                JD
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Jean Dupont</p>
                <p style={{ fontSize: 11, color: '#b0aeaa', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>jean@exemple.com</p>
              </div>
            </motion.div>
          )}
          {collapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#1a1a1a', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 10.5, fontWeight: 500, color: '#fff',
                transition: 'background 0.15s', cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#333'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#1a1a1a'; }}
              >
                JD
              </div>
            </div>
          )}
        </Link>
      </div>
    </motion.aside>
  );
}
