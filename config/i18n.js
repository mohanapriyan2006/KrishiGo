// config/i18n.js
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import hi from "../locales/hi.json";
import ml from "../locales/ml.json";
import ta from "../locales/ta.json";

// Get system language safely
const locales = Localization.getLocales();
const systemLang = locales?.length > 0 ? locales[0].languageCode : "en";

i18n.use(initReactI18next).init({
	compatibilityJSON: "v3",
	lng: systemLang, // default system language
	fallbackLng: "en",
	resources: {
		en: { translation: en },
		hi: { translation: hi },
		ta: { translation: ta },
		ml: { translation: ml },
	},
	interpolation: {
		escapeValue: false, // react already protects from XSS
	},
	react: {
		useSuspense: false, // avoid RN Suspense issues
	},
});

export default i18n;
