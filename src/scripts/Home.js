import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Login from './accounts/Login';
import Register from './accounts/Register';
import Account from './accounts/Account';

function Home() {
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
          <h1>Welcome to the Pokemon Fun App!</h1>
          <div className="loading-spinner">Loading...</div>
        </header>
      </div>
    );
  }

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Welcome to the Pokemon Fun App!</h1>
        
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
            {isLogin ? 'Go to Register' : 'Go to Login'}
          </button>
        )}
      </header>
    </div>
  );
}

export default Home;
