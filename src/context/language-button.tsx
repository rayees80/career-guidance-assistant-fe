'use client';

import { useLanguage } from './language-context';
import React from 'react';

export default function LanguageToggleButton() {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'english' ? 'arabic' : 'english';
    changeLanguage(newLang);
  };

  return (
    <div>
      <p>Current Language: {language}</p>
      <button onClick={toggleLanguage}>
        Switch to {language === 'english' ? 'Arabic' : 'English'}
      </button>
    </div>
  );
}
