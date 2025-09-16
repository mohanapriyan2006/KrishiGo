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

		// Save user data in Firestore
		await setDoc(doc(db, "users", user.uid), {
			authId: user.uid,
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			phoneNumber: formData.phoneNumber,
			address: {
				street: formData.street,
				city: formData.city,
				state: formData.state,
				zipCode: formData.zipCode,
				country: formData.country,
			},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});

		Alert.alert("Success", "Account created successfully!");
		navigation.navigate("Main");
	} catch (error) {
		console.error("Registration error:", error);
		if (error.code === "auth/email-already-in-use") {
			Alert.alert("Error", "Email is already in use.");
		} else {
			Alert.alert("Error", "Registration failed. Please try again.");
		}
	} finally {
		setLoading(false);
	}
};
