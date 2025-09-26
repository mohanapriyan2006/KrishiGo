import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../config/firebase";

export default function useLanguage() {
	const { i18n } = useTranslation();

	// Switch language and save to Firestore
	const changeLanguage = async (langCode) => {
		try {
			await i18n.changeLanguage(langCode);

			const user = auth.currentUser;
			if (user) {
				const userRef = doc(db, "users", user.uid);
				await setDoc(userRef, { language: langCode }, { merge: true });
			}

			// Also save to AsyncStorage for persistence
			// await AsyncStorage.setItem('user-language', langCode);
		} catch (error) {
			console.error("Error changing language:", error);
		}
	};

	// Load language from Firestore on mount
	useEffect(() => {
		const loadLanguage = async () => {
			try {
				let langToSet = i18n.language;

				// First try to get from user preference
				const user = auth.currentUser;
				if (user) {
					const userRef = doc(db, "users", user.uid);
					const snapshot = await getDoc(userRef);
					if (snapshot.exists() && snapshot.data().language) {
						langToSet = snapshot.data().language;
					}
				}

				// If no user preference, try AsyncStorage
				// const storedLang = await AsyncStorage.getItem('user-language');
				// if (storedLang) {
				//     langToSet = storedLang;
				// }

				if (langToSet && langToSet !== i18n.language) {
					await i18n.changeLanguage(langToSet);
				}
			} catch (error) {
				console.error("Error loading language:", error);
			}
		};

		loadLanguage();
	}, []);

	return {
		changeLanguage,
		currentLanguage: i18n.language,
		languageReady: i18n.isInitialized,
	};
}
