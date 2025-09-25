import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import RoundProgress from '../components/RoundProgress';
import ChangeLanguageModal from '../components/SettingsComponents/ChangeLanguageModal';
import EditProfilePhoto from '../components/SettingsComponents/EditProfilePhoto';
import { auth } from '../config/firebase';
import { DataContext } from '../hooks/DataContext';

const ProfileScreenCopy = () => {
    const navigation = useNavigation();
    const { userDetails } = useContext(DataContext);
    const viewShotRef = useRef();

    const [showProfileForCapture, setShowProfileForCapture] = useState(false);

    // User profile state

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

    const handleShareProfile = async () => {
        try {

            await setShowProfileForCapture(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second to ensure rendering
            console.log('Starting image capture...');

            // Check if ref exists
            if (!viewShotRef.current) {
                Alert.alert('Error', 'Unable to capture profile image');
                return;
            }

            // Request media library permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant media library permission to save and share images');
                return;
            }

            // Capture the view as image
            const uri = await viewShotRef.current.capture({
                format: 'png',
                quality: 0.9,
                result: 'tmpfile'
            });

            console.log('Image captured successfully:', uri);

            // Create a better filename with timestamp (optional; not required when using MediaLibrary URIs)
            // const timestamp = new Date().getTime();
            // const filename = `KrishiGo_Profile_${timestamp}.png`;

            // Save to device's Photos/Gallery to obtain a share-friendly URI (content:// on Android)
            const asset = MediaLibrary.createAssetAsync(uri);
            try {
                await MediaLibrary.createAlbumAsync('KrishiGo', asset, false);
            } catch (e) {
                // Album may already exist; ignore
                console.log('Album create skipped/failed:', e?.message);
            }

            console.log('Image saved to gallery successfully');

            // Prefer expo-sharing for direct file sharing (WhatsApp/Telegram/etc.)
            const shareUri = await asset?.uri || uri;
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(shareUri, {
                    mimeType: 'image/png',
                    UTI: 'public.png',
                    dialogTitle: 'Share my KrishiGo Profile',
                });
            } else {
                // Fallback to RN Share
                await Share.share({ url: shareUri, message: 'My KrishiGo Profile' });
            }
        } catch (error) {
            console.log('Share error:', error);
            Alert.alert('Error', `Unable to share profile: ${error.message}`);
        } finally {
            setShowProfileForCapture(false);
        }
    };


    // Debug function to test image capture only
    // const testImageCapture = async () => {
    //     try {
    //         console.log('Testing image capture...');

    //         if (!viewShotRef.current) {
    //             Alert.alert('Error', 'ViewShot ref is null');
    //             return;
    //         }

    //         // Simple capture with basic options
    //         const uri = await viewShotRef.current.capture({
    //             format: 'png',
    //             quality: 0.8
    //         });

    //         console.log('Test capture successful:', uri);

    //         // Test simple share without the captured image first
    //         try {
    //             await Share.share({
    //                 message: 'Test share from KrishiGo',
    //                 title: 'Test Share'
    //             });
    //             Alert.alert('Success', `Image captured and simple share worked! URI: ${uri.substring(0, 50)}...`);
    //         } catch (shareError) {
    //             Alert.alert('Share Error', `Image captured but share failed: ${shareError.message}`);
    //         }

    //     } catch (error) {
    //         console.log('Test capture error:', error);
    //         Alert.alert('Test Error', `Failed to capture: ${error.message}`);
    //     }
    // };

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const viewProfileForCapture = () => {
        return (
            <ViewShot
                ref={viewShotRef}
                options={{
                    fileName: 'KrishiGo-Profile',
                    format: 'png',
                    quality: 0.8,
                    result: 'tmpfile'
                }
                }
                style={{ backgroundColor: 'white' }
                }
            >
                <View className="p-4">
                    {/* App Branding */}
                    <View className="items-center mb-4">
                        <Text className="text-2xl font-bold text-primaryDark">KrishiGo</Text>
                        <Text className="text-gray-600 text-sm">Growing Together for Sustainable Future</Text>
                    </View>

                    {/* Hero Profile Card */}
                    <View className="bg-primary mx-4 mt-4 rounded-3xl p-6 shadow-lg relative">
                        <View className="flex-row items-center">
                            {/* Profile Avatar */}
                            <View>
                                <View className=" bg-green-50 rounded-full items-center justify-center mr-4 p-4">
                                    <Ionicons name="person" size={50} color="#314C1C" />
                                </View>
                            </View>

                            {/* User Info */}
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-white mb-1">
                                    {userProfile.firstName} {userProfile.lastName}
                                </Text>
                                <Text className="text-white font-semibold text-base mb-2">
                                    {userProfile.points.toLocaleString()} pts  <Text className="text-yellow-400 font-semibold text-base">
                                        {getRankIcon(userProfile.rank)}
                                    </Text>
                                </Text>

                                {/* Stats Row */}
                                <View className="flex-row">
                                    {/* Hours */}
                                    <View className="bg-green-50 px-3 py-1 rounded-lg mr-3">
                                        <Text className="text-primaryDark text-xs font-semibold">{userProfile.activeHours} hrs</Text>
                                        <Text className="text-primaryDark text-xs">Active hours</Text>
                                    </View>

                                    {/* Courses */}
                                    <View className="bg-green-50 px-3 py-1 rounded-lg">
                                        <Text className="text-primaryDark text-xs font-semibold">{userProfile.coursesCompleted} courses</Text>
                                        <Text className="text-primaryDark text-xs">Completed</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Streak Badge */}
                            <View className="absolute top-2 right-2">
                                <View className="bg-orange-500 px-3 py-2 rounded-full flex-row items-center">
                                    <Ionicons name="flame" size={16} color="white" />
                                    <Text className="text-white font-bold text-sm ml-1">
                                        {userProfile.streakDays}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Sustainability Score */}
                    <View className="flex-row p-4 bg-white border-dashed border border-primary mx-4 mt-6 rounded-2xl shadow-sm items-center">
                        <View className="mr-6 ml-2 flex-1/3 items-center justify-center">
                            {/* Simple Progress Circle */}
                            <RoundProgress
                                progress={userProfile.sustainabilityScore}
                                size={100}
                                duration={100}
                                showPercentage={true}
                                className="mb-2"
                            />
                        </View>
                        <View className="flex-2/3 justify-center">
                            <Text className="text-base text-[#333] mb-1">Sustainability Score</Text>
                            <Text className="text-[12px] font-bold text-black mb-1">Best : 70 - 100%</Text>
                            <Text className="text-sm font-medium text-primary mb-2">Growing Strong 🌱</Text>
                        </View>
                    </View>

                    {/* Badges Preview */}
                    <View className="bg-white mx-4 mt-6 rounded-2xl p-4 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <View>
                                <Text className="text-lg font-bold text-primaryDark">Achievement Badges</Text>
                                <Text className="text-gray-500 text-sm">{userBadges.length} badges earned</Text>
                            </View>
                            <View className="bg-primary/10 px-3 py-1 rounded-full">
                                <Text className="text-primary text-sm font-bold">🏆</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-center">
                            {userBadges.slice(0, 3).map((badge) => (
                                <View
                                    key={badge.id}
                                    className="bg-white rounded-full mr-2 border border-primary/20 items-center shadow-sm"
                                >
                                    <View className="bg-primary/10 p-2 rounded-full">
                                        <Image
                                            source={badge.image}
                                            className="w-12 h-12"
                                            resizeMode="contain"
                                        />
                                    </View>
                                </View>
                            ))}
                            {userBadges.length > 3 && (
                                <View className="bg-gray-100 rounded-full w-16 h-16 items-center justify-center">
                                    <Text className="text-gray-600 font-bold">+{userBadges.length - 3}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Leaderboard Position */}
                    <View className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-900 mb-3 text-center">
                            Leaderboard Position
                        </Text>

                        <View className="bg-gradient-to-r from-primary/20 to-primary/10 border-2 border-primary/30 py-4 px-4 rounded-2xl">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Text className="text-2xl mr-3">👨‍🌾</Text>
                                    <View>
                                        <Text className="font-bold text-primaryDark text-lg">You</Text>
                                        <Text className="text-gray-600 text-sm">Rank #{userProfile.rank}</Text>
                                    </View>
                                </View>
                                <Text className="text-green-600 font-bold text-lg">
                                    {userProfile.points.toLocaleString()} pts
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="items-center mt-6 mb-2">
                        <Text className="text-gray-600 text-sm">Join KrishiGo - Growing Together! 🌱</Text>
                    </View>
                </View>
            </ViewShot >

        )
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 pt-10" showsVerticalScrollIndicator={false}>

                {/* Regular Header (Not captured in image) */}
                <View className="flex-row justify-between items-center px-6 py-4 bg-white">
                    <Text className="text-2xl font-bold text-primaryDark">My Profile</Text>
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity disabled={showProfileForCapture} onPress={handleShareProfile}>
                            <Ionicons name="share-outline" size={24} color="#314C1C" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                            <Ionicons name="settings" size={24} color="#314C1C" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Interactive Content Below - Not captured in image */}

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
                                onPress={() => setShowPhotoModal(true)}
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

                {/* Achievement Badges Section - Interactive */}
                <View className="bg-white mx-4 mt-6 rounded-2xl p-6 shadow-sm">
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-lg font-bold text-primaryDark">All Achievement Badges</Text>
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


                {/* Leaderboard Section - Interactive */}
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

                {/* View Profile for Capture */}
                {showProfileForCapture && viewProfileForCapture()}
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

export default ProfileScreenCopy;
