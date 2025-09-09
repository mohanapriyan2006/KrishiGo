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

const ChallengeScreen = () => {
    const [challengeStarted, setChallengeStarted] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);

    const handleStartChallenge = () => {
        setChallengeStarted(true);
        Alert.alert(
            'Challenge Started!',
            'Complete the challenge to earn rewards',
            [{ text: 'OK' }]
        );
    };

    const handleCompleteTask = (taskIndex, points) => {
        Alert.alert(
            'Task Completed!',
            `You earned ${points} points!`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setEarnedPoints(prev => prev + points);
                    }
                }
            ]
        );
    };

    const handleEarnRewards = () => {
        Alert.alert(
            'Earn Rewards',
            'Complete more tasks to earn additional rewards!',
            [{ text: 'OK' }]
        );
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
                                disabled={challengeStarted}
                            >
                                <Text className="text-white font-semibold text-base text-center">
                                    {challengeStarted ? 'Challenge Active' : 'Start Challenge'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

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
                            <TouchableOpacity
                                key={item.id}
                                className="flex-row items-center justify-between py-2"
                                onPress={() => handleCompleteTask(index, item.points)}
                            >
                                <View className="flex-row items-center flex-1">
                                    <Text className="text-gray-700 text-sm mr-2">
                                        {item.id}.
                                    </Text>
                                    <Text className="text-gray-700 text-sm flex-1">
                                        {item.task}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Total Points Display */}
                    {earnedPoints > 0 && (
                        <View className="bg-green-50 p-3 rounded-xl mb-4">
                            <Text className="text-green-700 font-semibold text-center">
                                Total Earned: {earnedPoints} points
                            </Text>
                        </View>
                    )}

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

                {/* Bottom Spacing for Tab Bar */}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChallengeScreen;