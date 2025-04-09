import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next'; 

const Account = () => {
  const { t } = useTranslation(); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      alert(t('logged_out'));
    } catch (error) {
      console.error("Logout failed: ", error.message);
      alert(t('logout_error', { error: error.message }));
    }
  };

  return (
    <div className="Account">
      <h2>{t('your_account')}</h2> 
      <p>{t('welcome_logged_in')}</p> 
      <button onClick={handleLogout}>{t('logout')}</button> 
    </div>
  );
};

export default Account;
