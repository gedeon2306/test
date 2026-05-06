'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: {
    text: string;
    href: string;
  };
}

export const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  footerText, 
  footerLink 
}: AuthLayoutProps) => {
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
              {title}
            </h1>
            <p style={{ fontSize: 12.5, color: '#888580', margin: '4px 0 0', fontWeight: 400 }}>
              {subtitle}
            </p>
          </div>

          {children}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', marginTop: 18, fontSize: 12.5, color: '#888580' }}
        >
          {footerText}{' '}
          <a href={footerLink.href} style={{ color: '#1a1a1a', fontWeight: 500, textDecoration: 'none' }}>
            {footerLink.text}
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};
