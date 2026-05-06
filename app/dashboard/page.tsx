'use client';

import { motion } from 'motion/react';
import {
  FiCheckCircle, FiClock, FiAlertCircle, FiTrendingUp,
  FiMoreHorizontal, FiArrowRight, FiCircle,
} from 'react-icons/fi';

const STATS = [
  { label: 'Tâches totales',   value: '48',  sub: '+3 cette semaine',   icon: FiTrendingUp,  trend: 'up' },
  { label: 'Terminées',        value: '31',  sub: '64% du total',        icon: FiCheckCircle, trend: 'good' },
  { label: 'En cours',         value: '12',  sub: '3 en retard',         icon: FiClock,       trend: 'warn' },
  { label: 'En attente',       value: '5',   sub: 'Non assignées',       icon: FiAlertCircle, trend: 'neutral' },
];

const TASKS = [
  { title: 'Finaliser la maquette landing page',   project: 'Site vitrine', status: 'done',    priority: 'haute',   assignee: 'MR', due: 'Aujourd\'hui' },
  { title: 'Implémenter l\'authentification OAuth', project: 'API v2',      status: 'inprogress', priority: 'haute', assignee: 'JD', due: 'Demain' },
  { title: 'Tests unitaires module paiement',       project: 'App mobile',  status: 'inprogress', priority: 'moyenne', assignee: 'AL', due: '8 mai' },
  { title: 'Rédiger doc technique endpoints',       project: 'API v2',      status: 'todo',    priority: 'basse',   assignee: 'JD', due: '10 mai' },
  { title: 'Recette design système components',     project: 'Site vitrine', status: 'todo',   priority: 'moyenne', assignee: 'MR', due: '12 mai' },
  { title: 'Déploiement staging v1.4',              project: 'App mobile',  status: 'todo',    priority: 'haute',   assignee: 'AL', due: '14 mai' },
];

const PROJECTS = [
  { name: 'Site vitrine', tasks: 18, done: 12, color: '#1a1a1a' },
  { name: 'API v2',       tasks: 14, done: 8,  color: '#888580' },
  { name: 'App mobile',   tasks: 16, done: 11, color: '#b0aeaa' },
];

const WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const TODAY = 1; // mardi = index 1
const WEEK_TASKS = [3, 5, 2, 4, 1, 0, 0];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  done:       { label: 'Terminé',   bg: '#f0faf5', color: '#0f6e56' },
  inprogress: { label: 'En cours',  bg: '#fafaf9', color: '#5f5e5a' },
  todo:       { label: 'À faire',   bg: '#f5f4f1', color: '#888580' },
};

const priorityConfig: Record<string, { color: string }> = {
  haute:   { color: '#1a1a1a' },
  moyenne: { color: '#888580' },
  basse:   { color: '#c8c6c2' },
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } as const,
});

export default function DashboardPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1200, padding: '0 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 2px; }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .main-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .table-header {
            display: none !important;
          }
          .table-row {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
            padding: 12px !important;
          }
          .task-title {
            font-size: 13px !important;
            margin-bottom: 8px !important;
          }
          .task-meta {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            font-size: 11px !important;
          }
          .week-grid {
            grid-template-columns: repeat(7, 1fr) !important;
            gap: 2px !important;
          }
          .week-day {
            font-size: 9px !important;
          }
          .week-number {
            width: 24px !important;
            height: 24px !important;
            font-size: 10px !important;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .header-text {
            font-size: 18px !important;
          }
          .container {
            padding: 0 12px !important;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12.5, color: '#b0aeaa', margin: '0 0 4px', fontFamily: "'DM Mono', monospace" }}>
          mardi 6 mai 2025
        </p>
        <h2 className="header-text" style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a', margin: 0, letterSpacing: '-0.02em' }}>
          Bonjour, Jean 👋
        </h2>
        <p style={{ fontSize: 12.5, color: '#888580', margin: '4px 0 0' }}>
          Vous avez <strong style={{ color: '#1a1a1a', fontWeight: 500 }}>5 tâches</strong> à traiter aujourd'hui.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeUp(1)} className="stats-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12, marginBottom: 24,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '16px 16px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11.5, color: '#b0aeaa', fontWeight: 400, letterSpacing: '0.01em' }}>{s.label}</span>
              <s.icon size={13} style={{ color: '#c8c6c2', marginTop: 1 }} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '-0.03em', fontFamily: "'DM Mono', monospace" }}>
              {s.value}
            </p>
            <p style={{ fontSize: 11.5, color: '#b0aeaa', margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Main grid */}
      <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, alignItems: 'start' }}>

        {/* Tasks table */}
        <motion.div {...fadeUp(2)} style={{
          background: '#fff', border: '1px solid #e8e6e1',
          borderRadius: 12, overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f0efeb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Tâches récentes</span>
            <button style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: 12,
              color: '#888580', display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: "'DM Sans', sans-serif", padding: 0,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#888580'; }}>
              Voir tout <FiArrowRight size={11} />
            </button>
          </div>

          {/* Table header */}
          <div className="table-header" style={{
            display: 'grid', gridTemplateColumns: '1fr 110px 90px 80px 70px',
            padding: '8px 18px', borderBottom: '1px solid #f5f4f1',
          }}>
            {['Tâche', 'Projet', 'Statut', 'Priorité', 'Échéance'].map(h => (
              <span key={h} style={{ fontSize: 10.5, color: '#b0aeaa', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {TASKS.map((t, i) => {
            const st = statusConfig[t.status];
            const pr = priorityConfig[t.priority];
            return (
              <div key={i} className="table-row" style={{
                display: 'grid', gridTemplateColumns: '1fr 110px 90px 80px 70px',
                padding: '11px 18px',
                borderBottom: i < TASKS.length - 1 ? '1px solid #f9f8f6' : 'none',
                alignItems: 'center', cursor: 'pointer', transition: 'background 0.12s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                <div className="task-title" style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                  {t.status === 'done'
                    ? <FiCheckCircle size={13} style={{ color: '#1d9e75', flexShrink: 0 }} />
                    : <FiCircle size={13} style={{ color: '#d8d6d2', flexShrink: 0 }} />
                  }
                  <span style={{
                    fontSize: 12.5, color: t.status === 'done' ? '#b0aeaa' : '#1a1a1a',
                    textDecoration: t.status === 'done' ? 'line-through' : 'none',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{t.title}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11.5, color: '#888580' }}>{t.project}</span>
                </div>
                <div>
                  <span style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 5, width: 'fit-content',
                    background: st.bg, color: st.color, fontWeight: 400,
                  }}>{st.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: pr.color }} />
                  <span style={{ fontSize: 11.5, color: '#888580' }}>{t.priority}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11.5, color: '#888580' }}>{t.due}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Week calendar */}
          <motion.div {...fadeUp(3)} style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '16px',
          }}>
            <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Cette semaine</span>
              <span style={{ fontSize: 11, color: '#b0aeaa', fontFamily: "'DM Mono', monospace" }}>Mai 2025</span>
            </div>
            <div className="week-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {WEEK.map((d, i) => {
                const isToday = i === TODAY;
                const count = WEEK_TASKS[i];
                return (
                  <div key={d} style={{ textAlign: 'center' }}>
                    <p className="week-day" style={{ fontSize: 10, color: isToday ? '#1a1a1a' : '#b0aeaa', fontWeight: isToday ? 500 : 400, margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{d}</p>
                    <div className="week-number" style={{
                      width: 28, height: 28, borderRadius: 7, margin: '0 auto',
                      background: isToday ? '#1a1a1a' : '#f5f4f1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 11.5, fontWeight: 500, color: isToday ? '#fff' : '#888580', fontFamily: "'DM Mono', monospace" }}>{5 + i}</span>
                    </div>
                    {count > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4, gap: 2 }}>
                        {Array.from({ length: Math.min(count, 3) }).map((_, k) => (
                          <div key={k} style={{ width: 3, height: 3, borderRadius: '50%', background: isToday ? '#1a1a1a' : '#c8c6c2' }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div {...fadeUp(4)} style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '16px',
          }}>
            <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Projets actifs</span>
              <FiMoreHorizontal size={14} style={{ color: '#c8c6c2', cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PROJECTS.map((p, i) => {
                const pct = Math.round((p.done / p.tasks) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 7, height: 7, borderRadius: 2, background: p.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, color: '#1a1a1a' }}>{p.name}</span>
                      </div>
                      <span style={{ fontSize: 11.5, color: '#b0aeaa', fontFamily: "'DM Mono', monospace" }}>{p.done}/{p.tasks}</span>
                    </div>
                    <div style={{ height: 3, background: '#f0efeb', borderRadius: 2 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', background: p.color, borderRadius: 2 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div {...fadeUp(5)} style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '16px',
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', display: 'block', marginBottom: 14 }}>Activité récente</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { avatar: 'MR', text: 'a terminé "Maquette hero"',     time: '5 min' },
                { avatar: 'AL', text: 'a commenté sur "API auth"',     time: '1h' },
                { avatar: 'JD', text: 'a créé "Tests paiement"',       time: '2h' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: '#1a1a1a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 500, color: '#fff', flexShrink: 0,
                  }}>{a.avatar}</div>
                  <div>
                    <p style={{ fontSize: 12, color: '#1a1a1a', margin: '0 0 2px', lineHeight: 1.4 }}>
                      <strong style={{ fontWeight: 500 }}>{a.avatar}</strong> {a.text}
                    </p>
                    <p style={{ fontSize: 11, color: '#b0aeaa', margin: 0 }}>Il y a {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}