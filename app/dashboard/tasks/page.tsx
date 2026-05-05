'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FiPlus, FiFilter, FiSearch, FiCheckCircle, FiCircle,
  FiCalendar, FiUser, FiMoreHorizontal, FiEdit2, FiTrash2,
} from 'react-icons/fi';

const TASKS = [
  { id: 1, title: 'Finaliser la maquette landing page', project: 'Site vitrine', status: 'done', priority: 'haute', assignee: 'MR', due: 'Aujourd\'hui', description: 'Finaliser les derniers détails de la maquette' },
  { id: 2, title: 'Implémenter l\'authentification OAuth', project: 'API v2', status: 'inprogress', priority: 'haute', assignee: 'JD', due: 'Demain', description: 'Configurer OAuth2 avec Google et GitHub' },
  { id: 3, title: 'Tests unitaires module paiement', project: 'App mobile', status: 'inprogress', priority: 'moyenne', assignee: 'AL', due: '8 mai', description: 'Écrire les tests pour le module de paiement' },
  { id: 4, title: 'Rédiger doc technique endpoints', project: 'API v2', status: 'todo', priority: 'basse', assignee: 'JD', due: '10 mai', description: 'Documenter tous les endpoints de l\'API' },
  { id: 5, title: 'Recette design système components', project: 'Site vitrine', status: 'todo', priority: 'moyenne', assignee: 'MR', due: '12 mai', description: 'Tester tous les composants du design system' },
  { id: 6, title: 'Déploiement staging v1.4', project: 'App mobile', status: 'todo', priority: 'haute', assignee: 'AL', due: '14 mai', description: 'Déployer la version 1.4 en staging' },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  done: { label: 'Terminé', bg: '#f0faf5', color: '#0f6e56' },
  inprogress: { label: 'En cours', bg: '#fafaf9', color: '#5f5e5a' },
  todo: { label: 'À faire', bg: '#f5f4f1', color: '#888580' },
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

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = TASKS.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
          .task-card {
            padding: 12px !important;
          }
          .task-title-mobile {
            font-size: 13px !important;
            margin-bottom: 8px !important;
          }
          .task-meta-mobile {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            font-size: 11px !important;
          }
          .container {
            padding: 0 12px !important;
          }
        }
        
        @media (max-width: 480px) {
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
              Mes tâches
            </h2>
            <p style={{ fontSize: 12.5, color: '#888580', margin: 0 }}>
              {filteredTasks.length} tâches trouvées
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
            Nouvelle tâche
          </button>
        </div>

        {/* Search and filters */}
        <div className="filters-flex" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#b0aeaa' }} />
            <input
              type="text"
              placeholder="Rechercher une tâche..."
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
            <option value="todo">À faire</option>
            <option value="inprogress">En cours</option>
            <option value="done">Terminé</option>
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

      {/* Tasks list */}
      <motion.div {...fadeUp(1)} style={{
        background: '#fff', border: '1px solid #e8e6e1',
        borderRadius: 12, overflow: 'hidden',
      }}>
        {filteredTasks.map((task, i) => {
          const st = statusConfig[task.status];
          const pr = priorityConfig[task.priority];
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="task-card"
              style={{
                padding: '16px 18px',
                borderBottom: i < filteredTasks.length - 1 ? '1px solid #f9f8f6' : 'none',
                cursor: 'pointer', transition: 'background 0.12s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 0, marginTop: 2,
                }}>
                  {task.status === 'done'
                    ? <FiCheckCircle size={16} style={{ color: '#1d9e75' }} />
                    : <FiCircle size={16} style={{ color: '#d8d6d2' }} />
                  }
                </button>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <h3 className="task-title-mobile" style={{
                        fontSize: 13.5, fontWeight: 500, color: task.status === 'done' ? '#b0aeaa' : '#1a1a1a',
                        margin: '0 0 4px', textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      }}>
                        {task.title}
                      </h3>
                      <p style={{ fontSize: 12, color: '#888580', margin: 0, lineHeight: 1.4 }}>
                        {task.description}
                      </p>
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
                  
                  <div className="task-meta-mobile" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Projet:</span>
                      <span style={{ fontSize: 11.5, color: '#888580' }}>{task.project}</span>
                    </div>
                    
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
                        <span style={{ fontSize: 11.5, color: '#888580' }}>{task.priority}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiUser size={12} style={{ color: '#b0aeaa' }} />
                      <span style={{ fontSize: 11.5, color: '#888580' }}>{task.assignee}</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FiCalendar size={12} style={{ color: '#b0aeaa' }} />
                      <span style={{ fontSize: 11.5, color: '#888580' }}>{task.due}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
