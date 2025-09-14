import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import EditProfilePhoto from '../components/EditProfilePhoto';
import ChangeLanguageModal from '../components/SettingsScreen/ChangeLanguageModal';

const ProfileScreen = () => {

    const navigation = useNavigation();

    // Dummy user data
    const userProfile = null;

    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(userProfile?.photo || null);


    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('English');

    const handleChangeLanguage = () => {
        setShowLanguageModal(true);
    };

    const handleLanguageChange = (newLanguage) => {
        setCurrentLanguage(newLanguage);
        console.log('Language changed to:', newLanguage);
        // Here you would typically save the language preference to storage
        // and update the app's language context
    };


    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout', style: 'destructive', onPress: () => {
                        navigation.navigate('Login');
                    }
                },
            ]
        );
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    const handleEditProfilePhoto = () => {
        setShowPhotoModal(true);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="flex-1 mt-10" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-4 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">My Profile</Text>
                </View>

                {/* Profile Card */}
                <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                    {/* Profile Picture and Basic Info */}
                    <View className="flex-row items-center mb-8">
                        {/* Profile Avatar */}
                        <View>
                            <View className=" bg-[#67b00019] rounded-full items-center justify-center mr-4 p-4">
                                <Ionicons name="person" size={50} color="#314C1C" />
                            </View>
                            <TouchableOpacity
                                className="absolute top-0 right-2 bg-primaryDark p-2 rounded-full border-2 border-white"
                                onPress={handleEditProfilePhoto}
                            >
                                <Ionicons name="pencil" size={12} color="white" />
                            </TouchableOpacity>
                        </View>


                        {/* User Info */}
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-900 mb-1">
                                Vijay Kumar T
                            </Text>
                            <Text className="text-primaryDark font-semibold text-base mb-2">
                                8,490 pts
                            </Text>

                            {/* Stats Row */}
                            <View className="flex-row">
                                {/* Hours */}
                                <View className="bg-[#67b00019] px-3 py-1 rounded-lg mr-3">
                                    <Text className="text-primaryDark text-xs font-semibold">20 hrs</Text>
                                    <Text className="text-primaryDark text-xs">Active hours</Text>
                                </View>

                                {/* Courses */}
                                <View className="bg-[#67b00019] px-3 py-1 rounded-lg">
                                    <Text className="text-primaryDark text-xs font-semibold">15 courses</Text>
                                    <Text className="text-primaryDark text-xs">Enrolled courses</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Personal Information Section */}
                    <View>
                        <View className="flex-row gap-2">
                            <Text className="text-lg font-bold text-gray-900 mb-4">
                                Personal Information
                            </Text>
                        </View>

                        {/* Info Items */}
                        <View className="flex-col gap-2">
                            {/* Name */}
                            <View
                                className="bg-[#67b00019] p-4 rounded-xl"
                            >
                                <Text className="text-gray-900 font-medium">Vijay Kumar T</Text>
                            </View>

                            {/* Email */}
                            <View
                                className="bg-[#67b00019] p-4 rounded-xl"
                            >
                                <Text className="text-gray-900 font-medium">vijaykumar.t@gmail.com</Text>
                            </View>

                            {/* Phone */}
                            <View
                                className="bg-[#67b00019] p-4 rounded-xl"
                            >
                                <Text className="text-gray-900 font-medium">+91 12345-67890</Text>
                            </View>

                            {/* Location */}
                            <View
                                className="bg-[#67b00019] p-4 rounded-xl"
                            >
                                <Text className="text-gray-900 font-medium">Coimbatore, Tamil Nadu</Text>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-200 my-6" />

                    {/* Change Language */}
                    <TouchableOpacity
                        className="bg-[#67b00019] p-4 mb-2 rounded-xl flex-row items-center"
                        onPress={handleChangeLanguage}
                    >
                        <Ionicons name="language-outline" size={24} color="#374151" />
                        <Text className="text-gray-900 font-medium text-base ml-3">Change Language</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
                    </TouchableOpacity>

                    {/* Settings */}
                    <TouchableOpacity
                        className="bg-[#67b00019] p-4 mb-2 rounded-xl flex-row items-center"
                        onPress={handleSettings}
                    >
                        <Ionicons name="settings-outline" size={24} color="#374151" />
                        <Text className="text-gray-900 font-medium text-base ml-3">Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity
                        className="bg-red-200 p-4 rounded-xl flex-row items-center"
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="red" />
                        <Text className="text-red-700 font-medium text-base ml-3">Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing for Tab Bar */}
                <View className="h-24" />
            </ScrollView>

            {/* Edit Profile Photo Modal */}
            <EditProfilePhoto
                showPhotoModal={showPhotoModal}
                setShowPhotoModal={setShowPhotoModal}
                currentPhoto={profilePhoto}
                onPhotoUpdate={setProfilePhoto}
            />

            {/* Change Language Modal */}
            <ChangeLanguageModal
                showLanguageModal={showLanguageModal}
                setShowLanguageModal={setShowLanguageModal}
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
            />
        </SafeAreaView>
    );
};

export default ProfileScreen;