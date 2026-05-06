'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiBriefcase, FiEdit2, FiCamera, FiGithub, FiLinkedin,
  FiTwitter, FiGlobe, FiAward, FiTrendingUp, FiClock,
  FiCheckCircle, FiStar, FiBook, FiCode,
} from 'react-icons/fi';

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } as const,
});

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    title: 'Lead Full-Stack Developer',
    email: 'jean.dupont@exemple.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    bio: 'Développeur passionné avec 5 ans d\'expérience dans la création d\'applications web modernes. Spécialisé en React, Node.js et les architectures cloud.',
    website: 'https://jeandupont.dev',
    github: 'jeandupont',
    linkedin: 'jean-dupont',
    twitter: '@jeandupont',
  });

  const stats = [
    { label: 'Projets complétés', value: '24', icon: FiCheckCircle, color: '#1d9e75' },
    { label: 'Années d\'expérience', value: '5', icon: FiBriefcase, color: '#1a1a1a' },
    { label: 'Technologies', value: '12', icon: FiCode, color: '#888580' },
    { label: 'Satisfaction client', value: '98%', icon: FiStar, color: '#f59e0b' },
  ];

  const skills = [
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'TypeScript', level: 85, category: 'Language' },
    { name: 'Node.js', level: 88, category: 'Backend' },
    { name: 'Python', level: 75, category: 'Backend' },
    { name: 'PostgreSQL', level: 80, category: 'Database' },
    { name: 'Docker', level: 70, category: 'DevOps' },
  ];

  const recentProjects = [
    {
      title: 'Site vitrine',
      role: 'Lead Developer',
      period: 'Jan 2024 - Mai 2024',
      status: 'completed',
      description: 'Refonte complète du site corporate avec React et Next.js',
    },
    {
      title: 'API v2',
      role: 'Backend Developer',
      period: 'Mar 2024 - En cours',
      status: 'active',
      description: 'Nouvelle version de l\'API REST avec Node.js et PostgreSQL',
    },
    {
      title: 'App mobile',
      role: 'Full-Stack Developer',
      period: 'Fév 2024 - En cours',
      status: 'active',
      description: 'Application iOS/Android de gestion de projet',
    },
  ];

  const achievements = [
    { title: 'Developer of the Year 2023', organization: 'Tech Awards', date: 'Déc 2023' },
    { title: 'Best React Project', organization: 'React Summit', date: 'Juin 2023' },
    { title: 'Open Source Contributor', organization: 'GitHub', date: 'Mars 2023' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', formData);
  };

  return (
      <div className="container" style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1000, padding: '0 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 2px; }
        
        @media (max-width: 1024px) {
          .profile-grid {
            grid-template-columns: 280px 1fr !important;
            gap: 20px !important;
          }
        }
        
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .profile-sidebar {
            order: -1 !important;
            margin-bottom: 16px !important;
          }
          .profile-main {
            order: 0 !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .skills-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .projects-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .container {
            padding: 0 12px !important;
          }
          .basic-info-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
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
          .profile-avatar {
            width: 64px !important;
            height: 64px !important;
            font-size: 20px !important;
          }
          .header-actions {
            flex-direction: column !important;
            gap: 8px !important;
            align-items: flex-start !important;
          }
          .profile-card {
            padding: 16px !important;
          }
          .content-card {
            padding: 16px !important;
          }
          .social-links {
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
        }
        
        @media (max-width: 360px) {
          .container {
            padding: 0 8px !important;
          }
          .profile-avatar {
            width: 56px !important;
            height: 56px !important;
            font-size: 18px !important;
          }
          .header-text {
            font-size: 16px !important;
          }
          .button-text {
            font-size: 10px !important;
            padding: 5px 10px !important;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2 className="header-text" style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              Profil
            </h2>
            <p style={{ fontSize: 12.5, color: '#888580', margin: 0 }}>
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>
          <button className="button-text"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            style={{
              background: isEditing ? '#1d9e75' : '#1a1a1a', color: '#fff', border: 'none',
              borderRadius: 8, padding: '8px 16px', fontSize: 12.5,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { 
              (e.currentTarget as HTMLButtonElement).style.background = isEditing ? '#0f6e56' : '#333'; 
            }}
            onMouseLeave={e => { 
              (e.currentTarget as HTMLButtonElement).style.background = isEditing ? '#1d9e75' : '#1a1a1a'; 
            }}
          >
            {isEditing ? <FiCheckCircle size={14} /> : <FiEdit2 size={14} />}
            {isEditing ? 'Enregistrer' : 'Modifier'}
          </button>
        </div>
      </motion.div>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Left sidebar */}
        <div className="profile-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Profile card */}
          <motion.div {...fadeUp(1)} className="profile-card" style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '24px', textAlign: 'center',
          }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <div className="profile-avatar" style={{
                width: 80, height: 80, borderRadius: '50%',
                background: '#1a1a1a', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 24, fontWeight: 500, color: '#fff',
                margin: '0 auto',
              }}>
                JD
              </div>
              <button style={{
                position: 'absolute', bottom: 0, right: '50%', transform: 'translateX(20px)',
                width: 24, height: 24, borderRadius: '50%',
                background: '#1a1a1a', border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}>
                <FiCamera size={10} />
              </button>
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px' }}>
              {formData.firstName} {formData.lastName}
            </h3>
            <p style={{ fontSize: 12.5, color: '#888580', margin: '0 0 16px' }}>
              {formData.title}
            </p>
            
            <div className="social-links" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {formData.github && (
                <a href={`https://github.com/${formData.github}`} style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: '#f5f4f1', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#888580',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e8e6e1'; (e.currentTarget as HTMLAnchorElement).style.color = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f5f4f1'; (e.currentTarget as HTMLAnchorElement).style.color = '#888580'; }}>
                  <FiGithub size={14} />
                </a>
              )}
              {formData.linkedin && (
                <a href={`https://linkedin.com/in/${formData.linkedin}`} style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: '#f5f4f1', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#888580',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e8e6e1'; (e.currentTarget as HTMLAnchorElement).style.color = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f5f4f1'; (e.currentTarget as HTMLAnchorElement).style.color = '#888580'; }}>
                  <FiLinkedin size={14} />
                </a>
              )}
              {formData.twitter && (
                <a href={`https://twitter.com/${formData.twitter.replace('@', '')}`} style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: '#f5f4f1', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#888580',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e8e6e1'; (e.currentTarget as HTMLAnchorElement).style.color = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f5f4f1'; (e.currentTarget as HTMLAnchorElement).style.color = '#888580'; }}>
                  <FiTwitter size={14} />
                </a>
              )}
              {formData.website && (
                <a href={formData.website} style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: '#f5f4f1', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#888580',
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#e8e6e1'; (e.currentTarget as HTMLAnchorElement).style.color = '#1a1a1a'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#f5f4f1'; (e.currentTarget as HTMLAnchorElement).style.color = '#888580'; }}>
                  <FiGlobe size={14} />
                </a>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(2)} className="content-card" style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '16px',
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 12px' }}>
              Statistiques
            </h4>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {stats.map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <stat.icon size={16} style={{ color: stat.color, marginBottom: 4 }} />
                  <p style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a', margin: '0 0 2px', fontFamily: "'DM Mono', monospace" }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: 10, color: '#b0aeaa', margin: 0 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="profile-main" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Basic info */}
          <motion.div {...fadeUp(3)} className="content-card" style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '20px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', margin: '0 0 16px' }}>
              Informations personnelles
            </h3>
            
            <div className="basic-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11.5, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%', padding: '8px 12px',
                    border: '1px solid #e8e6e1', borderRadius: 6,
                    fontSize: 12.5, color: '#1a1a1a',
                    background: isEditing ? '#fff' : '#f9f8f7',
                    outline: 'none', opacity: isEditing ? 1 : 0.7,
                  }}
                />
              </div>
              
              <div>
                <label style={{ fontSize: 11.5, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    width: '100%', padding: '8px 12px',
                    border: '1px solid #e8e6e1', borderRadius: 6,
                    fontSize: 12.5, color: '#1a1a1a',
                    background: isEditing ? '#fff' : '#f9f8f7',
                    outline: 'none', opacity: isEditing ? 1 : 0.7,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11.5, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                Titre
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={!isEditing}
                style={{
                  width: '100%', padding: '8px 12px',
                  border: '1px solid #e8e6e1', borderRadius: 6,
                  fontSize: 12.5, color: '#1a1a1a',
                  background: isEditing ? '#fff' : '#f9f8f7',
                  outline: 'none', opacity: isEditing ? 1 : 0.7,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11.5, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                disabled={!isEditing}
                style={{
                  width: '100%', padding: '8px 12px',
                  border: '1px solid #e8e6e1', borderRadius: 6,
                  fontSize: 12.5, color: '#1a1a1a',
                  background: isEditing ? '#fff' : '#f9f8f7',
                  outline: 'none', resize: 'vertical', opacity: isEditing ? 1 : 0.7,
                }}
              />
            </div>

            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11.5, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                  Email
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiMail size={14} style={{ color: '#b0aeaa' }} />
                  <span style={{ fontSize: 12.5, color: '#888580' }}>
                    {formData.email}
                  </span>
                </div>
              </div>
              
              <div>
                <label style={{ fontSize: 11.5, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                  Téléphone
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiPhone size={14} style={{ color: '#b0aeaa' }} />
                  <span style={{ fontSize: 12.5, color: '#888580' }}>
                    {formData.phone}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiMapPin size={14} style={{ color: '#b0aeaa' }} />
                <span style={{ fontSize: 12.5, color: '#888580' }}>
                  {formData.location}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div {...fadeUp(4)} className="content-card" style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '20px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', margin: '0 0 16px' }}>
              Compétences
            </h3>
            
            <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {skills.map((skill, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#1a1a1a' }}>
                        {skill.name}
                      </span>
                      <span style={{ fontSize: 10.5, color: '#b0aeaa', marginLeft: 6 }}>
                        {skill.category}
                      </span>
                    </div>
                    <span style={{ fontSize: 11.5, color: '#1a1a1a', fontFamily: "'DM Mono', monospace" }}>
                      {skill.level}%
                    </span>
                  </div>
                  <div style={{ height: 4, background: '#f0efeb', borderRadius: 2 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%', background: '#1a1a1a', borderRadius: 2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent projects */}
          <motion.div {...fadeUp(5)} className="content-card projects-grid" style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '20px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', margin: '0 0 16px' }}>
              Projets récents
            </h3>
            
            <div className="projects-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentProjects.map((project, i) => (
                <div key={i} className="project-card" style={{
                  padding: '12px 16px', border: '1px solid #f0efeb',
                  borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <div className="project-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <h4 className="project-title" style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 2px' }}>
                        {project.title}
                      </h4>
                      <p className="project-role" style={{ fontSize: 11.5, color: '#888580', margin: 0 }}>
                        {project.role}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 10, padding: '2px 6px', borderRadius: 4,
                      background: project.status === 'completed' ? '#f0faf5' : '#fafaf9',
                      color: project.status === 'completed' ? '#0f6e56' : '#5f5e5a',
                      fontWeight: 400,
                    }}>
                      {project.status === 'completed' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>
                  <p style={{ fontSize: 11.5, color: '#888580', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiCalendar size={11} style={{ color: '#b0aeaa' }} />
                    <span style={{ fontSize: 11, color: '#b0aeaa' }}>{project.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div {...fadeUp(6)} className="content-card" style={{
            background: '#fff', border: '1px solid #e8e6e1',
            borderRadius: 12, padding: '20px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', margin: '0 0 16px' }}>
              Réalisations
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {achievements.map((achievement, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 6,
                    background: '#f5f4f1', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FiAward size={14} style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 12.5, fontWeight: 500, color: '#1a1a1a', margin: '0 0 2px' }}>
                      {achievement.title}
                    </h4>
                    <p style={{ fontSize: 11.5, color: '#888580', margin: '0 0 2px' }}>
                      {achievement.organization}
                    </p>
                    <p style={{ fontSize: 11, color: '#b0aeaa', margin: 0 }}>
                      {achievement.date}
                    </p>
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
