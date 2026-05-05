'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FiGithub, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import Image from 'next/image';

const Spinner = ({ color = '#1a1a1a' }: { color?: string }) => (
  <div style={{
    width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
    border: `2px solid ${color}25`,
    borderTop: `2px solid ${color}`,
    animation: 'spin 0.7s linear infinite',
  }} />
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleOAuth = (provider: 'google' | 'github') => {
    if (provider === 'google') { setLoadingGoogle(true); setTimeout(() => setLoadingGoogle(false), 2000); }
    else { setLoadingGithub(true); setTimeout(() => setLoadingGithub(false), 2000); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    setTimeout(() => setLoadingForm(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::placeholder { color: #b0aeaa; font-size: 12.5px; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #fff inset; }
      `}</style>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #1a1a1a08 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-95 relative"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2.5">
            <div style={{
              width: 28, height: 28,
              background: '#1a1a1a',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Image src="/icon.svg" alt="structure" width={24} height={24} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.02em', color: '#1a1a1a', fontFamily: "'DM Mono', monospace" }}>
              structure
            </span>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            background: '#fff',
            border: '1px solid #e8e6e1',
            borderRadius: 16,
            padding: '32px 32px 28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)',
          }}
        >
          <div className="mb-6">
            <h1 style={{ fontSize: 17, fontWeight: 500, color: '#1a1a1a', margin: 0, letterSpacing: '-0.02em' }}>
              Bon retour
            </h1>
            <p style={{ fontSize: 12.5, color: '#888580', margin: '4px 0 0', fontWeight: 400 }}>
              Connectez-vous à votre espace de travail
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-2.5 mb-5">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuth('google')}
              disabled={loadingGoogle}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', height: 38,
                background: '#fff',
                border: '1px solid #e8e6e1',
                borderRadius: 9,
                fontSize: 12.5, fontWeight: 400, color: '#1a1a1a',
                cursor: loadingGoogle ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                opacity: loadingGoogle ? 0.7 : 1,
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#f9f8f6'; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = '#fff'; }}
            >
              {loadingGoogle ? <Spinner color="#1a1a1a" /> : <FcGoogle size={15} />}
              Continuer avec Google
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOAuth('github')}
              disabled={loadingGithub}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', height: 38,
                background: '#1a1a1a',
                border: '1px solid #1a1a1a',
                borderRadius: 9,
                fontSize: 12.5, fontWeight: 400, color: '#fff',
                cursor: loadingGithub ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                opacity: loadingGithub ? 0.7 : 1,
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#333'; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = '#1a1a1a'; }}
            >
              {loadingGithub ? <Spinner color="#ffffff" /> : <FiGithub size={14} />}
              Continuer avec GitHub
            </motion.button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e8e6e1' }} />
            <span style={{ fontSize: 11.5, color: '#b0aeaa', fontWeight: 400 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: '#e8e6e1' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email */}
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: '#888580', display: 'block', marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail size={13} style={{
                  position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'email' ? '#1a1a1a' : '#b0aeaa',
                  transition: 'color 0.2s',
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%', height: 36,
                    paddingLeft: 30, paddingRight: 12,
                    fontSize: 12.5, color: '#1a1a1a',
                    background: focused === 'email' ? '#fff' : '#fafaf9',
                    border: `1px solid ${focused === 'email' ? '#1a1a1a' : '#e8e6e1'}`,
                    borderRadius: 8, outline: 'none',
                    transition: 'all 0.15s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <label style={{ fontSize: 11.5, fontWeight: 500, color: '#888580', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  Mot de passe
                </label>
                <a href="#" style={{ fontSize: 11.5, color: '#888580', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#1a1a1a'; }}
                  onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = '#888580'; }}>
                  Oublié ?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <FiLock size={13} style={{
                  position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'password' ? '#1a1a1a' : '#b0aeaa',
                  transition: 'color 0.2s',
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%', height: 36,
                    paddingLeft: 30, paddingRight: 36,
                    fontSize: 12.5, color: '#1a1a1a',
                    background: focused === 'password' ? '#fff' : '#fafaf9',
                    border: `1px solid ${focused === 'password' ? '#1a1a1a' : '#e8e6e1'}`,
                    borderRadius: 8, outline: 'none',
                    transition: 'all 0.15s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                    color: '#b0aeaa', display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loadingForm}
              style={{
                marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                width: '100%', height: 38,
                background: '#1a1a1a',
                border: '1px solid #1a1a1a',
                borderRadius: 9,
                fontSize: 12.5, fontWeight: 500, color: '#fff',
                cursor: loadingForm ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                opacity: loadingForm ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loadingForm) (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
            >
              {loadingForm ? (
                <Spinner color="#ffffff" />
              ) : (
                <>
                  Se connecter
                  <FiArrowRight size={13} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 18, fontSize: 12.5, color: '#888580' }}
        >
          Pas encore de compte ?{' '}
          <Link href="/auth/register" style={{ color: '#1a1a1a', fontWeight: 500, textDecoration: 'none' }}>
            Créer un compte
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}