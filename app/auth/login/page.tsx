'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { AuthLayout, OAuthButtons, FormField, Spinner } from '../../../src/components/auth';

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
    <AuthLayout
      title="Bon retour"
      subtitle="Connectez-vous à votre espace de travail"
      footerText="Pas encore de compte ?"
      footerLink={{ text: 'Créer un compte', href: '/auth/register' }}
    >
      {/* OAuth buttons */}
      <OAuthButtons
        loadingGoogle={loadingGoogle}
        loadingGithub={loadingGithub}
        onGoogleClick={() => handleOAuth('google')}
        onGithubClick={() => handleOAuth('github')}
        googleText="Continuer avec Google"
        githubText="Continuer avec GitHub"
      />

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#e8e6e1' }} />
        <span style={{ fontSize: 11.5, color: '#b0aeaa', fontWeight: 400 }}>ou</span>
        <div style={{ flex: 1, height: 1, background: '#e8e6e1' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email */}
        <FormField
          type="email"
          label="Email"
          placeholder="vous@exemple.com"
          value={email}
          onChange={setEmail}
          focused={focused}
          onFocus={setFocused}
          onBlur={() => setFocused(null)}
          fieldName="email"
        />

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
          <FormField
            type="password"
            label=""
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            focused={focused}
            onFocus={setFocused}
            onBlur={() => setFocused(null)}
            fieldName="password"
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
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
    </AuthLayout>
  );
}