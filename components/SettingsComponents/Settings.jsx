import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../../config/firebase";
import { DataContext } from "../../hooks/DataContext";
import useLanguage from "../../hooks/useLanguage";
import AIChatSpace from "../AIComponents/AIChatSpace";
import ChangeLanguageModal from "./ChangeLanguageModal";
import DeleteAccModal from "./DeleteAccModal";
import EditAccountModal from "./EditAccountModal";

const Settings = ({ navigation }) => {
	const { userDetails } = useContext(DataContext);
	const { t } = useTranslation();
	const { currentLanguage } = useLanguage();

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showLanguageModal, setShowLanguageModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	const [userProfile, setUserProfile] = useState({
		firstName: "Vijay",
		lastName: "Kumar",
		email: "tvk2026@gmail.com",
		phoneNumber: "+91 12345-67890",
		location: "Koomapatti",
	});

	useEffect(() => {
		if (userDetails) {
			setUserProfile({
				firstName: userDetails.firstName,
				lastName: userDetails.lastName,
				email: userDetails.email,
				phoneNumber: userDetails.phoneNumber,
				location: userDetails?.address?.city || 'Chennai',
			});
		}
	}, [userDetails]);

	// Get current language name for display
	const getCurrentLanguageName = () => {
		switch (currentLanguage) {
			case "en":
				return "English";
			case "hi":
				return "हिंदी";
			case "ta":
				return "தமிழ்";
			case "ml":
				return "മലയാളം";
			default:
				return "English";
		}
	};

	const handleEditProfile = () => {
		setShowEditModal(true);
	};

	const handleProfileUpdate = (updatedProfile) => {
		setUserProfile(updatedProfile);
		console.log("Profile updated:", updatedProfile);
	};

	const handleChangeLanguage = () => {
		setShowLanguageModal(true);
	};

	const handleSavedCourses = () => {
		navigation?.navigate("SavedCourses");
	};

	const handleAboutKrishiGo = () => {
		navigation?.navigate("About");
	};

	const handleTermsAndConditions = () => {
		navigation?.navigate("TermsAndConditions");
	};

	const handleDeleteAccount = () => {
		setShowDeleteModal(true);
	};

	const handleLogout = () => {
		Alert.alert(
			t('settings.logoutTitle', 'Logout'),
			t('settings.logoutConfirm', 'Are you sure you want to logout?'),
			[
				{ text: t('common.cancel'), style: 'cancel' },
				{
					text: t('settings.logout', 'Logout'),
					style: 'destructive',
					onPress: () => {
						auth.signOut();
						navigation.navigate('Login');
					}
				},
			]
		);
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View className="flex-row items-center justify-center px-4 py-3 mt-10 relative">
					<TouchableOpacity
						onPress={() => navigation?.goBack()}
						className="w-8 h-8 rounded-full bg-primary absolute left-5 items-center justify-center mr-4"
					>
						<Feather name="chevron-left" size={20} color="white" />
					</TouchableOpacity>
					<Text className="text-2xl font-bold text-gray-900">
						{t("settings.title")}
					</Text>
				</View>

				{/* Profile Information Card */}
				<View className="mx-6 my-6">
					<TouchableOpacity onPress={handleEditProfile}>
						<View className="bg-lime-500/10 rounded-2xl p-6 relative">
							{/* Edit Button */}
							<TouchableOpacity
								onPress={() => handleEditProfile()}
								className="absolute top-4 right-4 flex-row bg-lime-200 px-3 py-1 rounded-full"
							>
								<Ionicons name="pencil" size={16} color="#314C1C" />
								<Text className="text-primaryDark text-sm font-medium">
									{t("settings.edit")}
								</Text>
							</TouchableOpacity>

							{/* Profile Fields */}
							<View className="gap-4">
								{/* Name Row */}
								<View className="flex-row gap-4">
									<View className="flex-1">
										<Text className="text-gray-600 text-sm mb-1">
											{t("settings.firstName")}
										</Text>
										<View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
											<Text className="text-gray-900 font-medium text-base">
												{userProfile.firstName}
											</Text>
										</View>
									</View>
									<View className="flex-1">
										<Text className="text-gray-600 text-sm mb-1">
											{t("settings.lastName")}
										</Text>
										<View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
											<Text className="text-gray-900 font-medium text-base">
												{userProfile.lastName}
											</Text>
										</View>
									</View>
								</View>

								{/* Email */}
								<View>
									<Text className="text-gray-600 text-sm mb-1">
										{t("settings.email")}
									</Text>
									<View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
										<Text className="text-gray-900 font-medium text-base">
											{userProfile.email}
										</Text>
									</View>
								</View>

								{/* Mobile Number */}
								<View>
									<Text className="text-gray-600 text-sm mb-1">
										{t("settings.phone")}
									</Text>
									<View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
										<Text className="text-gray-900 font-medium text-base">
											{userProfile.phoneNumber}
										</Text>
									</View>
								</View>

								{/* Location */}
								<View>
									<Text className="text-gray-600 text-sm mb-1">
										{t("settings.location")}
									</Text>
									<View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
										<Text className="text-gray-900 font-medium text-base">
											{userProfile.location}
										</Text>
									</View>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>

				{/* Settings Options */}
				<View className="mx-6 gap-3">
					{/* Change Language */}
					<TouchableOpacity
						onPress={handleChangeLanguage}
						className="bg-lime-500/10 p-4 rounded-xl flex-row items-center justify-between"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-lime-200/50 rounded-full items-center justify-center mr-3">
								<Ionicons name="language" size={20} color="#314C1C" />
							</View>
							<View className="flex-1">
								<Text className="text-gray-900 font-medium text-base">
									{t("settings.changeLanguage")}
								</Text>
								<Text className="text-gray-600 text-sm mt-1">
									{getCurrentLanguageName()}
								</Text>
							</View>
						</View>
						<Feather name="chevron-right" size={20} color="#6B7280" />
					</TouchableOpacity>

					{/* Saved Courses */}
					<TouchableOpacity
						onPress={handleSavedCourses}
						className="bg-lime-500/10 p-4 rounded-xl flex-row items-center justify-between"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-lime-200/50 rounded-full items-center justify-center mr-3">
								<Feather name="bookmark" size={20} color="#314C1C" />
							</View>
							<Text className="text-gray-900 font-medium text-base">
								{t("settings.savedCourses")}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#6B7280" />
					</TouchableOpacity>

					{/* About KrishiGo */}
					<TouchableOpacity
						onPress={handleAboutKrishiGo}
						className="bg-lime-500/10 p-4 rounded-xl flex-row items-center justify-between"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-lime-200/50 rounded-full items-center justify-center mr-3">
								<Feather name="info" size={20} color="#314C1C" />
							</View>
							<Text className="text-gray-900 font-medium text-base">
								{t("settings.aboutKrishiGo")}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#6B7280" />
					</TouchableOpacity>

					{/* Terms and Conditions */}
					<TouchableOpacity
						onPress={handleTermsAndConditions}
						className="bg-lime-500/10 p-4 rounded-xl flex-row items-center justify-between"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-lime-200/50 rounded-full items-center justify-center mr-3">
								<Feather name="file-text" size={20} color="#314C1C" />
							</View>
							<Text className="text-gray-900 font-medium text-base">
								{t("settings.termsConditions")}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#6B7280" />
					</TouchableOpacity>

					{/* Logout */}
					<TouchableOpacity
						onPress={handleLogout}
						className="bg-red-50 p-4 rounded-xl flex-row items-center justify-between"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-red-100/50 rounded-full items-center justify-center mr-3">
								<MaterialIcons
									name="logout"
									size={20}
									color="#EF4444"
								/>
							</View>
							<Text className="text-red-600 font-medium text-base">
								{t("settings.logout")}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#EF4444" />
					</TouchableOpacity>

					{/* Delete Account */}
					<TouchableOpacity
						onPress={handleDeleteAccount}
						className="bg-red-100 p-4 rounded-xl flex-row items-center justify-between"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center">
							<View className="w-10 h-10 bg-red-100/50 rounded-full items-center justify-center mr-3">
								<MaterialIcons
									name="delete-outline"
									size={20}
									color="#EF4444"
								/>
							</View>
							<Text className="text-red-600 font-medium text-base">
								{t("settings.deleteAccount")}
							</Text>
						</View>
						<Feather name="chevron-right" size={20} color="#EF4444" />
					</TouchableOpacity>
				</View>

				{/* Spacer for bottom navigation */}
				<View className="h-20" />
			</ScrollView>

			{/* Edit Account Modal */}
			<EditAccountModal
				showEditModal={showEditModal}
				setShowEditModal={setShowEditModal}
				userProfile={userProfile}
				onProfileUpdate={handleProfileUpdate}
			/>

			{/* Change Language Modal */}
			<ChangeLanguageModal
				showLanguageModal={showLanguageModal}
				setShowLanguageModal={setShowLanguageModal}
			/>

			{/* Delete Account Modal */}
			<DeleteAccModal
				showDeleteModal={showDeleteModal}
				setShowDeleteModal={setShowDeleteModal}
				userEmail={userProfile.email}
			/>

			<AIChatSpace />
		</SafeAreaView>
	);
};

export default Settings;
