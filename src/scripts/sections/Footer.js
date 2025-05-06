import React from 'react';
import '../../i18n';
import { useTranslation } from 'react-i18next'; 

function Footer() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang); 
  };

  return (
      <footer>
        <button onClick={() => changeLanguage('en')}>{t('english')}</button> 
        <button onClick={() => changeLanguage('fr')}>{t('french')}</button> 
        <button onClick={() => changeLanguage('zh')}>{t('chinese')}</button> 
      </footer>
  );
}

export default Footer;