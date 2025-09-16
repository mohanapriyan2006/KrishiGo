import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AIChatSpace from '../AIComponents/AIChatSpace';
import ChangeLanguageModal from './ChangeLanguageModal';
import DeleteAccModal from './DeleteAccModal';
import EditAccountModal from './EditAccountModal';

const Settings = ({ navigation }) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const [currentLanguage, setCurrentLanguage] = useState('English');
    const [userProfile, setUserProfile] = useState({
        firstName: 'Vijay',
        lastName: 'Kumar',
        email: 'tvk2026@gmail.com',
        phoneNumber: '+91 12345-67890',
        location: 'Koomapatti',
    });

    const userPhoneNumber = '1234567890';


    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleProfileUpdate = (updatedProfile) => {
        setUserProfile(updatedProfile);
        console.log('Profile updated:', updatedProfile);
        // Here you would typically save to storage/API
    };

    const handleChangeLanguage = () => {
        setShowLanguageModal(true);
    };

    const handleLanguageChange = (newLanguage) => {
        setCurrentLanguage(newLanguage);
        console.log('Language changed to:', newLanguage);
        // Here you would typically save the language preference to storage
        // and update the app's language context
    };

    const handleSavedCourses = () => {
        navigation?.navigate('SavedCourses');
    };

    const handleAboutKrishiGo = () => {
        navigation?.navigate('About');
    };

    const handleTermsAndConditions = () => {
        navigation?.navigate('TermsAndConditions');
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
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
                    <Text className="text-2xl font-bold text-gray-900">Settings</Text>
                </View>

                {/* Profile Information Card */}
                <View className="mx-6 my-6">
                    <View className="bg-lime-500/10 rounded-2xl p-6 relative">
                        {/* Edit Button */}
                        <TouchableOpacity
                            onPress={handleEditProfile}
                            className="absolute top-4 right-4 flex-row bg-lime-200 px-3 py-1 rounded-full"
                        >
                            <Ionicons name="pencil" size={16} color="#314C1C" />
                            <Text className="text-primaryDark text-sm font-medium">Edit</Text>
                        </TouchableOpacity>

                        {/* Profile Fields */}
                        <View className="gap-4">
                            {/* Name Row */}
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-gray-600 text-sm mb-1">First Name</Text>
                                    <View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
                                        <Text className="text-gray-900 font-medium text-base">Vijay</Text>
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-600 text-sm mb-1">Last Name</Text>
                                    <View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
                                        <Text className="text-gray-900 font-medium text-base">Kumar</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Email */}
                            <View>
                                <Text className="text-gray-600 text-sm mb-1">Email Address</Text>
                                <View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
                                    <Text className="text-gray-900 font-medium text-base">tvk2026@gmail.com</Text>
                                </View>
                            </View>

                            {/* Mobile Number */}
                            <View>
                                <Text className="text-gray-600 text-sm mb-1">Mobile Number</Text>
                                <View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
                                    <Text className="text-gray-900 font-medium text-base">+91 12345-67890</Text>
                                </View>
                            </View>

                            {/* Location */}
                            <View>
                                <Text className="text-gray-600 text-sm mb-1">Location</Text>
                                <View className="flex-row items-center bg-lime-200/50 px-3 py-2 rounded-lg">
                                    <Text className="text-gray-900 font-medium text-base">Koomapatti</Text>
                                </View>
                            </View>
                        </View>
                    </View>
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
                            <Text className="text-gray-900 font-medium text-base">Change language</Text>
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
                            <Text className="text-gray-900 font-medium text-base">Saved courses</Text>
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
                            <Text className="text-gray-900 font-medium text-base">About KrishiGo</Text>
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
                            <Text className="text-gray-900 font-medium text-base">Terms and conditions</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Delete Account */}
                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        className="bg-red-50 p-4 rounded-xl flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-red-100/50 rounded-full items-center justify-center mr-3">
                                <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                            </View>
                            <Text className="text-red-600 font-medium text-base">Delete Account</Text>
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
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
            />

            {/* Delete Account Modal */}
            <DeleteAccModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                userPhoneNumber={userPhoneNumber}
            />

            <AIChatSpace />
        </SafeAreaView>
    );
};

export default Settings;