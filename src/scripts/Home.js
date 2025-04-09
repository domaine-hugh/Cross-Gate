import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Login from './accounts/Login';
import Register from './accounts/Register';
import Account from './accounts/Account';

function Home() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="Home">
        <header className="Home-header">
          <h1>{t('welcome')}</h1> 
          <div className="loading-spinner">{t('loading')}</div> 
        </header>
      </div>
    );
  }

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>{t('welcome')}</h1> 

        {user ? (
          <Account />
        ) : (
          isLogin ? (
            <Login /> 
          ) : (
            <Register /> 
          )
        )}

        {!user && (
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? t('go_to_register') : t('go_to_login')} 
          </button>
        )}
      </header>
    </div>
  );
}

export default Home;
