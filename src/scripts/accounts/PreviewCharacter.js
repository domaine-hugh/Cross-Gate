import React, { useState, useEffect, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import ConfirmModal from '../components/ConfirmModal';

const PreviewCharacter = () => {
  const { t } = useTranslation();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const fetchCharacter = useCallback(async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists() && userDoc.data().character) {
        setCharacter(userDoc.data().character);
      } else {
        setCharacter(null);
      }
    } catch (err) {
      setError(t('fetch_character_error'));
    }
  }, [t]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchCharacter();
    }
  }, [fetchCharacter]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert(t('logged_out'));
    } catch (error) {
      alert(t('logout_error', { error: error.message }));
    }
  };

  const handleDeleteCharacter = async () => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await deleteDoc(userRef);
      setCharacter(null);
      alert(t('character_deleted_success'));
    } catch (err) {
      setError(t('delete_character_error'));
    }
  };

  const getCharacterImage = (character, style) => {
    return `/images/characters/${character}/${style}/unarmed/stand/0.gif`;
  };

  return (
    <div className="PreviewCharacter">
      <h2>{t('your_character')}</h2>

      {character ? (
        <>
          <p>{t('name')}: {character.name}</p>
          <p>{t('class')}: {character.character}</p>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <img
              src={getCharacterImage(character.character, character.style)}
              alt={character.character}
              style={{ maxWidth: '200px', marginTop: '20px' }}
            />
          </div>

          <button onClick={() => setConfirmDeleteOpen(true)}>
            {t('delete_character_button')}
          </button>
        </>
      ) : (
        <p>{t('no_character_selected')}</p>
      )}

      {error && <p className="error">{error}</p>}

      <button onClick={() => setConfirmLogoutOpen(true)}>
        {t('logout')}
      </button>

      <ConfirmModal
        open={confirmLogoutOpen}
        message={t('confirm_logout')}
        onConfirm={() => {
          setConfirmLogoutOpen(false);
          handleLogout();
        }}
        onCancel={() => setConfirmLogoutOpen(false)}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        message={t('confirm_delete_character')}
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          handleDeleteCharacter();
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
};

export default PreviewCharacter;
