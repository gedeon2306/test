'use client';

import { motion } from 'motion/react';

interface PasswordStrengthProps {
  password: string;
}

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

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const score = getPasswordScore(password);
  const strength = strengthLabel(password.length > 0 ? score : 0);

  if (password.length === 0) return null;

  return (
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
  );
};
