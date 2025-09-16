import {
	Feather,
	Ionicons,
	MaterialIcons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import { signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Alert,
	ActivityIndicator,
	Image,
	Modal,
	TextInput,
	Platform,
	KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProfileModal = ({
	visible,
	onClose,
	onUpdate,
	initialData,
	processing,
}) => {
	const [formData, setFormData] = useState({
		firstName: initialData?.firstName || "",
		lastName: initialData?.lastName || "",
		phoneNumber: initialData?.phoneNumber || "",
		location: initialData?.location || "",
	});

	useEffect(() => {
		if (visible) {
			setFormData({
				firstName: initialData?.firstName || "",
				lastName: initialData?.lastName || "",
				phoneNumber: initialData?.phoneNumber || "",
				location: initialData?.location || "",
			});
		}
	}, [visible, initialData]);

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50 justify-end">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<View className="bg-white rounded-t-3xl p-6">
						<View className="flex-row justify-between items-center mb-6">
							<Text className="text-xl font-semibold">Edit Profile</Text>
							<TouchableOpacity onPress={onClose}>
								<Feather name="x" size={24} />
							</TouchableOpacity>
						</View>

						<View className="gap-4">
							<TextInput
								className="bg-gray-100 p-4 rounded-xl"
								placeholder="First Name"
								value={formData.firstName}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, firstName: text }))
								}
							/>
							<TextInput
								className="bg-gray-100 p-4 rounded-xl"
								placeholder="Last Name"
								value={formData.lastName}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, lastName: text }))
								}
							/>
							<TextInput
								className="bg-gray-100 p-4 rounded-xl"
								placeholder="Phone Number"
								value={formData.phoneNumber}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, phoneNumber: text }))
								}
								keyboardType="phone-pad"
							/>
							<TextInput
								className="bg-gray-100 p-4 rounded-xl"
								placeholder="Location"
								value={formData.location}
								onChangeText={(text) =>
									setFormData((prev) => ({ ...prev, location: text }))
								}
							/>

							<TouchableOpacity
								onPress={() => onUpdate(formData)}
								disabled={processing}
								className={`bg-primary p-4 rounded-xl ${
									processing ? "opacity-50" : ""
								}`}
							>
								<Text className="text-white text-center font-semibold">
									{processing ? "Updating..." : "Update Profile"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
};

const EditProfilePhotoModal = ({
	visible,
	onClose,
	onUpdate,
	currentPhoto,
	processing,
}) => {
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.5,
		});

		if (!result.canceled && result.assets[0].uri) {
			const uri = result.assets[0].uri;

			// Upload to Firebase Storage
			try {
				const response = await fetch(uri);
				const blob = await response.blob();
				const filename = `profiles/${auth.currentUser.uid}_${Date.now()}`;
				const storageRef = ref(storage, filename);

				await uploadBytes(storageRef, blob);
				const downloadUrl = await getDownloadURL(storageRef);

				onUpdate(downloadUrl);
			} catch (err) {
				console.error("Error uploading image:", err);
				Alert.alert("Error", "Failed to upload image. Please try again.");
			}
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50 justify-end">
				<View className="bg-white rounded-t-3xl p-6">
					<View className="flex-row justify-between items-center mb-6">
						<Text className="text-xl font-semibold">Change Profile Photo</Text>
						<TouchableOpacity onPress={onClose}>
							<Feather name="x" size={24} />
						</TouchableOpacity>
					</View>

					<View className="gap-4">
						<TouchableOpacity
							onPress={pickImage}
							disabled={processing}
							className={`flex-row items-center p-4 bg-blue-50 rounded-xl ${
								processing ? "opacity-50" : ""
							}`}
						>
							<MaterialCommunityIcons
								name="image-plus"
								size={24}
								color="#3B82F6"
							/>
							<Text className="ml-3 text-blue-500 font-medium">
								Choose from Library
							</Text>
						</TouchableOpacity>

						{currentPhoto && (
							<TouchableOpacity
								onPress={() => onUpdate("")}
								disabled={processing}
								className="flex-row items-center p-4 bg-red-50 rounded-xl"
							>
								<MaterialCommunityIcons
									name="image-remove"
									size={24}
									color="#EF4444"
								/>
								<Text className="ml-3 text-red-500 font-medium">
									Remove Current Photo
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
};

const LanguageModal = ({
	visible,
	onClose,
	onLanguageChange,
	currentLanguage,
	processing,
}) => {
	const languages = [
		{ id: "en", label: "English" },
		{ id: "hi", label: "Hindi" },
	];

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50 justify-end">
				<View className="bg-white rounded-t-3xl p-6">
					<View className="flex-row justify-between items-center mb-6">
						<Text className="text-xl font-semibold">Select Language</Text>
						<TouchableOpacity onPress={onClose}>
							<Feather name="x" size={24} />
						</TouchableOpacity>
					</View>

					<View className="gap-4">
						{languages.map((lang) => (
							<TouchableOpacity
								key={lang.id}
								onPress={() => onLanguageChange(lang.label)}
								disabled={processing}
								className={`flex-row items-center justify-between p-4 ${
									currentLanguage === lang.label ? "bg-blue-50" : "bg-gray-50"
								} rounded-xl`}
							>
								<Text
									className={`font-medium ${
										currentLanguage === lang.label
											? "text-blue-500"
											: "text-gray-700"
									}`}
								>
									{lang.label}
								</Text>
								{currentLanguage === lang.label && (
									<Feather name="check" size={20} color="#3B82F6" />
								)}
							</TouchableOpacity>
						))}
					</View>
				</View>
			</View>
		</Modal>
	);
};

const DeleteAccountModal = ({
	visible,
	onClose,
	onConfirm,
	phoneNumber,
	processing,
}) => {
	const [confirmPhone, setConfirmPhone] = useState("");

	const handleDelete = () => {
		if (confirmPhone !== phoneNumber) {
			Alert.alert("Error", "Phone number doesn't match");
			return;
		}
		onConfirm();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50 justify-end">
				<View className="bg-white rounded-t-3xl p-6">
					<View className="flex-row justify-between items-center mb-6">
						<Text className="text-xl font-semibold text-red-500">
							Delete Account
						</Text>
						<TouchableOpacity onPress={onClose}>
							<Feather name="x" size={24} />
						</TouchableOpacity>
					</View>

					<View className="gap-4">
						<Text className="text-gray-600">
							This action cannot be undone. Enter your phone number to confirm:
						</Text>
						<TextInput
							className="bg-gray-100 p-4 rounded-xl"
							placeholder="Enter phone number"
							value={confirmPhone}
							onChangeText={setConfirmPhone}
							keyboardType="phone-pad"
						/>

						<TouchableOpacity
							onPress={handleDelete}
							disabled={processing}
							className={`bg-red-500 p-4 rounded-xl ${
								processing ? "opacity-50" : ""
							}`}
						>
							<Text className="text-white text-center font-semibold">
								{processing ? "Deleting..." : "Confirm Delete"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const Settings = ({ navigation }) => {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showLanguageModal, setShowLanguageModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showEditPhotoModal, setShowEditPhotoModal] = useState(false);
	const [currentLanguage, setCurrentLanguage] = useState("English");
	const [userProfile, setUserProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);

	// Fetch current user profile from Firestore on mount
	useEffect(() => {
		const user = auth.currentUser;
		if (!user) {
			navigation.reset({ index: 0, routes: [{ name: "Login" }] });
			return;
		}

		const uid = user.uid;
		const userRef = doc(db, "users", uid);
		let mounted = true;

		const fetchUser = async () => {
			try {
				const snap = await getDoc(userRef);
				if (snap.exists()) {
					const data = snap.data();
					if (!mounted) return;
					setUserProfile({
						firstName: data.firstName || "",
						lastName: data.lastName || "",
						email: data.email || user.email || "",
						phoneNumber: data.phoneNumber || user.phoneNumber || "",
						location:
							data.address?.city || data.location || data.address?.street || "",
						profilePicture: data.profilePicture || "",
						_raw: data,
					});
					setCurrentLanguage(
						data.preferences?.language === "hi" ? "Hindi" : "English"
					);
				} else {
					setUserProfile({
						firstName: user.displayName?.split(" ")[0] || "",
						lastName: user.displayName?.split(" ")[1] || "",
						email: user.email || "",
						phoneNumber: user.phoneNumber || "",
						location: "",
						profilePicture: "",
						_raw: {},
					});
				}
			} catch (err) {
				console.error("Error fetching profile:", err);
				Alert.alert("Error", "Unable to load profile. Try again later.");
			} finally {
				if (mounted) setLoading(false);
			}
		};

		fetchUser();
		return () => {
			mounted = false;
		};
	}, [navigation]);

	const handleEditPhoto = () => setShowEditPhotoModal(true);

	const handlePhotoUpdate = async (photoUrl) => {
		setProcessing(true);
		try {
			const user = auth.currentUser;
			if (!user) throw new Error("No authenticated user");

			const userRef = doc(db, "users", user.uid);
			await updateDoc(userRef, {
				profilePicture: photoUrl,
			});

			setUserProfile((prev) => ({
				...prev,
				profilePicture: photoUrl,
			}));

			Alert.alert("Success", "Profile photo updated successfully");
		} catch (err) {
			console.error("Error updating profile photo:", err);
			Alert.alert("Error", "Could not update profile photo. Please try again.");
		} finally {
			setProcessing(false);
			setShowEditPhotoModal(false);
		}
	};

	const handleEditProfile = () => setShowEditModal(true);

	// Called by EditProfileModal when user updates their details
	const handleProfileUpdate = async (updatedFields = {}) => {
		const user = auth.currentUser;
		if (!user) {
			Alert.alert("Error", "No authenticated user.");
			return;
		}

		setProcessing(true);
		try {
			const userRef = doc(db, "users", user.uid);

			// Build payload only with provided fields so we don't overwrite accidentally
			const payload = {};
			if (updatedFields.firstName !== undefined)
				payload.firstName = updatedFields.firstName;
			if (updatedFields.lastName !== undefined)
				payload.lastName = updatedFields.lastName;
			if (updatedFields.phoneNumber !== undefined)
				payload.phoneNumber = updatedFields.phoneNumber;
			if (updatedFields.location !== undefined)
				payload.location = updatedFields.location;

			if (Object.keys(payload).length > 0) {
				await updateDoc(userRef, payload);
			}

			// merge into UI state
			setUserProfile((prev) => ({ ...prev, ...payload }));
			Alert.alert("Success", "Profile updated.");
		} catch (err) {
			console.error("Error updating profile:", err);
			Alert.alert("Error", "Could not update profile. Try again.");
		} finally {
			setProcessing(false);
			setShowEditModal(false);
		}
	};

	const handleChangeLanguage = () => setShowLanguageModal(true);
	const handleLanguageChange = (newLang) => {
		setCurrentLanguage(newLang);
		setShowLanguageModal(false);
	};

	const handleSavedCourses = () => navigation.navigate("SavedCourses");
	const handleAboutKrishiGo = () => navigation.navigate("About");
	const handleTermsAndConditions = () => navigation.navigate("Terms");

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigation.reset({ index: 0, routes: [{ name: "Login" }] });
		} catch (err) {
			console.error("Error logging out:", err);
			Alert.alert("Error", "Logout failed. Please try again.");
		}
	};

	// Called when user confirms deletion in modal
	const handleConfirmDelete = async () => {
		const user = auth.currentUser;
		if (!user) {
			Alert.alert("Error", "No authenticated user.");
			setShowDeleteModal(false);
			return;
		}

		setProcessing(true);
		try {
			// Delete Firestore user document first (best practice)
			await deleteDoc(doc(db, "users", user.uid));

			// Attempt to delete the auth user
			await deleteUser(user);

			Alert.alert(
				"Account deleted",
				"Your account has been permanently removed."
			);
			navigation.reset({ index: 0, routes: [{ name: "Login" }] });
		} catch (err) {
			console.error("Delete account error:", err);

			// Common case: requires recent login
			if (err.code === "auth/requires-recent-login") {
				Alert.alert(
					"Authentication required",
					"For security reasons you must sign in again before deleting your account. Please log in and try again."
				);
				// Sign out and direct user to login so they can re-auth if they want
				try {
					await signOut(auth);
				} catch (sErr) {
					console.error("Error signing out after delete failure:", sErr);
				}
				navigation.reset({ index: 0, routes: [{ name: "Login" }] });
			} else {
				Alert.alert(
					"Error",
					"Could not delete account. Please contact support."
				);
			}
		} finally {
			setProcessing(false);
			setShowDeleteModal(false);
		}
	};

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-white items-center justify-center">
				<ActivityIndicator size="large" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView
				contentContainerStyle={{ paddingBottom: 40 }}
				className="flex-1"
				showsVerticalScrollIndicator={false}
			>
				<View className="px-6 py-8">
					<Text className="text-2xl font-bold text-gray-800">Settings</Text>
				</View>

				<View className="mx-6 mb-6">
					<TouchableOpacity
						onPress={handleEditPhoto}
						disabled={processing}
						className={`bg-white border border-gray-200 p-4 rounded-xl flex-row items-center ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="w-16 h-16 bg-gray-200 rounded-full mr-4 items-center justify-center overflow-hidden">
							{processing ? (
								<ActivityIndicator size="small" color="#9CA3AF" />
							) : userProfile?.profilePicture ? (
								<Image
									source={{ uri: userProfile.profilePicture }}
									className="w-full h-full"
									resizeMode="cover"
								/>
							) : (
								<Text className="text-lg text-gray-600">
									{(userProfile?.firstName || "U").charAt(0)}
								</Text>
							)}
						</View>
						<View>
							<Text className="text-lg font-semibold text-gray-800">
								{userProfile?.firstName} {userProfile?.lastName}
							</Text>
							<Text className="text-gray-500">{userProfile?.email}</Text>
							<Text className="text-blue-500 text-sm mt-1">
								Tap to change profile photo
							</Text>
						</View>
					</TouchableOpacity>
				</View>

				<View className="mx-6 gap-3">
					<TouchableOpacity
						onPress={handleEditProfile}
						disabled={processing}
						className={`bg-blue-50 p-4 rounded-xl flex-row items-center justify-between ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-blue-100/50 rounded-full items-center justify-center mr-3">
								{processing ? (
									<ActivityIndicator size="small" color="#3B82F6" />
								) : (
									<Feather name="user" size={20} color="#3B82F6" />
								)}
							</View>
							<Text className="text-blue-500 font-medium text-base">
								Edit Profile
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#3B82F6" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleChangeLanguage}
						disabled={processing}
						className={`bg-blue-50 p-4 rounded-xl flex-row items-center justify-between ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-blue-100/50 rounded-full items-center justify-center mr-3">
								{processing ? (
									<ActivityIndicator size="small" color="#3B82F6" />
								) : (
									<Ionicons name="language" size={20} color="#3B82F6" />
								)}
							</View>
							<Text className="text-blue-500 font-medium text-base">
								Language: {currentLanguage}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#3B82F6" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleSavedCourses}
						disabled={processing}
						className={`bg-green-50 p-4 rounded-xl flex-row items-center justify-between ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-green-100/50 rounded-full items-center justify-center mr-3">
								{processing ? (
									<ActivityIndicator size="small" color="#22C55E" />
								) : (
									<MaterialIcons name="save-alt" size={20} color="#22C55E" />
								)}
							</View>
							<Text className="text-green-500 font-medium text-base">
								Saved Courses
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#22C55E" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleAboutKrishiGo}
						disabled={processing}
						className={`bg-purple-50 p-4 rounded-xl flex-row items-center justify-between ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-purple-100/50 rounded-full items-center justify-center mr-3">
								{processing ? (
									<ActivityIndicator size="small" color="#9333EA" />
								) : (
									<Feather name="info" size={20} color="#9333EA" />
								)}
							</View>
							<Text className="text-purple-500 font-medium text-base">
								About KrishiGo
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#9333EA" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleTermsAndConditions}
						disabled={processing}
						className={`bg-indigo-50 p-4 rounded-xl flex-row items-center justify-between ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-indigo-100/50 rounded-full items-center justify-center mr-3">
								{processing ? (
									<ActivityIndicator size="small" color="#6366F1" />
								) : (
									<MaterialIcons name="privacy-tip" size={20} color="#6366F1" />
								)}
							</View>
							<Text className="text-indigo-500 font-medium text-base">
								Terms & Conditions
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#6366F1" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleLogout}
						disabled={processing}
						className={`bg-orange-50 p-4 rounded-xl flex-row items-center justify-between ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-orange-100/50 rounded-full items-center justify-center mr-3">
								{processing ? (
									<ActivityIndicator size="small" color="#F97316" />
								) : (
									<Feather name="log-out" size={20} color="#F97316" />
								)}
							</View>
							<Text className="text-orange-500 font-medium text-base">
								{processing ? "Logging out..." : "Logout"}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#F97316" />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => !processing && setShowDeleteModal(true)}
						disabled={processing}
						className={`bg-red-50 p-4 rounded-xl flex-row items-center justify-between ${
							processing ? "opacity-50" : ""
						}`}
						activeOpacity={0.8}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-red-100/50 rounded-full items-center justify-center mr-3">
								{processing ? (
									<ActivityIndicator size="small" color="#EF4444" />
								) : (
									<Feather name="trash-2" size={20} color="#EF4444" />
								)}
							</View>
							<Text className="text-red-500 font-medium text-base">
								{processing ? "Deleting..." : "Delete Account"}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#EF4444" />
					</TouchableOpacity>
				</View>
			</ScrollView>

			<EditProfileModal
				visible={showEditModal}
				onClose={() => !processing && setShowEditModal(false)}
				onUpdate={handleProfileUpdate}
				initialData={userProfile}
				processing={processing}
			/>

			<EditProfilePhotoModal
				visible={showEditPhotoModal}
				onClose={() => !processing && setShowEditPhotoModal(false)}
				onUpdate={handlePhotoUpdate}
				currentPhoto={userProfile?.profilePicture}
				processing={processing}
			/>

			<LanguageModal
				visible={showLanguageModal}
				onClose={() => !processing && setShowLanguageModal(false)}
				onLanguageChange={handleLanguageChange}
				currentLanguage={currentLanguage}
				processing={processing}
			/>

			<DeleteAccountModal
				visible={showDeleteModal}
				onClose={() => !processing && setShowDeleteModal(false)}
				phoneNumber={userProfile?.phoneNumber}
				onConfirm={handleConfirmDelete}
				processing={processing}
			/>
		</SafeAreaView>
	);
};

export default Settings;
