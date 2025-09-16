import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

// Save user to Firestore
export const saveUserToFirestore = async (db, formData, user) => {
    try {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            city: formData.city,
            state: formData.state,
            createdAt: new Date(),
            lastLogin: new Date(),
        });
        console.log("User saved to Firestore successfully");
    } catch (error) {
        console.error("Error saving user to Firestore:", error);
        throw new Error("Failed to save user data");
    }
};

// Email/password registration
export const handleRegister = async ({
    auth,
    db,
    formData,
    validateForm,
    setLoading,
    navigation,
    setErrors,
}) => {
    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );
        await saveUserToFirestore(db, formData, userCredential.user);

        Alert.alert("Success", "Registration successful!", [
            {
                text: "OK",
                onPress: () => {
                    navigation.navigate("Main");
                },
            },
        ]);
    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "auth/email-already-in-use") {
            Alert.alert(
                "Account Exists",
                "This email is already registered. Please login instead.",
                [
                    {
                        text: "Login",
                        onPress: () => navigation.navigate("Login"),
                    },
                    { text: "OK" },
                ]
            );
        } else if (error.code === "auth/weak-password") {
            Alert.alert(
                "Error",
                "Password is too weak. Please choose a stronger password."
            );
        } else {
            Alert.alert("Error", "Registration failed. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};

// Google registration
export const handleGoogleRegister = async ({
    auth,
    db,
    navigation,
}) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                firstName: user.displayName?.split(" ")[0] || "",
                lastName: user.displayName?.split(" ")[1] || "",
                email: user.email,
                phoneNumber: "",
                city: "",
                state: "",
                createdAt: new Date(),
                lastLogin: new Date(),
                isGoogleSignIn: true,
            });
        }

        Alert.alert("Success", "Google registration successful!");
        navigation.navigate("Main");
    } catch (error) {
        console.error("Google sign-in error:", error);
        Alert.alert("Error", "Google registration failed. Please try again.");
    }
};