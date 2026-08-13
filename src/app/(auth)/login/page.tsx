'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const identifier = loginMethod === 'phone' ? phone : email;
    if (!identifier.trim()) {
      setError(loginMethod === 'phone' ? 'Please enter your phone number' : 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1200);
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.illustration}>
            <svg width="280" height="220" viewBox="0 0 280 220" fill="none">
              <rect x="40" y="30" width="200" height="140" rx="12" fill="#EBF5FF" stroke="#2563EB" strokeWidth="1.5" />
              <rect x="55" y="50" width="80" height="10" rx="3" fill="#BFDBFE" />
              <rect x="55" y="70" width="170" height="6" rx="2" fill="#DBEAFE" />
              <rect x="55" y="84" width="140" height="6" rx="2" fill="#DBEAFE" />
              <rect x="55" y="98" width="160" height="6" rx="2" fill="#DBEAFE" />
              <rect x="55" y="120" width="60" height="24" rx="6" fill="#2563EB" />
              <rect x="55" y="126" width="40" height="12" rx="3" fill="#EBF5FF" opacity="0.8" />
              <circle cx="200" cy="60" r="20" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M195 60l3 3 7-7" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="70" cy="195" r="15" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="140" cy="200" r="12" fill="#DCFCE7" stroke="#22C55E" strokeWidth="1" />
              <circle cx="210" cy="190" r="18" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1" />
              <path d="M62 195h16M70 187v16" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className={styles.leftTitle}>Welcome to SchoolAI</h2>
          <p className={styles.leftDesc}>
            India&#39;s smartest school management platform. Track attendance, homework, exams, fees — everything in one place.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563EB" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M6 9l2 2 4-4"/></svg>
              <span>Real-time attendance tracking</span>
            </div>
            <div className={styles.feature}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563EB" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M6 9l2 2 4-4"/></svg>
              <span>AI-powered student insights</span>
            </div>
            <div className={styles.feature}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563EB" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M6 9l2 2 4-4"/></svg>
              <span>Instant parent-teacher chat</span>
            </div>
            <div className={styles.feature}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563EB" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M6 9l2 2 4-4"/></svg>
              <span>10,000+ students supported</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formContainer}>
          <div className={styles.brandMark}>
            <div className={styles.brandIcon}>S</div>
            <span className={styles.brandName}>SchoolAI</span>
          </div>

          <h1 className={styles.formTitle}>Sign in to your account</h1>
          <p className={styles.formDesc}>Parent, Teacher, or Admin — one login for all</p>

          {/* Login method toggle */}
          <div className={styles.methodToggle}>
            <button
              className={`${styles.methodBtn} ${loginMethod === 'phone' ? styles.methodActive : ''}`}
              onClick={() => { setLoginMethod('phone'); setError(''); }}
            >
              Phone Number
            </button>
            <button
              className={`${styles.methodBtn} ${loginMethod === 'email' ? styles.methodActive : ''}`}
              onClick={() => { setLoginMethod('email'); setError(''); }}
            >
              Email
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {loginMethod === 'phone' ? (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Phone Number</label>
                <div className={styles.phoneWrap}>
                  <span className={styles.phoneCode}>+91</span>
                  <input
                    type="tel"
                    className={styles.phoneInput}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={12}
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>Password</label>
                <button type="button" className={styles.forgotLink}>Forgot password?</button>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l14 14"/><path d="M7.6 7.6a2 2 0 002.8 2.8"/><path d="M5.1 5.1A7.5 7.5 0 001 9s2.5 5 8 5a7.2 7.2 0 003.9-1.1"/><path d="M14 12.4A7.5 7.5 0 0017 9s-2.5-5-8-5c-.6 0-1.2.1-1.8.2"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 9s2.5-5 8-5 8 5 8 5-2.5 5-8 5-8-5-8-5z"/><circle cx="9" cy="9" r="2"/></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="6"/><path d="M7 4v3M7 9.5h.01"/></svg>
                {error}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button className={styles.otpBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h12a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M16 5l-7 4.5L2 5"/></svg>
            Send OTP Instead
          </button>

          <div className={styles.footer}>
            <p>Don&#39;t have an account? <button className={styles.linkBtn}>Contact School Admin</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}
