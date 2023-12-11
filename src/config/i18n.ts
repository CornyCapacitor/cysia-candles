import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    debug: true,
    supportedLngs: ['en', 'pl'],
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'cookie', 'querystring', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie']
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json'
    },
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n