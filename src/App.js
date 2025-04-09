import React from 'react';
import './i18n';
import { useTranslation } from 'react-i18next'; 
import Home from './scripts/Home';

function App() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); 
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>{t('english')}</button> 
      <button onClick={() => changeLanguage('fr')}>{t('french')}</button> 
      <button onClick={() => changeLanguage('zh')}>{t('chinese')}</button> 

      <Home />
    </div>
  );
}

export default App;
