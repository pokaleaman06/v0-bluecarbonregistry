import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGES } from '@bluecarbon/shared'

// Import translation files
import en from './locales/en.json'
import hi from './locales/hi.json'

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  // Add other languages as needed
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
export { LANGUAGES }
