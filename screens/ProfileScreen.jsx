import { Ionicons } from '@expo/vector-icons';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const ProfileScreen = () => {
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout', style: 'destructive', onPress: () => {
                        // Handle logout logic here
                        Alert.alert('Logged out', 'You have been logged out successfully');
                    }
                },
            ]
        );
    };

    const handleSettings = () => {
        Alert.alert('Settings', 'Settings page will be implemented here');
    };

    const handleEditProfile = () => {
        Alert.alert('Edit Profile', 'Edit profile functionality will be implemented here');
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
                        <View className=" bg-[#67b00019] rounded-full items-center justify-center mr-4 p-4">
                            <Ionicons name="person" size={50} color="#314C1C" />
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
                            <Ionicons name="pencil" size={20} color="#314C1C" />
                        </View>

                        {/* Info Items */}
                        <View className="flex-col gap-2">
                            {/* Name */}
                            <TouchableOpacity
                                className="bg-[#67b00019] p-4 rounded-xl"
                                onPress={handleEditProfile}
                            >
                                <Text className="text-gray-900 font-medium">Vijay Kumar T</Text>
                            </TouchableOpacity>

                            {/* Email */}
                            <TouchableOpacity
                                className="bg-[#67b00019] p-4 rounded-xl"
                                onPress={handleEditProfile}
                            >
                                <Text className="text-gray-900 font-medium">vijaykumar.t@gmail.com</Text>
                            </TouchableOpacity>

                            {/* Phone */}
                            <TouchableOpacity
                                className="bg-[#67b00019] p-4 rounded-xl"
                                onPress={handleEditProfile}
                            >
                                <Text className="text-gray-900 font-medium">+91 12345-67890</Text>
                            </TouchableOpacity>

                            {/* Location */}
                            <TouchableOpacity
                                className="bg-[#67b00019] p-4 rounded-xl"
                                onPress={handleEditProfile}
                            >
                                <Text className="text-gray-900 font-medium">Coimbatore, Tamil Nadu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="h-px bg-gray-200 my-6" />

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
        </SafeAreaView>
    );
};

export default ProfileScreen;