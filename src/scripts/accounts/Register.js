import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('account.empty_fields_error'));
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError(t('account.invalid_email_error'));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered:', userCredential);
      alert(t('account.registration_success'));
    } catch (err) {
      setError(t('account.registration_failed', { error: err.message }));
    }
  };

  return (
    <div className="Register">
      <h2>{t('account.register')}</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder={t('account.email_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t('account.password_placeholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">{t('account.register_button')}</button>
      </form>
    </div>
  );
}

export default Register;
