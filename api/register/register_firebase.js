import {
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const {
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
} = Constants.expoConfig.extra || process.env;

// Google Registration (Expo + .env)
export const handleGoogleRegister = ({ auth, db, navigation }) => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    });

    const signIn = async () => {
        try {
            const result = await promptAsync();

            if (result.type === "success") {
                const { id_token } = result.params;
                const credential = GoogleAuthProvider.credential(id_token);
                const userCredential = await signInWithCredential(auth, credential);
                const user = userCredential.user;

                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists()) {
                    await saveGoogleUserToFirestore(db, user);
                }

                Alert.alert("Success", "Google registration successful!");
                navigation.navigate("Main");
            } else {
                Alert.alert("Cancelled", "Google sign-in was cancelled.");
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            Alert.alert("Error", "Google registration failed. Please try again.");
        }
    };

    return { signIn, request, response };
};
