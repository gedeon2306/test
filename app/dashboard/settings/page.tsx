'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FiUser, FiMail, FiLock, FiBell, FiGlobe, FiShield,
  FiDatabase, FiMonitor, FiMoon, FiSun, FiSave,
  FiToggleLeft, FiToggleRight, FiCheck, FiX,
} from 'react-icons/fi';

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } as const,
});

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('security');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    desktop: true,
  });
  const [formData, setFormData] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@exemple.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Développeur passionné avec 5 ans d\'expérience',
    language: 'fr',
    timezone: 'Europe/Paris',
  });

  const tabs = [
    { id: 'security', label: 'Sécurité', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'appearance', label: 'Apparence', icon: FiMonitor },
    { id: 'privacy', label: 'Confidentialité', icon: FiShield },
    { id: 'data', label: 'Données', icon: FiDatabase },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handleSave = () => {
    // Simulate save action
    console.log('Settings saved:', { formData, notifications, darkMode });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 1000, padding: '0 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #e8e6e1; border-radius: 2px; }
        
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .sidebar-tabs {
            width: 100% !important;
            margin-bottom: 16px !important;
          }
          .sidebar-tabs button {
            display: inline-flex !important;
            width: auto !important;
            margin-right: 8px !important;
          }
          .container {
            padding: 0 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .header-text {
            font-size: 18px !important;
          }
          .sidebar-tabs {
            flex-wrap: wrap !important;
          }
          .sidebar-tabs button {
            font-size: 11px !important;
            padding: 8px 10px !important;
          }
        }
      `}</style>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <h2 className="header-text" style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Paramètres
        </h2>
        <p style={{ fontSize: 12.5, color: '#888580', margin: 0 }}>
          Gérez vos préférences et paramètres du compte
        </p>
      </motion.div>

      <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <motion.div {...fadeUp(1)} style={{
          background: '#fff', border: '1px solid #e8e6e1',
          borderRadius: 12, padding: '8px', height: 'fit-content',
        }}>
          <div className="sidebar-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: 'none', borderRadius: 8,
                    background: isActive ? '#f5f4f1' : 'transparent',
                    color: isActive ? '#1a1a1a' : '#888580',
                    fontSize: 12.5, fontWeight: isActive ? 500 : 400,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all 0.15s', marginBottom: '2px',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { 
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#f9f8f7'; 
                  }}
                  onMouseLeave={e => { 
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; 
                  }}
                >
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div {...fadeUp(2)} style={{
          background: '#fff', border: '1px solid #e8e6e1',
          borderRadius: 12, padding: '24px',
        }}>
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', margin: '0 0 20px' }}>
                Sécurité du compte
              </h3>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 12px' }}>
                  Changer le mot de passe
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="password"
                    placeholder="Mot de passe actuel"
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e8e6e1', borderRadius: 8,
                      fontSize: 12.5, color: '#1a1a1a',
                      background: '#fff', outline: 'none',
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e8e6e1', borderRadius: 8,
                      fontSize: 12.5, color: '#1a1a1a',
                      background: '#fff', outline: 'none',
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e8e6e1', borderRadius: 8,
                      fontSize: 12.5, color: '#1a1a1a',
                      background: '#fff', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 12px' }}>
                  Authentification à deux facteurs
                </h4>
                <div style={{
                  padding: '12px 16px', border: '1px solid #e8e6e1',
                  borderRadius: 8, background: '#fafaf9',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 12.5, color: '#1a1a1a', margin: '0 0 4px' }}>
                        Authentification 2FA
                      </p>
                      <p style={{ fontSize: 11.5, color: '#888580', margin: 0 }}>
                        Ajoutez une couche de sécurité supplémentaire
                      </p>
                    </div>
                    <button style={{
                      background: '#1a1a1a', color: '#fff', border: 'none',
                      borderRadius: 6, padding: '6px 12px', fontSize: 11.5,
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}>
                      Activer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', margin: '0 0 20px' }}>
                Préférences de notification
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Object.entries({
                  email: { label: 'Email notifications', description: 'Recevoir des notifications par email' },
                  push: { label: 'Push notifications', description: 'Notifications push sur mobile' },
                  sms: { label: 'SMS notifications', description: 'Alertes SMS importantes' },
                  desktop: { label: 'Desktop notifications', description: 'Notifications bureau' },
                }).map(([key, config]) => (
                  <div key={key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', border: '1px solid #e8e6e1',
                    borderRadius: 8,
                  }}>
                    <div>
                      <p style={{ fontSize: 12.5, color: '#1a1a1a', margin: '0 0 2px' }}>
                        {config.label}
                      </p>
                      <p style={{ fontSize: 11.5, color: '#888580', margin: 0 }}>
                        {config.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: notifications[key as keyof typeof notifications] ? '#1d9e75' : '#c8c6c2',
                        padding: 4,
                      }}
                    >
                      {notifications[key as keyof typeof notifications] ? (
                        <FiToggleRight size={24} />
                      ) : (
                        <FiToggleLeft size={24} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', margin: '0 0 20px' }}>
                Apparence
              </h3>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 12px' }}>
                  Thème
                </h4>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 12, marginBottom: 20,
                }}>
                  <button
                    onClick={() => setDarkMode(false)}
                    style={{
                      padding: '16px', border: darkMode ? '1px solid #e8e6e1' : '1px solid #1a1a1a',
                      borderRadius: 8, background: darkMode ? '#fff' : '#f5f4f1',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 8, transition: 'all 0.15s',
                    }}
                  >
                    <FiSun size={20} color={darkMode ? '#c8c6c2' : '#1a1a1a'} />
                    <span style={{ fontSize: 12.5, color: darkMode ? '#888580' : '#1a1a1a' }}>
                      Clair
                    </span>
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    style={{
                      padding: '16px', border: darkMode ? '1px solid #1a1a1a' : '1px solid #e8e6e1',
                      borderRadius: 8, background: darkMode ? '#f5f4f1' : '#fff',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 8, transition: 'all 0.15s',
                    }}
                  >
                    <FiMoon size={20} color={darkMode ? '#1a1a1a' : '#c8c6c2'} />
                    <span style={{ fontSize: 12.5, color: darkMode ? '#1a1a1a' : '#888580' }}>
                      Sombre
                    </span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                    Langue
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: '8px 12px',
                      border: '1px solid #e8e6e1', borderRadius: 8,
                      fontSize: 12.5, color: '#1a1a1a',
                      background: '#fff', cursor: 'pointer',
                    }}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ fontSize: 12, color: '#b0aeaa', display: 'block', marginBottom: 6 }}>
                    Fuseau horaire
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%', padding: '8px 12px',
                      border: '1px solid #e8e6e1', borderRadius: 8,
                      fontSize: 12.5, color: '#1a1a1a',
                      background: '#fff', cursor: 'pointer',
                    }}
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', margin: '0 0 20px' }}>
                Confidentialité
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  padding: '12px 16px', border: '1px solid #e8e6e1',
                  borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 12.5, color: '#1a1a1a', margin: '0 0 2px' }}>
                        Profil public
                      </p>
                      <p style={{ fontSize: 11.5, color: '#888580', margin: 0 }}>
                        Rendre votre profil visible par tous
                      </p>
                    </div>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#c8c6c2', padding: 4,
                    }}>
                      <FiToggleLeft size={24} />
                    </button>
                  </div>
                </div>

                <div style={{
                  padding: '12px 16px', border: '1px solid #e8e6e1',
                  borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 12.5, color: '#1a1a1a', margin: '0 0 2px' }}>
                        Partage de données
                      </p>
                      <p style={{ fontSize: 11.5, color: '#888580', margin: 0 }}>
                        Autoriser le partage de données avec des tiers
                      </p>
                    </div>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#c8c6c2', padding: 4,
                    }}>
                      <FiToggleLeft size={24} />
                    </button>
                  </div>
                </div>

                <div style={{
                  padding: '12px 16px', border: '1px solid #e8e6e1',
                  borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 12.5, color: '#1a1a1a', margin: '0 0 2px' }}>
                        Analytics
                      </p>
                      <p style={{ fontSize: 11.5, color: '#888580', margin: 0 }}>
                        Aider à améliorer le produit avec des données anonymes
                      </p>
                    </div>
                    <button style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#1d9e75', padding: 4,
                    }}>
                      <FiToggleRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', margin: '0 0 20px' }}>
                Gestion des données
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{
                  padding: '16px', border: '1px solid #e8e6e1',
                  borderRadius: 8, background: '#fafaf9',
                }}>
                  <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 8px' }}>
                    Exporter vos données
                  </h4>
                  <p style={{ fontSize: 11.5, color: '#888580', margin: '0 0 12px' }}>
                    Téléchargez toutes vos données au format JSON
                  </p>
                  <button style={{
                    background: '#fff', color: '#1a1a1a', border: '1px solid #e8e6e1',
                    borderRadius: 6, padding: '6px 12px', fontSize: 11.5,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f5f4f1'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}>
                    Exporter
                  </button>
                </div>

                <div style={{
                  padding: '16px', border: '1px solid #e8e6e1',
                  borderRadius: 8, background: '#fafaf9',
                }}>
                  <h4 style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', margin: '0 0 8px' }}>
                    Supprimer votre compte
                  </h4>
                  <p style={{ fontSize: 11.5, color: '#888580', margin: '0 0 12px' }}>
                    Cette action est irréversible et supprimera toutes vos données
                  </p>
                  <button style={{
                    background: '#dc2626', color: '#fff', border: 'none',
                    borderRadius: 6, padding: '6px 12px', fontSize: 11.5,
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#b91c1c'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#dc2626'; }}>
                    Supprimer le compte
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #f0efeb' }}>
            <button
              onClick={handleSave}
              style={{
                background: '#1a1a1a', color: '#fff', border: 'none',
                borderRadius: 8, padding: '10px 20px', fontSize: 12.5,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
            >
              <FiSave size={14} />
              Enregistrer les modifications
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
