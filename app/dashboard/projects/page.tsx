'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FiPlus, FiSearch, FiMoreHorizontal, FiFolder, FiCalendar,
  FiUser, FiTrendingUp, FiClock, FiCheckCircle,
} from 'react-icons/fi';

const PROJECTS = [
  {
    id: 1,
    name: 'Site vitrine',
    description: 'Refonte complète du site corporate avec design system moderne',
    status: 'active',
    progress: 67,
    tasks: 18,
    completed: 12,
    team: ['MR', 'AL', 'JD'],
    deadline: '15 mai',
    color: '#1a1a1a',
    priority: 'haute',
  },
  {
    id: 2,
    name: 'App mobile',
    description: 'Application iOS/Android de gestion de projet',
    status: 'active',
    progress: 81,
    tasks: 16,
    completed: 13,
    team: ['AL', 'MR'],
    deadline: '22 mai',
    color: '#888580',
    priority: 'moyenne',
  },
  {
    id: 3,
    name: 'API v2',
    description: 'Nouvelle version de l\'API REST avec authentification OAuth',
    status: 'active',
    progress: 57,
    tasks: 14,
    completed: 8,
    team: ['JD', 'AL'],
    deadline: '30 mai',
    color: '#b0aeaa',
    priority: 'haute',
  },
  {
    id: 4,
    name: 'Dashboard analytics',
    description: 'Tableau de bord en temps réel avec métriques avancées',
    status: 'planning',
    progress: 15,
    tasks: 8,
    completed: 1,
    team: ['MR'],
    deadline: '10 juin',
    color: '#c8c6c2',
    priority: 'basse',
  },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: 'Actif', bg: '#f0faf5', color: '#0f6e56' },
  planning: { label: 'Planification', bg: '#fafaf9', color: '#5f5e5a' },
  completed: { label: 'Terminé', bg: '#f5f4f1', color: '#888580' },
};

const priorityConfig: Record<string, { color: string }> = {
  haute: { color: '#1a1a1a' },
  moyenne: { color: '#888580' },
  basse: { color: '#c8c6c2' },
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } as const,
});

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredProjects = PROJECTS.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: PROJECTS.length,
    active: PROJECTS.filter(p => p.status === 'active').length,
    planning: PROJECTS.filter(p => p.status === 'planning').length,
    completed: PROJECTS.filter(p => p.status === 'completed').length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1200, padding: '0 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 2px; }
        
        @media (max-width: 768px) {
          .header-flex {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .filters-flex {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .search-container {
            max-width: 100% !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .projects-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .project-card {
            padding: 16px !important;
          }
          .container {
            padding: 0 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .header-text {
            font-size: 18px !important;
          }
          .button-text {
            font-size: 11px !important;
            padding: 6px 12px !important;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 className="header-text" style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Projets
            </h2>
            <p style={{ fontSize: 12.5, color: '#888580', margin: 0 }}>
              {filteredProjects.length} projets trouvés
            </p>
          </div>
          <button className="button-text" style={{
            background: '#1a1a1a', color: '#fff', border: 'none',
            borderRadius: 8, padding: '8px 16px', fontSize: 12.5,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}>
            <FiPlus size={14} />
            Nouveau projet
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiFolder size={14} style={{ color: '#c8c6c2' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Total</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.total}
            </p>
          </div>
          
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiTrendingUp size={14} style={{ color: '#1d9e75' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Actifs</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.active}
            </p>
          </div>
          
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiClock size={14} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Planification</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.planning}
            </p>
          </div>
          
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiCheckCircle size={14} style={{ color: '#6b7280' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Terminés</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="filters-flex" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#b0aeaa' }} />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 36px',
                border: '1px solid #e8e6e1', borderRadius: 8,
                fontSize: 12.5, color: '#1a1a1a',
                background: '#fff',
                outline: 'none',
              }}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid #e8e6e1',
              borderRadius: 8, fontSize: 12.5, color: '#1a1a1a',
              background: '#fff', cursor: 'pointer',
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="planning">Planification</option>
            <option value="completed">Terminés</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid #e8e6e1',
              borderRadius: 8, fontSize: 12.5, color: '#1a1a1a',
              background: '#fff', cursor: 'pointer',
            }}
          >
            <option value="all">Toutes les priorités</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>
        </div>
      </motion.div>

      {/* Projects grid */}
      <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
        {filteredProjects.map((project, i) => {
          const st = statusConfig[project.status];
          const pr = priorityConfig[project.priority];
          return (
            <motion.div
              key={project.id}
              {...fadeUp(i + 1)}
              className="project-card"
              style={{
                background: '#fff', border: '1px solid #e8e6e1',
                borderRadius: 12, padding: '20px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: project.color, flexShrink: 0 }} />
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>
                    {project.name}
                  </h3>
                </div>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#c8c6c2', padding: 4, borderRadius: 4,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#c8c6c2'; }}>
                  <FiMoreHorizontal size={14} />
                </button>
              </div>

              <p style={{ fontSize: 12.5, color: '#888580', margin: '0 0 16px', lineHeight: 1.4 }}>
                {project.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Statut:</span>
                  <span style={{
                    fontSize: 11, padding: '2px 6px', borderRadius: 4,
                    background: st.bg, color: st.color, fontWeight: 400,
                  }}>{st.label}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Priorité:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: pr.color }} />
                    <span style={{ fontSize: 11.5, color: '#888580' }}>{project.priority}</span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Progression</span>
                  <span style={{ fontSize: 11.5, color: '#1a1a1a', fontFamily: "'DM Mono', monospace" }}>
                    {project.progress}%
                  </span>
                </div>
                <div style={{ height: 4, background: '#f0efeb', borderRadius: 2 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: project.color, borderRadius: 2 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiCalendar size={12} style={{ color: '#b0aeaa' }} />
                  <span style={{ fontSize: 11.5, color: '#888580' }}>{project.deadline}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>
                    {project.completed}/{project.tasks} tâches
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Équipe:</span>
                <div style={{ display: 'flex', gap: -4 }}>
                  {project.team.map((member, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#1a1a1a', border: '2px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 500, color: '#fff',
                      }}
                    >
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
