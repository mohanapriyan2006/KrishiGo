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
import ChallengePopup from '../components/ChallengePopup';
import ChallengeUpload from '../components/ChallengeUpload';

const ChallengeScreen = () => {

    const navigation = useNavigation();

    const [challengeStarted, setChallengeStarted] = useState(false);
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
        
        setChallengeStarted(true);
        Alert.alert(
            'Challenge',
            'Are you sure you want to start the challenge?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Start', style: 'destructive', onPress: () => {
                        setShowPopup(true);
                    }
                },
            ]
        );
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
        { id: 1, task: 'Plant a sampling', points: 100, completed: false },
        { id: 2, task: 'Take a photo', points: 50, completed: false },
        { id: 3, task: 'Upload content', points: 200, completed: false },
        { id: 4, task: 'Earn upto 7000pts', points: 7000, completed: false },
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
                                className={`px-6 py-3 rounded-lg ${challengeStarted ? 'bg-gray-400' : 'bg-primary'
                                    }`}
                                onPress={handleStartChallenge}
                            // disabled={challengeStarted}
                            >
                                <Text className="text-white font-semibold text-base text-center">
                                    {challengeStarted ? 'Challenge Active' : 'Start Challenge'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Challenge Pop-up */}
                <ChallengePopup
                    visible={showPopup}
                    onClose={() => setShowPopup(false)}
                    onActivityStart={handleActivityStart}
                />

                {/* Earn Rewards Points Section */}
                <View className="bg-white mx-6 mt-8 rounded-2xl p-6 shadow-sm">
                    <Text className="text-2xl font-bold text-primaryDark mb-4">
                        Earn Rewards Points
                    </Text>

                    <Text className="text-gray-600 text-lg mb-4">
                        Ways to earn rewards :
                    </Text>

                    {/* Reward Tasks List */}
                    <View className="space-y-3 mb-6">
                        {rewardTasks.map((item, index) => (
                            <View
                                key={item.id}
                                className="flex-row items-center justify-between py-2"
                            >
                                <View className="flex-row items-center flex-1">
                                    <Text className="text-gray-700 text-sm mr-2">
                                        {item.id}.
                                    </Text>
                                    <Text className="text-gray-700 text-sm flex-1">
                                        {item.task}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Earn Rewards Button */}
                    <TouchableOpacity
                        className="bg-primary py-3 rounded-lg shadow-sm"
                        onPress={handleEarnRewards}
                    >
                        <Text className="text-white font-semibold text-center text-lg">
                            Earn Rewards
                        </Text>
                    </TouchableOpacity>
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