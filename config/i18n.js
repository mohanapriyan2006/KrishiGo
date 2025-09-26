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

// Create a promise to track initialization
const initPromise = i18n.use(initReactI18next).init({
	compatibilityJSON: "v3",
	lng: systemLang,
	fallbackLng: "en",
	resources: {
		en: { translation: en },
		hi: { translation: hi },
		ta: { translation: ta },
		ml: { translation: ml },
	},
	interpolation: {
		escapeValue: false,
	},
	react: {
		useSuspense: false,
		bindI18n: "languageChanged",
		bindI18nStore: "",
		transEmptyNodeValue: "",
		transSupportBasicHtmlNodes: true,
		transKeepBasicHtmlNodesFor: ["br", "strong", "i"],
	},
});

// Export the promise for optional waiting
export const i18nInit = initPromise;

export default i18n;
