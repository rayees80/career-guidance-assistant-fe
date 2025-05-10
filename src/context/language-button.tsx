'use client';

import { Button } from '@/components/ui/button';
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
      <Button
        className="px-3 py-2"
        onClick={toggleLanguage}
      >
        {language === 'english' ? 'Arabic' : 'English'}
      </Button>
    </div>
  );
}
