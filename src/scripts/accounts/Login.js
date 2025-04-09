import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    </div>
  );
}

export default Login;
