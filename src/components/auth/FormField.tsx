'use client';

import { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { ReactNode } from 'react';

interface FormFieldProps {
  type: 'email' | 'password' | 'text';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  focused: string | null;
  onFocus: (field: string) => void;
  onBlur: () => void;
  fieldName: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  rightElement?: ReactNode;
}

export const FormField = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  fieldName,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  rightElement,
}: FormFieldProps) => {
  const getIcon = () => {
    switch (type) {
      case 'email':
        return <FiMail size={13} />;
      case 'password':
        return <FiLock size={13} />;
      case 'text':
        return <FiUser size={13} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <label style={{ 
        fontSize: 11.5, 
        fontWeight: 500, 
        color: '#888580', 
        display: 'block', 
        marginBottom: 5, 
        letterSpacing: '0.02em', 
        textTransform: 'uppercase' 
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {getIcon() && (
          <div style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            color: focused === fieldName ? '#1a1a1a' : '#b0aeaa',
            transition: 'color 0.2s',
          }}>
            {getIcon()}
          </div>
        )}
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => onFocus(fieldName)}
          onBlur={onBlur}
          style={{
            width: '100%', height: 36,
            paddingLeft: getIcon() ? 30 : 12,
            paddingRight: (showPasswordToggle || rightElement) ? 36 : 12,
            fontSize: 12.5, color: '#1a1a1a',
            background: focused === fieldName ? '#fff' : '#fafaf9',
            border: `1px solid ${focused === fieldName ? '#1a1a1a' : '#e8e6e1'}`,
            borderRadius: 8, outline: 'none',
            transition: 'all 0.15s',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              color: '#b0aeaa', display: 'flex', alignItems: 'center',
            }}
          >
            {showPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
          </button>
        )}
        {rightElement && !showPasswordToggle && (
          <div style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center',
          }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
