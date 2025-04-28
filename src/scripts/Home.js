import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import ChooseCharacter from './accounts/ChooseCharacter';
import PreviewCharacter from './accounts/PreviewCharacter';
import Login from './accounts/Login';
import Register from './accounts/Register';
import ConfirmModal from './components/ConfirmModal'; 

function Home() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        fetchCharacterData(user.uid);
      } else {
        setUser(null);
        setCharacter(null);
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCharacterData = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && userDoc.data().character) {
        setCharacter(userDoc.data().character);
      } else {
        setCharacter(null);
      }
    } catch (err) {
      setCharacter(null);
    } finally {
      setLoading(false); 
    }
  };

  const handleLogout = () => {
    setShowModal(true); 
  };

  const confirmLogout = async () => {
    setShowModal(false); 
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const cancelLogout = () => {
    setShowModal(false); 
  };

  if (loading) {
    return (
      <div className="Home">
        <header className="Home-header">
          <h1>{t('account.welcome_logged_in')}</h1>
          <div className="loading-spinner">{t('account.loading')}</div>
        </header>
      </div>
    );
  }

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>{t('account.welcome_logged_in')}</h1>

        {user ? (
          character ? (
            <PreviewCharacter character={character} />
          ) : (
            <ChooseCharacter />
          )
        ) : (
          <div>
            {isLogin ? (
              <Login />
            ) : (
              <Register />
            )}

            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? t('account.go_to_register') : t('account.go_to_login')}
            </button>
          </div>
        )}

        {user && (
          <button onClick={handleLogout}>{t('account.logout')}</button>
        )}
      </header>

      {showModal && (
        <ConfirmModal
          message={t('account.confirm_logout')}
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </div>
  );
}

export default Home;
