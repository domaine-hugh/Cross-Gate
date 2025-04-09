import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState(''); 
  const [showResetPassword, setShowResetPassword] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('empty_fields_error'));
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential);
      alert(t('login_success'));
    } catch (err) {
      console.error('Login failed:', err);
      setError(t('login_failed', { error: err.message }));
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!resetEmail) {
      setError(t('empty_fields_error'));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert(t('password_reset_email_sent'));
      setShowResetPassword(false); 
    } catch (err) {
      console.error('Password reset failed:', err);
      setError(t('reset_password_failed', { error: err.message }));
    }
  };

  return (
    <div className="Login">
      <h2>{t('login')}</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder={t('email_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t('password_placeholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">{t('login_button')}</button>
      </form>

      <button
        type="button"
        onClick={() => setShowResetPassword(true)}
      >
        {t('forgot_password')}
      </button>

      {showResetPassword && (
        <div className="resetPasswordForm">
          <h3>{t('reset_password')}</h3>
          <form onSubmit={handlePasswordReset}>
            <input
              type="email"
              placeholder={t('email_placeholder')}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            {error && <p>{error}</p>}
            <button type="submit">{t('send_reset_link')}</button>
          </form>
          <button onClick={() => setShowResetPassword(false)}>
            {t('cancel')}
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
