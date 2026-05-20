import React, { useState } from 'react';
import { ShieldCheck, User as UserIcon, Lock, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Role } from '../types';

const Login: React.FC = () => {
  const { login, theme, toggleTheme } = useAppContext();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('Tester');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== '123456') {
      setError('Invalid verification code. Hint: use 123456');
      return;
    }
    setError('');
    login({ username, role });
  };

  return (
    <div className="login-container" style={{ position: 'relative' }}>
      <button 
        onClick={toggleTheme} 
        className="btn-icon" 
        title="Toggle Theme" 
        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>
      <div className="login-card">
        <div className="login-header">
          <div className="icon-wrapper">
            <ShieldCheck size={40} className="text-primary" />
          </div>
          <h2>QA System Login</h2>
          <p>Secure manual verification required</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="login-form fade-in">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-with-icon">
                <UserIcon size={20} className="input-icon" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role</label>
              <div className="role-selection">
                <button
                  type="button"
                  className={`role-btn ${role === 'Tester' ? 'active' : ''}`}
                  onClick={() => setRole('Tester')}
                >
                  Tester
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'Developer' ? 'active' : ''}`}
                  onClick={() => setRole('Developer')}
                >
                  Developer
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit} className="login-form fade-in">
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <p className="help-text">Please enter the 6-digit security code.</p>
              <div className="input-with-icon">
                <Lock size={20} className="input-icon" />
                <input
                  id="code"
                  type="password"
                  placeholder="e.g. 123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  autoFocus
                />
              </div>
            </div>

            <div className="button-group">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Verify & Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
