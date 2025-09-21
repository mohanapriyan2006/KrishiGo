import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RoundProgress from '../components/RoundProgress';
import ChangeLanguageModal from '../components/SettingsComponents/ChangeLanguageModal';
import EditProfilePhoto from '../components/SettingsComponents/EditProfilePhoto';
import { auth } from '../config/firebase';
import { DataContext } from '../hooks/DataContext';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { userDetails } = useContext(DataContext);

    const [userProfile, setUserProfile] = useState({
        firstName: 'Vijay',
        lastName: 'Kumar',
        email: 'tvk2026@gmail.com',
        phoneNumber: '+91 12345-67890',
        location: 'Chennai',
        points: 8490,
        rank: 23,
        sustainabilityScore: 85,
        activeHours: 47,
        coursesCompleted: 15,
        challengesWon: 8,
        streakDays: 12,
    });

    // Leaderboard data
    const leaderboardData = [
        { rank: 23, name: 'You', points: 8490, avatar: '👨‍🌾', isCurrentUser: true },
        { rank: 1, name: 'Ravi Sharma', points: 12450, avatar: '🚜' },
        { rank: 2, name: 'Priya Patel', points: 11230, avatar: '🌾' },
        { rank: 3, name: 'Arjun Singh', points: 10890, avatar: '🌿' },
    ];

    // Earned badges data (only showing earned badges)
    const userBadges = [
        {
            id: 1,
            name: 'First Harvest',
            image: require('../assets/images/badges/first-harvest.png'),
            earnedDate: '2024-09-15',
            description: 'Completed first farming course'
        },
        {
            id: 2,
            name: 'Green Thumb',
            image: require('../assets/images/badges/green-thumb.png'),
            earnedDate: '2024-09-10',
            description: 'Achieved 80% sustainability score'
        },
        {
            id: 3,
            name: 'Early Bird',
            image: require('../assets/images/badges/early-bird.png'),
            earnedDate: '2024-09-08',
            description: 'Completed daily challenges for 7 days'
        },
        {
            id: 4,
            name: 'Harvest Helper',
            image: require('../assets/images/badges/harvest-helper.png'),
            earnedDate: '2024-09-05',
            description: 'Helped 5 fellow farmers'
        },
        {
            id: 5,
            name: 'Seedling',
            image: require('../assets/images/badges/seedling.png'),
            earnedDate: '2024-09-01',
            description: 'Joined KrishiGo community'
        }
    ];

    const handleEditProfilePhoto = () => {
        setShowPhotoModal(true);
    };

    useEffect(() => {
        if (userDetails) {
            setUserProfile(prev => ({
                ...prev,
                firstName: userDetails.firstName || 'Vijay',
                lastName: userDetails.lastName || 'Kumar',
                email: userDetails.email || 'tvk2026@gmail.com',
                phoneNumber: userDetails.phoneNumber || '+91 12345-67890',
                location: userDetails.city || 'Chennai',
            }));
        }
    }, [userDetails]);

    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('English');

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout', style: 'destructive', onPress: () => {
                        auth.signOut();
                        navigation.navigate('Login');
                    }
                },
            ]
        );
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getSustainabilityLevel = (score) => {
        if (score >= 90) return { level: 'Eco Master', emoji: '🌍', color: 'text-green-700' };
        if (score >= 80) return { level: 'Sustainability Pro', emoji: '🌱', color: 'text-green-600' };
        if (score >= 70) return { level: 'Green Enthusiast', emoji: '🍃', color: 'text-green-500' };
        if (score >= 60) return { level: 'Earth Friendly', emoji: '🌿', color: 'text-yellow-600' };
        return { level: 'Getting Started', emoji: '🌱', color: 'text-orange-500' };
    };

    const sustainabilityInfo = getSustainabilityLevel(userProfile.sustainabilityScore);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 pt-10" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row justify-between items-center px-6 py-4 bg-white">
                    <Text className="text-2xl font-bold text-primaryDark">My Profile</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Ionicons name="settings" size={24} color="#314C1C" />
                    </TouchableOpacity>
                </View>

                {/* Hero Profile Card */}
                <View className="bg-primary mx-4 mt-4 rounded-3xl p-6 shadow-lg relative">
                    <View className="flex-row items-center">
                        {/* Profile Avatar */}
                        <View>
                            <View className=" bg-green-50 rounded-full items-center justify-center mr-4 p-4">
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
                            <Text className="text-xl font-bold text-white mb-1">
                                {userProfile.firstName} {userProfile.lastName}
                            </Text>
                            <Text className="text-white font-semibold text-base mb-2">
                                8,490 pts  <Text className="text-yellow-400 font-semibold text-base">
                                    {getRankIcon(userProfile.rank)}
                                </Text>
                            </Text>

                            {/* Stats Row */}
                            <View className="flex-row">
                                {/* Hours */}
                                <View className="bg-green-50 px-3 py-1 rounded-lg mr-3">
                                    <Text className="text-primaryDark text-xs font-semibold">20 hrs</Text>
                                    <Text className="text-primaryDark text-xs">Active hours</Text>
                                </View>

                                {/* Courses */}
                                <View className="bg-green-50 px-3 py-1 rounded-lg">
                                    <Text className="text-primaryDark text-xs font-semibold">15 courses</Text>
                                    <Text className="text-primaryDark text-xs">Enrolled courses</Text>
                                </View>
                            </View>
                        </View>

                        {/* Streak fire flame */}
                        <View className="flex-row absolute top-0 right-0 items-center bg-green-50 px-3 py-1 rounded-full ml-3">
                            <Ionicons name="flame" size={16} color="#FF4500" />
                            <Text className="text-black font-semibold text-base ml-1">
                                {userProfile.streakDays} days
                            </Text>
                        </View>
                    </View>

                </View>

                {/* Sustainability Score */}
                <View className="flex-row p-4 bg-white border-dashed border border-primary mx-6 mt-6 rounded-2xl shadow-sm items-center">
                    <View className="mr-10 ml-5 flex-1/3 items-center justify-center">
                        <RoundProgress
                            progress={80}
                            size={100}
                            showPercentage={true}
                            className="mb-2"
                        />
                    </View>
                    <View className="flex-2/3 justify-center">
                        <Text className="text-base  text-[#333] mb-1">Sustainability Score</Text>
                        <Text className="text-[14px] font-bold text-black mb-1">Best : 70 - 100%</Text>
                        <Text className="text-sm font-medium text-primary mb-2">Growing Strong 🌱</Text>
                    </View>
                </View>

                {/* Achievement Badges Section */}
                <View className="bg-white mx-4 mt-6 rounded-2xl p-6 shadow-sm">
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-lg font-bold text-primaryDark">Achievement Badges</Text>
                            <Text className="text-gray-500 text-sm">{userBadges.length} badges earned</Text>
                        </View>
                        <View className="bg-primary/10 px-3 py-1 rounded-full">
                            <Text className="text-primary text-sm font-bold">🏆</Text>
                        </View>
                    </View>

                    {userBadges.length > 0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-2"
                        >
                            {userBadges.map((badge) => (
                                <TouchableOpacity
                                    key={badge.id}
                                    className="bg-white rounded-full mr-3 my-2 border-dashed border border-primary items-center shadow-lg"
                                    activeOpacity={0.8}
                                >
                                    <View className="bg-primary/10 p-2 rounded-full">
                                        <Image
                                            source={badge.image}
                                            className="w-[100px] h-[100px]"
                                            resizeMode="contain"
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View className="items-center py-8">
                            <Text className="text-gray-500 text-center">
                                Start earning badges by completing courses and challenges!
                            </Text>
                        </View>
                    )}
                </View>


                {/* Leaderboard Section */}
                <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                        Leaderboard
                    </Text>

                    <View className="space-y-3">
                        {leaderboardData.map((user, index) => (
                            <View
                                key={`${user.rank}-${user.name}`}
                                className={`flex-row items-center justify-between py-3 px-4 rounded-xl  ${user.isCurrentUser
                                    ? 'bg-green-50 border mb-2 border-primary'
                                    : 'bg-[#67b00019] mb-1'
                                    }`}
                            >
                                {/* Rank */}
                                <View className="w-12">
                                    <Text className={`font-bold ${user.isCurrentUser ? 'text-green-600' : 'text-gray-700'
                                        }`}>
                                        #{user.rank}
                                    </Text>
                                </View>

                                {/* Name */}
                                <View className="flex-1 mx-4">
                                    <Text className={`font-medium ${user.isCurrentUser ? 'text-green-700' : 'text-gray-900'
                                        }`}>
                                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : ''} {user.name}
                                    </Text>
                                </View>

                                {/* Points */}
                                <View>
                                    <Text className={`font-semibold ${user.isCurrentUser ? 'text-green-600' : 'text-gray-700'
                                        }`}>
                                        {user.points.toLocaleString()} pts
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>


                {/* Divider */}
                <View className="items-center my-8">
                    <View className="w-80 h-0.5 bg-gray-300"></View>
                </View>

                {/* Action Buttons */}
                <View className="mx-8 mb-20">
                    {/* Changle language */}
                    <TouchableOpacity
                        className="bg-[#67b00019] p-4 mb-2 rounded-xl flex-row items-center"
                        onPress={() => setShowLanguageModal(true)}
                    >
                        <Ionicons name="language-outline" size={24} color="#374151" />
                        <Text className="text-gray-900 font-medium text-base ml-3">Change Language</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
                    </TouchableOpacity>

                    {/* Settings */}
                    <TouchableOpacity
                        className="bg-[#67b00019] p-4 mb-2 rounded-xl flex-row items-center"
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color="#374151" />
                        <Text className="text-gray-900 font-medium text-base ml-3">Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-auto" />
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity
                        className="bg-red-100 p-4 rounded-xl flex-row items-center"
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                        <Text className="text-red-600 font-medium text-base ml-3">Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing */}
                <View className="h-24" />
            </ScrollView>

            {/* Modals */}
            <EditProfilePhoto
                showPhotoModal={showPhotoModal}
                setShowPhotoModal={setShowPhotoModal}
                currentPhoto={null}
                onPhotoUpdate={() => { }}
            />

            <ChangeLanguageModal
                showLanguageModal={showLanguageModal}
                setShowLanguageModal={setShowLanguageModal}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
            />
        </SafeAreaView >
    );
};

export default ProfileScreen;
