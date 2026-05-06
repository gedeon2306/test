'use client';

import { motion } from 'motion/react';
import { FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Spinner } from './Spinner';

interface OAuthButtonsProps {
  loadingGoogle: boolean;
  loadingGithub: boolean;
  onGoogleClick: () => void;
  onGithubClick: () => void;
  googleText: string;
  githubText: string;
}

export const OAuthButtons = ({
  loadingGoogle,
  loadingGithub,
  onGoogleClick,
  onGithubClick,
  googleText,
  githubText,
}: OAuthButtonsProps) => {
  return (
    <div className="flex flex-col gap-2.5 mb-5">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onGoogleClick}
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
        {googleText}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onGithubClick}
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
        {githubText}
      </motion.button>
    </div>
  );
};
