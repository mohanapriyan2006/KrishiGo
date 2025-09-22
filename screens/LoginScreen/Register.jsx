import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
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
import { handleRegister } from "../../api/user/register_firebase";
import { auth, db } from "../../config/firebase";
import { DataContext } from "../../hooks/DataContext";

const registerSchema = yup.object().shape({
	email: yup.string().required().email(),
	firstName: yup.string().required("First name is required").min(2),
	lastName: yup.string().required("Last name is required").min(1),
	phoneNumber: yup
		.string()
		.required()
		.matches(
			/^\+[0-9]{10,}$/,
			"Phone number must start with + followed by country code"
		),
	address: yup.object().shape({
		street: yup.string().required().min(5),
		city: yup.string().required().min(2),
		state: yup.string().required().min(2),
		zipCode: yup
			.string()
			.required()
			.matches(/^[0-9]{5,6}$/),
		country: yup.string().required().min(2),
	}),
	preferences: yup.object().shape({
		language: yup.string().required().oneOf(["en", "hi"]),
		notificationsEnabled: yup.boolean().required(),
	}),
	password: yup
		.string()
		.required()
		.min(8)
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
	confirmPassword: yup
		.string()
		.required()
		.oneOf([yup.ref("password")], "Passwords must match"),
});

const Register = () => {
	const navigation = useNavigation();

	const { fetchUserDetails } = useContext(DataContext);

	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		phoneNumber: "+91",
		address: {
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "India",
		},
		preferences: {
			language: "en",
			notificationsEnabled: true,
		},
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				fetchUserDetails();
				navigation.replace("Main");
			}
		});
		return unsubscribe;
	}, [navigation]);

	const handleInputChange = (field, value) => {
		setFormData((prev) => {
			if (field.includes(".")) {
				const [parent, child] = field.split(".");
				return {
					...prev,
					[parent]: {
						...prev[parent],
						[child]: value,
					},
				};
			}
			return { ...prev, [field]: value };
		});

		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
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

	const onRegister = () =>
		handleRegister({
			auth,
			db,
			formData,
			validateForm,
			setLoading,
			navigation,
			setErrors,
			fetchUserDetails
		});

	const headerHeight = useHeaderHeight();

	return (
		<SafeAreaView className="flex-1 bg-gradient-to-br from-green-100 to-green-200">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0} // NEW
				className="flex-1"
			>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
						paddingBottom: 180
					}}
					className="flex-1"
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
				>
					<View className="flex-1 justify-start relative px-8 py-10">
						<View className="items-center mb-2">
							<Text className="text-4xl font-bold text-primaryDark mb-2">
								KrishiGo
							</Text>
							<Text className="text-primaryDark text-lg">Create Account</Text>
						</View>

						<View className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl">

							<View className="flex-row gap-2 mb-4">
								<View className="flex-1">
									<TextInput
										className={`bg-white p-4 rounded-xl border ${errors.firstName ? "border-red-500" : "border-gray-300"
											}`}
										placeholder="First Name"
										value={formData.firstName}
										onChangeText={(text) => handleInputChange("firstName", text)}
									/>
									{errors.firstName && (
										<Text className="text-red-500 text-xs mt-1">
											{errors.firstName}
										</Text>
									)}
								</View>
								<View className="flex-1">
									<TextInput
										className={`bg-white p-4 rounded-xl border ${errors.lastName ? "border-red-500" : "border-gray-300"
											}`}
										placeholder="Last Name"
										value={formData.lastName}
										onChangeText={(text) => handleInputChange("lastName", text)}
									/>
									{errors.lastName && (
										<Text className="text-red-500 text-xs mt-1">
											{errors.lastName}
										</Text>
									)}
								</View>
							</View>

							<View className="mb-4">
								<TextInput
									className={`bg-white p-4 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-300"
										}`}
									placeholder="Email"
									keyboardType="email-address"
									value={formData.email}
									onChangeText={(text) => handleInputChange("email", text)}
								/>
								{errors.email && (
									<Text className="text-red-500 text-xs mt-1">
										{errors.email}
									</Text>
								)}
							</View>

							<View className="mb-4">
								<TextInput
									className={`bg-white p-4 rounded-xl border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
										}`}
									placeholder="Phone Number (with country code)"
									value={formData.phoneNumber}
									onChangeText={(text) =>
										handleInputChange("phoneNumber", text)
									}
								/>
								{errors.phoneNumber && (
									<Text className="text-red-500 text-xs mt-1">
										{errors.phoneNumber}
									</Text>
								)}
							</View>

							<View className="mb-4">
								<TextInput
									className={`bg-white p-4 rounded-xl border ${errors["address.street"]
										? "border-red-500"
										: "border-gray-300"
										}`}
									placeholder="Street Address"
									value={formData.address.street}
									onChangeText={(text) =>
										handleInputChange("address.street", text)
									}
								/>
								{errors["address.street"] && (
									<Text className="text-red-500 text-xs mt-1">
										{errors["address.street"]}
									</Text>
								)}
							</View>

							<View className="flex-row gap-2 mb-4">
								<View className="flex-1">
									<TextInput
										className={`bg-white p-4 rounded-xl border ${errors["address.city"]
											? "border-red-500"
											: "border-gray-300"
											}`}
										placeholder="City"
										value={formData.address.city}
										onChangeText={(text) =>
											handleInputChange("address.city", text)
										}
									/>
									{errors["address.city"] && (
										<Text className="text-red-500 text-xs mt-1">
											{errors["address.city"]}
										</Text>
									)}
								</View>
								<View className="flex-1">
									<TextInput
										className={`bg-white p-4 rounded-xl border ${errors["address.state"]
											? "border-red-500"
											: "border-gray-300"
											}`}
										placeholder="State"
										value={formData.address.state}
										onChangeText={(text) =>
											handleInputChange("address.state", text)
										}
									/>
									{errors["address.state"] && (
										<Text className="text-red-500 text-xs mt-1">
											{errors["address.state"]}
										</Text>
									)}
								</View>
							</View>

							<View className="mb-4">
								<TextInput
									className={`bg-white p-4 rounded-xl border ${errors["address.zipCode"]
										? "border-red-500"
										: "border-gray-300"
										}`}
									placeholder="ZIP Code"
									keyboardType="numeric"
									value={formData.address.zipCode}
									onChangeText={(text) =>
										handleInputChange("address.zipCode", text)
									}
								/>
								{errors["address.zipCode"] && (
									<Text className="text-red-500 text-xs mt-1">
										{errors["address.zipCode"]}
									</Text>
								)}
							</View>

							<View className="mb-4">
								<View className="flex-row items-center justify-between">
									<Text className="text-gray-600">Preferred Language</Text>
									<TouchableOpacity
										onPress={() =>
											handleInputChange(
												"preferences.language",
												formData.preferences.language === "en" ? "hi" : "en"
											)
										}
									>
										<Text className="text-primaryDark">
											{formData.preferences.language === "en"
												? "English"
												: "Hindi"}
										</Text>
									</TouchableOpacity>
								</View>
							</View>

							{/* <View className="mb-4">
								<View className="flex-row items-center justify-between">
									<Text className="text-gray-600">Enable Notifications</Text>
									<TouchableOpacity
										onPress={() =>
											handleInputChange(
												"preferences.notificationsEnabled",
												!formData.preferences.notificationsEnabled
											)
										}
									>
										<Ionicons
											name={
												formData.preferences.notificationsEnabled
													? "notifications"
													: "notifications-off"
											}
											size={24}
											color="gray"
										/>
									</TouchableOpacity>
								</View>
							</View> */}

							<View className="mb-4">
								<View className="relative">
									<TextInput
										className={`bg-white p-4 rounded-xl border ${errors.password ? "border-red-500" : "border-gray-300"
											}`}
										placeholder="Password"
										secureTextEntry={!isPasswordVisible}
										value={formData.password}
										onChangeText={(text) => handleInputChange("password", text)}
									/>
									<TouchableOpacity
										className="absolute right-4 top-4"
										onPress={() => setIsPasswordVisible(!isPasswordVisible)}
									>
										<Ionicons
											name={isPasswordVisible ? "eye-off" : "eye"}
											size={24}
											color="gray"
										/>
									</TouchableOpacity>
								</View>
								{errors.password && (
									<Text className="text-red-500 text-xs mt-1">
										{errors.password}
									</Text>
								)}
							</View>

							<View className="mb-4">
								<View className="relative">
									<TextInput
										className={`bg-white p-4 rounded-xl border ${errors.confirmPassword
											? "border-red-500"
											: "border-gray-300"
											}`}
										placeholder="Confirm Password"
										secureTextEntry={!isConfirmPasswordVisible}
										value={formData.confirmPassword}
										onChangeText={(text) =>
											handleInputChange("confirmPassword", text)
										}
									/>
									<TouchableOpacity
										className="absolute right-4 top-4"
										onPress={() =>
											setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
										}
									>
										<Ionicons
											name={isConfirmPasswordVisible ? "eye-off" : "eye"}
											size={24}
											color="gray"
										/>
									</TouchableOpacity>
								</View>
								{errors.confirmPassword && (
									<Text className="text-red-500 text-xs mt-1">
										{errors.confirmPassword}
									</Text>
								)}
							</View>

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

							<View className="flex-row justify-center items-center">
								<Text className="text-gray-600 text-sm">
									Already have an account?{" "}
								</Text>
								<TouchableOpacity onPress={() => navigation.navigate("Login")}>
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