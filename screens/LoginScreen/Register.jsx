import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import * as yup from "yup";
import {
	handleGoogleRegister,
	handleRegister,
} from "../../api/register/register_firebase";
import { auth, db } from "../../config/firebase";

// Validation schema
const registerSchema = yup.object().shape({
	firstName: yup
		.string()
		.required("First name is required")
		.min(2, "First name must be at least 2 characters"),
	lastName: yup
		.string()
		.required("Last name is required"),
	phoneNumber: yup
		.string()
		.required("Phone number is required")
		.matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
	email: yup
		.string()
		.required("Email is required")
		.email("Enter a valid email address"),
	street: yup
		.string()
		.required("Street address is required")
		.min(5, "Street address must be at least 5 characters"),
	city: yup
		.string()
		.required("City is required")
		.min(2, "City must be at least 2 characters"),
	state: yup
		.string()
		.required("State is required")
		.min(2, "State must be at least 2 characters"),
	zipCode: yup
		.string()
		.required("ZIP code is required")
		.matches(/^[0-9]{6}$/, "ZIP code must be 6 digits"),
	country: yup
		.string()
		.required("Country is required")
		.min(2, "Country must be at least 2 characters"),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Password must contain at least one uppercase letter, one lowercase letter, and one number"
		),
	confirmPassword: yup
		.string()
		.required("Confirm password is required")
		.oneOf([yup.ref("password")], "Passwords must match"),
});

const Register = () => {
	const navigation = useNavigation();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zipCode: "",
		country: "India",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);
	const [loading, setLoading] = useState(false);

	// Check if user is already logged in
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in, redirect to main screen
				navigation.navigate("Main");
			}
		});

		return unsubscribe;
	}, [navigation]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		// Clear error for this field when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: "",
			}));
		}
	};

	const validateForm = async () => {
		try {
			await registerSchema.validate(formData, { abortEarly: false });
			setErrors({});
			return true;
		} catch (validationErrors) {
			const errorObject = {};
			validationErrors.inner.forEach((error) => {
				errorObject[error.path] = error.message;
			});
			setErrors(errorObject);
			return false;
		}
	};

	// Use imported Firebase functions
	const onRegister = () =>
		handleRegister({
			auth,
			db,
			formData,
			validateForm,
			setLoading,
			navigation,
			setErrors,
		});

	const { signIn } = handleGoogleRegister({ auth, db, navigation });

	const handleNavigateToLogin = () => {
		navigation.navigate("Login");
	};

	return (
		<SafeAreaView className="flex-1 bg-gradient-to-br from-green-100 to-green-200">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
			>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					className="flex-1"
					showsVerticalScrollIndicator={false}
				>
					{/* Header */}
					<View className="flex-1 justify-center px-8 py-20">
						{/* Logo/Title */}
						<View className="items-center mb-2">
							<Text className="text-4xl font-bold text-primaryDark mb-2">
								KrishiGo
							</Text>
							<Text className="text-primaryDark text-lg">Create Account</Text>
						</View>

						{/* Registration Form */}
						<View className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
							{/* Name Row */}
							<View className="flex-row mb-4 gap-2">
								{/* First Name */}
								<View className="flex-1">
									<Text className="text-gray-600 text-sm mb-2 font-medium">
										First Name
									</Text>
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.firstName ? "border-red-500" : "border-gray-200"
											} shadow-sm`}
										placeholder="First name"
										placeholderTextColor="#9CA3AF"
										value={formData.firstName}
										onChangeText={(text) =>
											handleInputChange("firstName", text)
										}
										autoCapitalize="words"
										autoCorrect={false}
									/>
									{errors.firstName && (
										<Text className="text-red-500 text-xs mt-1 ml-2">
											{errors.firstName}
										</Text>
									)}
								</View>

								{/* Last Name */}
								<View className="flex-1">
									<Text className="text-gray-600 text-sm mb-2 font-medium">
										Last Name
									</Text>
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.lastName ? "border-red-500" : "border-gray-200"
											} shadow-sm`}
										placeholder="Last name"
										placeholderTextColor="#9CA3AF"
										value={formData.lastName}
										onChangeText={(text) => handleInputChange("lastName", text)}
										autoCapitalize="words"
										autoCorrect={false}
									/>
									{errors.lastName && (
										<Text className="text-red-500 text-xs mt-1 ml-2">
											{errors.lastName}
										</Text>
									)}
								</View>
							</View>

							{/* Phone Number */}
							<View className="mb-4">
								<Text className="text-gray-600 text-sm mb-2 font-medium">
									Phone Number
								</Text>
								<TextInput
									className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.phoneNumber ? "border-red-500" : "border-gray-200"
										} shadow-sm`}
									placeholder="Enter phone number"
									placeholderTextColor="#9CA3AF"
									value={formData.phoneNumber}
									onChangeText={(text) =>
										handleInputChange("phoneNumber", text)
									}
									keyboardType="phone-pad"
									maxLength={10}
								/>
								{errors.phoneNumber && (
									<Text className="text-red-500 text-xs mt-1 ml-2">
										{errors.phoneNumber}
									</Text>
								)}
							</View>

							{/* Email */}
							<View className="mb-4">
								<Text className="text-gray-600 text-sm mb-2 font-medium">
									Email Address
								</Text>
								<TextInput
									className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.email ? "border-red-500" : "border-gray-200"
										} shadow-sm`}
									placeholder="Enter email address"
									placeholderTextColor="#9CA3AF"
									value={formData.email}
									onChangeText={(text) => handleInputChange("email", text)}
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
								/>
								{errors.email && (
									<Text className="text-red-500 text-xs mt-1 ml-2">
										{errors.email}
									</Text>
								)}
							</View>

							{/* Street Address */}
							<View className="mb-4">
								<Text className="text-gray-600 text-sm mb-2 font-medium">
									Street Address
								</Text>
								<TextInput
									className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.street ? "border-red-500" : "border-gray-200"
										} shadow-sm`}
									placeholder="Enter street address"
									placeholderTextColor="#9CA3AF"
									value={formData.street}
									onChangeText={(text) => handleInputChange("street", text)}
									autoCapitalize="words"
									autoCorrect={false}
								/>
								{errors.street && (
									<Text className="text-red-500 text-xs mt-1 ml-2">
										{errors.street}
									</Text>
								)}
							</View>

							{/* Location Row 1 */}
							<View className="flex-row mb-4 gap-2">
								{/* City */}
								<View className="flex-1">
									<Text className="text-gray-600 text-sm mb-2 font-medium">
										City
									</Text>
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.city ? "border-red-500" : "border-gray-200"
											} shadow-sm`}
										placeholder="City"
										placeholderTextColor="#9CA3AF"
										value={formData.city}
										onChangeText={(text) => handleInputChange("city", text)}
										autoCapitalize="words"
										autoCorrect={false}
									/>
									{errors.city && (
										<Text className="text-red-500 text-xs mt-1 ml-2">
											{errors.city}
										</Text>
									)}
								</View>

								{/* State */}
								<View className="flex-1">
									<Text className="text-gray-600 text-sm mb-2 font-medium">
										State
									</Text>
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.state ? "border-red-500" : "border-gray-200"
											} shadow-sm`}
										placeholder="State"
										placeholderTextColor="#9CA3AF"
										value={formData.state}
										onChangeText={(text) => handleInputChange("state", text)}
										autoCapitalize="words"
										autoCorrect={false}
									/>
									{errors.state && (
										<Text className="text-red-500 text-xs mt-1 ml-2">
											{errors.state}
										</Text>
									)}
								</View>
							</View>

							{/* Location Row 2 */}
							<View className="flex-row mb-4 gap-2">
								{/* ZIP Code */}
								<View className="flex-1">
									<Text className="text-gray-600 text-sm mb-2 font-medium">
										ZIP Code
									</Text>
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.zipCode ? "border-red-500" : "border-gray-200"
											} shadow-sm`}
										placeholder="ZIP code"
										placeholderTextColor="#9CA3AF"
										value={formData.zipCode}
										onChangeText={(text) => handleInputChange("zipCode", text)}
										keyboardType="number-pad"
										maxLength={6}
									/>
									{errors.zipCode && (
										<Text className="text-red-500 text-xs mt-1 ml-2">
											{errors.zipCode}
										</Text>
									)}
								</View>

								{/* Country */}
								<View className="flex-1">
									<Text className="text-gray-600 text-sm mb-2 font-medium">
										Country
									</Text>
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 text-base border ${errors.country ? "border-red-500" : "border-gray-200"
											} shadow-sm`}
										placeholder="Country"
										placeholderTextColor="#9CA3AF"
										value={formData.country}
										onChangeText={(text) => handleInputChange("country", text)}
										autoCapitalize="words"
										autoCorrect={false}
									/>
									{errors.country && (
										<Text className="text-red-500 text-xs mt-1 ml-2">
											{errors.country}
										</Text>
									)}
								</View>
							</View>

							{/* Password */}
							<View className="mb-4">
								<Text className="text-gray-600 text-sm mb-2 font-medium">
									Password
								</Text>
								<View className="relative">
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 pr-12 text-base border ${errors.password ? "border-red-500" : "border-gray-200"
											} shadow-sm`}
										placeholder="Enter password"
										placeholderTextColor="#9CA3AF"
										value={formData.password}
										onChangeText={(text) => handleInputChange("password", text)}
										secureTextEntry={!isPasswordVisible}
										autoCapitalize="none"
										autoCorrect={false}
									/>
									<TouchableOpacity
										className="absolute right-4 top-3"
										onPress={() => setIsPasswordVisible(!isPasswordVisible)}
									>
										<Ionicons
											name={isPasswordVisible ? "eye-off" : "eye"}
											size={20}
											color="#9CA3AF"
										/>
									</TouchableOpacity>
								</View>
								{errors.password && (
									<Text className="text-red-500 text-xs mt-1 ml-2">
										{errors.password}
									</Text>
								)}
							</View>

							{/* Confirm Password */}
							<View className="mb-6">
								<Text className="text-gray-600 text-sm mb-2 font-medium">
									Confirm Password
								</Text>
								<View className="relative">
									<TextInput
										className={`w-full bg-white rounded-xl px-4 py-3 pr-12 text-base border ${errors.confirmPassword
											? "border-red-500"
											: "border-gray-200"
											} shadow-sm`}
										placeholder="Confirm password"
										placeholderTextColor="#9CA3AF"
										value={formData.confirmPassword}
										onChangeText={(text) =>
											handleInputChange("confirmPassword", text)
										}
										secureTextEntry={!isConfirmPasswordVisible}
										autoCapitalize="none"
										autoCorrect={false}
									/>
									<TouchableOpacity
										className="absolute right-4 top-3"
										onPress={() =>
											setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
										}
									>
										<Ionicons
											name={isConfirmPasswordVisible ? "eye-off" : "eye"}
											size={20}
											color="#9CA3AF"
										/>
									</TouchableOpacity>
								</View>
								{errors.confirmPassword && (
									<Text className="text-red-500 text-xs mt-1 ml-2">
										{errors.confirmPassword}
									</Text>
								)}
							</View>

							{/* Register Button */}
							<TouchableOpacity
								className={`w-full bg-primary rounded-xl py-4 mb-4 shadow-lg ${loading ? "opacity-70" : ""
									}`}
								onPress={onRegister}
								disabled={loading}
							>
								<Text className="text-white text-center text-lg font-semibold">
									{loading ? "Creating Account..." : "Create Account"}
								</Text>
							</TouchableOpacity>

							{/* Google Register Button */}
							<TouchableOpacity
    className="w-full bg-white border border-gray-200 rounded-xl py-4 mb-6 shadow-sm flex-row items-center justify-center"
    onPress={signIn}
>
    <Text className="text-lg mr-2">G</Text>
    <Text className="text-gray-700 text-base font-medium">
        Continue with Google
    </Text>
</TouchableOpacity>

							{/* Login Link */}
							<View className="flex-row justify-center items-center">
								<Text className="text-gray-600 text-sm">
									Already have an account?{" "}
								</Text>
								<TouchableOpacity onPress={handleNavigateToLogin}>
									<Text className="text-primaryDark font-semibold underline">
										Login here
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default Register;