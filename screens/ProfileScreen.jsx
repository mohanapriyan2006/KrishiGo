import { Ionicons } from '@expo/vector-icons';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
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
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-4 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">My Profile</Text>
                    <TouchableOpacity
                        className="bg-red-500 px-4 py-2 rounded-full"
                        onPress={handleLogout}
                    >
                        <Text className="text-white font-semibold text-sm">Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                    {/* Profile Picture and Basic Info */}
                    <View className="flex-row items-center mb-6">
                        {/* Profile Avatar */}
                        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mr-4">
                            <Ionicons name="person" size={40} color="#059669" />
                        </View>

                        {/* User Info */}
                        <View className="flex-1">
                            <Text className="text-xl font-bold text-gray-900 mb-1">
                                Vijay Kumar T
                            </Text>
                            <Text className="text-green-600 font-semibold text-base mb-2">
                                8,490 pts
                            </Text>

                            {/* Stats Row */}
                            <View className="flex-row">
                                {/* Hours */}
                                <View className="bg-green-100 px-3 py-1 rounded-full mr-3">
                                    <Text className="text-green-700 text-xs font-medium">20 hrs</Text>
                                    <Text className="text-green-600 text-xs">Active hours</Text>
                                </View>

                                {/* Courses */}
                                <View className="bg-green-100 px-3 py-1 rounded-full">
                                    <Text className="text-green-700 text-xs font-medium">15 courses</Text>
                                    <Text className="text-green-600 text-xs">Enrolled courses</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Personal Information Section */}
                    <View>
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            Personal Information
                        </Text>

                        {/* Info Items */}
                        <View className="space-y-3">
                            {/* Name */}
                            <TouchableOpacity
                                className="bg-gray-50 p-4 rounded-xl"
                                onPress={handleEditProfile}
                            >
                                <Text className="text-gray-900 font-medium">Vijay Kumar T</Text>
                            </TouchableOpacity>

                            {/* Email */}
                            <TouchableOpacity
                                className="bg-gray-50 p-4 rounded-xl"
                                onPress={handleEditProfile}
                            >
                                <Text className="text-gray-900 font-medium">vijaykumar.t@gmail.com</Text>
                            </TouchableOpacity>

                            {/* Phone */}
                            <TouchableOpacity
                                className="bg-gray-50 p-4 rounded-xl"
                                onPress={handleEditProfile}
                            >
                                <Text className="text-gray-900 font-medium">+91 12345-67890</Text>
                            </TouchableOpacity>

                            {/* Location */}
                            <TouchableOpacity
                                className="bg-gray-50 p-4 rounded-xl"
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
                        className="bg-gray-50 p-4 rounded-xl flex-row items-center"
                        onPress={handleSettings}
                    >
                        <Ionicons name="settings-outline" size={24} color="#374151" />
                        <Text className="text-gray-900 font-medium text-base ml-3">Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
                    </TouchableOpacity>
                </View>

                {/* AI Assistant Button */}
                <View className="absolute bottom-6 right-6">
                    <TouchableOpacity
                        className="w-14 h-14 bg-green-500 rounded-full items-center justify-center shadow-lg"
                        onPress={() => Alert.alert('AI Assistant', 'AI Assistant feature coming soon!')}
                    >
                        <Text className="text-white font-bold text-lg">AI</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing for Tab Bar */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;