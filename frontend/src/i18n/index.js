import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import hi from './hi.json';
import ks from './ks.json';
import ur from './ur.json';

export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر / कॉशुर', dir: 'rtl' }
];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ks: { translation: ks },
  ur: { translation: ur }
};

const savedLng = typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'en') : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

const updateDocumentAttributes = (lng) => {
  if (typeof document !== 'undefined') {
    const isRtl = lng === 'ur' || lng === 'ks';
    document.documentElement.lang = lng;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }
};

updateDocumentAttributes(savedLng);

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
  }
  updateDocumentAttributes(lng);
});

export default i18n;

