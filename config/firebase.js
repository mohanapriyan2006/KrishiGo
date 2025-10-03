

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, getReactNativePersistence, initializeAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Get env variables safely
const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || extra.FIREBASE_API_KEY,
	authDomain:
		process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || extra.FIREBASE_AUTH_DOMAIN,
	projectId:
		process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || extra.FIREBASE_PROJECT_ID,
	storageBucket:
		process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
		extra.FIREBASE_STORAGE_BUCKET,
	messagingSenderId:
		process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
		extra.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || extra.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

let auth;
if (Platform.OS === "web") {
    auth = getAuth(app);
    // Ensure persistence on web
    setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}



const db = getFirestore(app);

export { auth, db };
