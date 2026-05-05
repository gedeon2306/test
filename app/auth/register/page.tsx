'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FiGithub, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser } from 'react-icons/fi';
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

const strengthLabel = (score: number) => {
  if (score === 0) return { text: '', color: '#e8e6e1' };
  if (score === 1) return { text: 'Faible', color: '#e24b4a' };
  if (score === 2) return { text: 'Moyen', color: '#ef9f27' };
  if (score === 3) return { text: 'Fort', color: '#1d9e75' };
  return { text: 'Très fort', color: '#1d9e75' };
};

const getPasswordScore = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const score = getPasswordScore(password);
  const strength = strengthLabel(password.length > 0 ? score : 0);

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
    <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center px-4 py-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::placeholder { color: #b0aeaa; font-size: 12.5px; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 100px #fff inset; }
      `}</style>

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
              Créer un compte
            </h1>
            <p style={{ fontSize: 12.5, color: '#888580', margin: '4px 0 0', fontWeight: 400 }}>
              Commencez à organiser vos projets
            </p>
          </div>

          {/* OAuth */}
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
                transition: 'background 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                opacity: loadingGoogle ? 0.7 : 1,
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#f9f8f6'; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = '#fff'; }}
            >
              {loadingGoogle ? <Spinner color="#1a1a1a" /> : <FcGoogle size={15} />}
              S'inscrire avec Google
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
              S'inscrire avec GitHub
            </motion.button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e8e6e1' }} />
            <span style={{ fontSize: 11.5, color: '#b0aeaa' }}>ou</span>
            <div style={{ flex: 1, height: 1, background: '#e8e6e1' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Name */}
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 500, color: '#888580', display: 'block', marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Nom complet
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser size={13} style={{
                  position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                  color: focused === 'name' ? '#1a1a1a' : '#b0aeaa',
                  transition: 'color 0.2s',
                }} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  style={{
                    width: '100%', height: 36,
                    paddingLeft: 30, paddingRight: 12,
                    fontSize: 12.5, color: '#1a1a1a',
                    background: focused === 'name' ? '#fff' : '#fafaf9',
                    border: `1px solid ${focused === 'name' ? '#1a1a1a' : '#e8e6e1'}`,
                    borderRadius: 8, outline: 'none',
                    transition: 'all 0.15s',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
            </div>

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
              <label style={{ fontSize: 11.5, fontWeight: 500, color: '#888580', display: 'block', marginBottom: 5, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Mot de passe
              </label>
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
                  placeholder="8 caractères minimum"
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
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#b0aeaa', display: 'flex', alignItems: 'center' }}
                >
                  {showPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: 7 }}
                >
                  <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 2.5, borderRadius: 2,
                        background: i <= score ? strength.color : '#e8e6e1',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: strength.color, fontWeight: 400 }}>{strength.text}</span>
                </motion.div>
              )}
            </div>

            {/* Terms */}
            <p style={{ fontSize: 11.5, color: '#b0aeaa', lineHeight: 1.5, margin: '2px 0 0' }}>
              En créant un compte, vous acceptez nos{' '}
              <a href="#" style={{ color: '#888580', textDecoration: 'underline', textDecorationColor: '#e8e6e1' }}>conditions</a>
              {' '}et notre{' '}
              <a href="#" style={{ color: '#888580', textDecoration: 'underline', textDecorationColor: '#e8e6e1' }}>politique de confidentialité</a>.
            </p>

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
                cursor: (loadingForm) ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                opacity: (loadingForm) ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!loadingForm) (e.currentTarget as HTMLButtonElement).style.background = '#333'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
            >
              {loadingForm ? (
                <Spinner color="#ffffff" />
              ) : (
                <>
                  Créer mon compte
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
          Déjà un compte ?{' '}
          <Link href="/auth/login" style={{ color: '#1a1a1a', fontWeight: 500, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}