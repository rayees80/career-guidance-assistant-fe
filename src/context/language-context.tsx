'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  getCurrentLanguage,
  changeLanguageOnServer,
  fetchLanguageStrings,
  LanguageCode,
} from './fetchlanguage';

interface LanguageContextType {
  language: LanguageCode;
  changeLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageCode | null>(null); // no default now

  const changeLanguage = async (lang: LanguageCode) => {
    await changeLanguageOnServer(lang);
    const confirmed = await fetchLanguageStrings(lang);
    setLanguage(confirmed);
  };

  useEffect(() => {
    const init = async () => {
      const current = await getCurrentLanguage();
      setLanguage(current);
    };
    init();
  }, []);

  if (!language) {
    return <div>Loading language...</div>; // or a loader/spinner
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
