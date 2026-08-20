import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from './types';
import { TRANSLATIONS } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof TRANSLATIONS.EN;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: TRANSLATIONS[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

const defaultLanguageContext: LanguageContextType = {
  language: 'EN',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: TRANSLATIONS.EN,
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  return context || defaultLanguageContext;
};
