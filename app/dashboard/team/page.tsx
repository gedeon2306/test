'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FiPlus, FiSearch, FiMail, FiPhone, FiMapPin,
  FiMoreHorizontal, FiCalendar, FiBriefcase, FiAward,
} from 'react-icons/fi';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Jean Dupont',
    role: 'Lead Developer',
    email: 'jean.dupont@exemple.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    avatar: 'JD',
    status: 'online',
    department: 'Développement',
    joinDate: '15 janvier 2023',
    projects: ['API v2', 'App mobile'],
    skills: ['React', 'Node.js', 'TypeScript'],
    performance: 92,
  },
  {
    id: 2,
    name: 'Marie Robert',
    role: 'UX Designer',
    email: 'marie.robert@exemple.com',
    phone: '+33 6 23 45 67 89',
    location: 'Lyon, France',
    avatar: 'MR',
    status: 'online',
    department: 'Design',
    joinDate: '3 mars 2023',
    projects: ['Site vitrine', 'Dashboard analytics'],
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    performance: 88,
  },
  {
    id: 3,
    name: 'Alice Laurent',
    role: 'Frontend Developer',
    email: 'alice.laurent@exemple.com',
    phone: '+33 6 34 56 78 90',
    location: 'Marseille, France',
    avatar: 'AL',
    status: 'away',
    department: 'Développement',
    joinDate: '10 juin 2023',
    projects: ['App mobile', 'Site vitrine'],
    skills: ['Vue.js', 'CSS', 'JavaScript'],
    performance: 85,
  },
  {
    id: 4,
    name: 'Thomas Bernard',
    role: 'Backend Developer',
    email: 'thomas.bernard@exemple.com',
    phone: '+33 6 45 67 89 01',
    location: 'Toulouse, France',
    avatar: 'TB',
    status: 'offline',
    department: 'Développement',
    joinDate: '22 août 2023',
    projects: ['API v2'],
    skills: ['Python', 'Django', 'PostgreSQL'],
    performance: 90,
  },
  {
    id: 5,
    name: 'Sophie Martin',
    role: 'Project Manager',
    email: 'sophie.martin@exemple.com',
    phone: '+33 6 56 78 90 12',
    location: 'Bordeaux, France',
    avatar: 'SM',
    status: 'online',
    department: 'Management',
    joinDate: '5 février 2023',
    projects: ['Site vitrine', 'App mobile', 'API v2'],
    skills: ['Agile', 'Scrum', 'Jira'],
    performance: 94,
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  online: { label: 'En ligne', color: '#1d9e75' },
  away: { label: 'Absent', color: '#f59e0b' },
  offline: { label: 'Hors ligne', color: '#6b7280' },
};

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } as const,
});

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMembers = TEAM_MEMBERS.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(TEAM_MEMBERS.map(m => m.department)));
  
  const stats = {
    total: TEAM_MEMBERS.length,
    online: TEAM_MEMBERS.filter(m => m.status === 'online').length,
    away: TEAM_MEMBERS.filter(m => m.status === 'away').length,
    offline: TEAM_MEMBERS.filter(m => m.status === 'offline').length,
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
          .team-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .team-card {
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
              Équipe
            </h2>
            <p style={{ fontSize: 12.5, color: '#888580', margin: 0 }}>
              {filteredMembers.length} membres trouvés
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
            Inviter un membre
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FiBriefcase size={14} style={{ color: '#c8c6c2' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Total</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.total}
            </p>
          </div>
          
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1d9e75' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>En ligne</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.online}
            </p>
          </div>
          
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Absent</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.away}
            </p>
          </div>
          
          <div style={{ background: '#fff', border: '1px solid #e8e6e1', borderRadius: 12, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b7280' }} />
              <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Hors ligne</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#1a1a1a', margin: 0, fontFamily: "'DM Mono', monospace" }}>
              {stats.offline}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="filters-flex" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#b0aeaa' }} />
            <input
              type="text"
              placeholder="Rechercher un membre..."
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
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{
              padding: '8px 12px', border: '1px solid #e8e6e1',
              borderRadius: 8, fontSize: 12.5, color: '#1a1a1a',
              background: '#fff', cursor: 'pointer',
            }}
          >
            <option value="all">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

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
            <option value="online">En ligne</option>
            <option value="away">Absent</option>
            <option value="offline">Hors ligne</option>
          </select>
        </div>
      </motion.div>

      {/* Team members grid */}
      <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {filteredMembers.map((member, i) => {
          const status = statusConfig[member.status];
          return (
            <motion.div
              key={member.id}
              {...fadeUp(i + 1)}
              className="team-card"
              style={{
                background: '#fff', border: '1px solid #e8e6e1',
                borderRadius: 12, padding: '20px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: '#1a1a1a', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#fff',
                    }}>
                      {member.avatar}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: 12, height: 12, borderRadius: '50%',
                      background: status.color, border: '2px solid #fff',
                    }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a', margin: '0 0 2px' }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: 12.5, color: '#888580', margin: 0 }}>
                      {member.role}
                    </p>
                  </div>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiMail size={12} style={{ color: '#b0aeaa' }} />
                  <span style={{ fontSize: 11.5, color: '#888580' }}>{member.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiPhone size={12} style={{ color: '#b0aeaa' }} />
                  <span style={{ fontSize: 11.5, color: '#888580' }}>{member.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiMapPin size={12} style={{ color: '#b0aeaa' }} />
                  <span style={{ fontSize: 11.5, color: '#888580' }}>{member.location}</span>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>Performance</span>
                  <span style={{ fontSize: 11.5, color: '#1a1a1a', fontFamily: "'DM Mono', monospace" }}>
                    {member.performance}%
                  </span>
                </div>
                <div style={{ height: 4, background: '#f0efeb', borderRadius: 2 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${member.performance}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: member.performance >= 90 ? '#1d9e75' : member.performance >= 80 ? '#f59e0b' : '#dc2626', borderRadius: 2 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 11.5, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>Compétences</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {member.skills.map((skill, idx) => (
                    <span key={idx} style={{
                      fontSize: 10.5, padding: '3px 8px', borderRadius: 4,
                      background: '#f5f4f1', color: '#888580',
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #f0efeb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiCalendar size={12} style={{ color: '#b0aeaa' }} />
                  <span style={{ fontSize: 11, color: '#888580' }}>{member.joinDate}</span>
                </div>
                <span style={{
                  fontSize: 10.5, padding: '2px 6px', borderRadius: 4,
                  background: '#fafaf9', color: status.color, fontWeight: 400,
                }}>
                  {status.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
