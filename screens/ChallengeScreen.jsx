import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ChallengePopup from '../components/ChallengeComponents/ChallengePopup';
import ChallengeUpload from '../components/ChallengeComponents/ChallengeUpload';

const ChallengeScreen = () => {

    const navigation = useNavigation();

    const [challengeUploadVisible, setChallengeUploadVisible] = useState(false);

    // challenge pop-up state
    const [showPopup, setShowPopup] = useState(false);
    const [userPoints, setUserPoints] = useState(0);

    const handleActivityStart = (activity) => {
        console.log('Starting activity:', activity.title);

        // Simulate activity completion and point earning
        setTimeout(() => {
            const points = parseInt(activity.points.replace('pts', ''));
            setUserPoints(prev => prev + points);
            Alert.alert(
                'Activity Completed!',
                `You earned ${activity.points}! Total: ${userPoints + points} points`
            );
        }, 2000);
    };


    const handleStartChallenge = () => {
        setShowPopup(true);
    };


    const handleChallengeUpload = (data) => {
        console.log('Challenge Upload Data:', data);
        // Handle the uploaded challenge data (e.g., send it to the server)
        setChallengeUploadVisible(false);
        Alert.alert('Success', 'Challenge data submitted successfully!');
    };

    const handleEarnRewards = () => {
        setChallengeUploadVisible(true);
    };

    const rewardTasks = [
        {
            id: 1,
            task: 'Plant tree saplings',
            farmerPoints: 1120,
            helperPoints: 460,
            completedBy: null, // 'farmer' | 'helper'
            category: 'Afforestation',
            description: 'Either farmer or youngster can plant saplings. Farmer gets higher reward.'
        },
        {
            id: 2,
            task: 'Adopt drip irrigation',
            farmerPoints: 1180,
            helperPoints: 590,
            completedBy: null,
            category: 'Water Conservation',
            description: 'If farmer installs drip irrigation, more points. Helper gets fewer points for assisting or suggesting.'
        },
        {
            id: 3,
            task: 'Prepare organic compost',
            farmerPoints: 1140,
            helperPoints: 470,
            completedBy: null,
            category: 'Soil Health',
            description: 'Both farmer and helper can create compost, but farmer gets extra points.'
        },
        {
            id: 4,
            task: 'Practice crop rotation',
            farmerPoints: 1160,
            helperPoints: 480,
            completedBy: null,
            category: 'Sustainable Farming',
            description: 'Farmer gets more points for implementing crop rotation. Helper gets less for awareness work.'
        },
        {
            id: 5,
            task: 'Use bio-pesticides instead of chemicals',
            farmerPoints: 1150,
            helperPoints: 475,
            completedBy: null,
            category: 'Eco-Friendly Practices',
            description: 'Farmer applies bio-pesticides in field. Helper gets points if they promote it.'
        },
        {
            id: 6,
            task: 'Install solar-powered pump',
            farmerPoints: 2220,
            helperPoints: 1000,
            completedBy: null,
            category: 'Renewable Energy',
            description: 'Farmer earns more for installing pump. Helper earns less if just promoting/assisting.'
        }
    ];



    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-4 mt-10 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">Challenges</Text>
                </View>

                {/* Main Challenge Card */}
                <View className="bg-white mx-6 mt-8 rounded-2xl p-6 shadow-sm">
                    {/* Rubik's Cube Challenge */}
                    <View className="flex-row items-center mb-6">
                        {/* 3D Cube Illustration */}
                        <View className="mr-4 items-center justify-center flex-1/3">
                            <Image source={require('../assets/images/challenges.png')} style={{ width: 120, height: 120 }} />
                        </View>

                        {/* Challenge Info */}
                        <View className="flex-2/3">
                            <Text className="text-lg font-bold text-gray-900 mb-1">
                                Complete Challenge
                            </Text>
                            <Text className="text-gray-600 text-base mb-3">
                                Earn Rewards
                            </Text>

                            {/* Start Challenge Button */}
                            <TouchableOpacity
                                className={`px-6 py-3 rounded-lg bg-primary`}
                                onPress={handleStartChallenge}
                            >
                                <Text className="text-white font-semibold text-base text-center">
                                    Start Challenge
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Challenge Pop-up */}
                <ChallengePopup
                    visible={showPopup}
                    onClose={() => setShowPopup(false)}
                />

                {/* Earn Rewards Points Section */}
                <View className="bg-white mx-6 mt-8 rounded-2xl p-6 shadow-sm">
                    {(() => {
                        const totalPotential = rewardTasks.reduce((sum, t) => sum + (t.farmerPoints || 0), 0);
                        return (
                            <>
                                <Text className="text-2xl font-bold text-primaryDark mb-2">
                                    Earn Rewards Points <Text className="font-medium text-sm">upto {totalPotential}pts</Text>
                                </Text>
                                <Text className="text-gray-600 text-sm mb-4">
                                    Complete sustainable & smart farming tasks. Farmer actions grant higher points; helpers (youth) earn support points.
                                </Text>

                                {/* Legend */}
                                <View className="flex-row mb-4">
                                    <View className="flex-row items-center mr-4">
                                        <View className="w-3 h-3 rounded-full bg-lime-600 mr-2" />
                                        <Text className="text-xs text-gray-600">Farmer Points</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-3 h-3 rounded-full bg-lime-300 mr-2" />
                                        <Text className="text-xs text-gray-600">Helper Points</Text>
                                    </View>
                                </View>

                                {/* Reward Tasks List (Scrollable within section) */}
                                <View style={{ maxHeight: 320 }} className="mb-6">
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        horizontal
                                        contentContainerStyle={{ gap: 16, paddingBottom: 4 }}
                                    >
                                        {rewardTasks.map((item) => {
                                            const statusColor = item.completedBy ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300';
                                            const roleLabel = item.completedBy ? (item.completedBy === 'farmer' ? 'Farmer Done' : 'Helper Done') : 'Pending';
                                            return (
                                                <View key={item.id} className="border border-primary rounded-xl p-4 bg-white w-60">
                                                    <View className="flex-row justify-between items-start mb-2">
                                                        <View className="flex-1 pr-2">
                                                            <Text className="text-sm font-semibold text-gray-900" numberOfLines={2}>
                                                                {item.id}. {item.task}
                                                            </Text>
                                                            <Text className="text-[11px] text-primaryDark mt-1" numberOfLines={1}>
                                                                {item.category}
                                                            </Text>
                                                        </View>
                                                        <View className={`px-2 py-1 rounded-full border ${statusColor}`}>
                                                            <Text className="text-[10px] font-medium text-gray-700">
                                                                {roleLabel}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Text className="text-[11px] text-gray-600 mb-3" numberOfLines={3}>
                                                        {item.description}
                                                    </Text>
                                                    <View className="flex-row items-center">
                                                        <View className="flex-row items-center mr-4">
                                                            <View className="px-2 py-1 rounded-md bg-lime-600">
                                                                <Text className="text-[11px] text-white font-semibold">Farmer +{item.farmerPoints}</Text>
                                                            </View>
                                                        </View>
                                                        <View className="flex-row items-center">
                                                            <View className="px-2 py-1 rounded-md bg-lime-300">
                                                                <Text className="text-[11px] text-gray-800 font-semibold">Helper +{item.helperPoints}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </View>

                                {/* Earn Rewards Button */}
                                <TouchableOpacity
                                    className="bg-primary py-3 rounded-lg shadow-sm"
                                    onPress={handleEarnRewards}
                                >
                                    <Text className="text-white font-semibold text-center text-lg">
                                        Submit Proof / Claim
                                    </Text>
                                </TouchableOpacity>
                            </>
                        );
                    })()}
                </View>

                {/* Challenge Upload Section */}
                <ChallengeUpload
                    visible={challengeUploadVisible}
                    onClose={() => setChallengeUploadVisible(false)}
                    onSubmit={handleChallengeUpload}
                />

                {/* Bottom Spacing for Tab Bar */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChallengeScreen;