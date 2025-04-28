import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { doc, setDoc } from 'firebase/firestore';

const ChooseCharacter = () => {
  const { t } = useTranslation();
  const [characterName, setCharacterName] = useState('');
  const [error, setError] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('style1');
  const [currentWeaponIndex, setCurrentWeaponIndex] = useState(0);
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  const characterData = useMemo(() => ({
    xin: 'xin',
    zuozang: 'zuozang',
    mengzi: 'mengzi',
    geleisi: 'geleisi',
  }), []);

  const weapons = useMemo(() => ['unarmed', 'axe', 'bow', 'sword', 'staff', 'spear'], []);
  const actions = useMemo(() => ['stand', 'walk'], []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert(t('account:logged_out'));
    } catch (error) {
      alert(t('account:logout_error', { error: error.message }));
    }
  };

  const handleCreateCharacter = async () => {
    if (!characterName || !selectedCharacter) {
      setError(t('account:empty_name_error'));
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        character: {
            name: characterName,
            character: selectedCharacter, 
            style: selectedStyle, 
        },
        createdAt: new Date(), 
      }, { merge: true });

      alert(t('account:character_created_success'));
    } catch (err) {
      setError(t('account:create_character_error'));
    }
  };

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setCurrentWeaponIndex(0);
    setCurrentActionIndex(0);
    updateImage(character, selectedStyle, weapons[0], actions[0]);
  };

  const handleStyleChange = (style) => {
    setSelectedStyle(style);
    if (selectedCharacter) {
      updateImage(selectedCharacter, style, weapons[currentWeaponIndex], actions[currentActionIndex]);
    }
  };

  const updateImage = useCallback((character, style, weapon, action) => {
    const imageUrl = `/images/characters/${characterData[character]}/${style}/${weapon}/${action}/0.gif`;
    setSelectedImage(imageUrl);
  }, [characterData]);

  const startCycle = useCallback(() => {
    if (!selectedCharacter) return;

    const nextWeaponIndex = (currentWeaponIndex + 1) % weapons.length;
    const nextActionIndex = (currentActionIndex + 1) % actions.length;

    const nextWeapon = weapons[nextWeaponIndex];
    const nextAction = actions[nextActionIndex];

    updateImage(selectedCharacter, selectedStyle, nextWeapon, nextAction);

    setCurrentWeaponIndex(nextWeaponIndex);
    setCurrentActionIndex(nextActionIndex);
  }, [currentWeaponIndex, currentActionIndex, selectedCharacter, selectedStyle, weapons, actions, updateImage]);

  useEffect(() => {
    if (!selectedCharacter) return;

    const intervalId = setInterval(() => {
      startCycle();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedCharacter, selectedStyle, currentWeaponIndex, currentActionIndex, startCycle]);

  return (
    <div className="ChooseCharacter">
      <h2>{t('account:choose_your_character')}</h2>

      <div className="character-options" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {Object.keys(characterData).map((character) => (
          <div 
            key={character}
            className={`character-option ${selectedCharacter === character ? 'selected' : ''}`}
            onClick={() => handleCharacterClick(character)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={`/images/characters/${characterData[character]}/style1/unarmed/stand/0.gif`}
              alt={character}
              style={{ maxWidth: '100px' }}
            />
          </div>
        ))}
      </div>

      {selectedCharacter && (
        <div>
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="characterName">{t('account:character_name')}</label>
            <input
              type="text"
              id="characterName"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder={t('account:enter_character_name')}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <label>{t('account:choose_style')}</label>
            <div>
              {['style1', 'style2', 'style3', 'style4'].map((style) => (
                <button
                  key={style}
                  onClick={() => handleStyleChange(style)}
                  style={{
                    margin: '5px',
                    backgroundColor: selectedStyle === style ? 'lightgray' : 'transparent',
                    padding: '5px',
                  }}
                >
                  {t(`account:${style}`)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <img
              src={selectedImage}
              alt={selectedCharacter}
              style={{ maxWidth: '200px', marginTop: '20px' }}
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <button onClick={handleCreateCharacter}>{t('account:create_character')}</button>
          </div>

          {error && (
            <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <button onClick={handleLogout}>{t('account:logout')}</button>
      </div>
    </div>
  );
};

export default ChooseCharacter;
