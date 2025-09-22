import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

export const handleRegister = async ({
    auth,
    db,
    formData,
    validateForm,
    setLoading,
    navigation,
    setErrors,
    fetchUserDetails
}) => {
    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
        );
        const user = userCredential.user;

        // Create user document in Firestore following user_service.js structure
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
            authId: user.uid,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            profilePicture: "", // Initially empty
            phoneNumber: formData.phoneNumber,
            address: {
                street: formData.address.street,
                city: formData.address.city,
                state: formData.address.state,
                zipCode: formData.address.zipCode,
                country: formData.address.country,
            },
            rewards: {
                totalPoints: 0, // Initially zero
                currentPoints: 0, // Initially zero
                redeemedPoints: 0, // Initially zero
            },
            preferences: {
                language: formData.preferences.language,
                notificationsEnabled: formData.preferences.notificationsEnabled,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        console.log("✅ User profile created successfully with auth and database!");
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Main");
        fetchUserDetails();
    } catch (error) {
        console.error("Registration error:", error);
        if (error.code === "auth/email-already-in-use") {
            Alert.alert("Error", "Email is already in use.");
        } else if (error.code === "auth/weak-password") {
            Alert.alert("Error", "Password is too weak. Please choose a stronger password.");
        } else if (error.code === "auth/invalid-email") {
            Alert.alert("Error", "Invalid email address.");
        } else {
            Alert.alert("Error", "Registration failed. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};