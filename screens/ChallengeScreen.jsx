import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
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
                <View className="px-6 py-4 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">Challenges</Text>
                </View>

                {/* Main Challenge Card */}
                <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                    {/* Rubik's Cube Challenge */}
                    <View className="flex-row items-center mb-6">
                        {/* 3D Cube Illustration */}
                        <View className="w-20 h-20 mr-4 items-center justify-center">
                            {/* Creating a simple 3D cube effect */}
                            <View className="relative">
                                {/* Main cube face */}
                                <View className="w-16 h-16 bg-blue-400 rounded-lg absolute" />
                                {/* Top face */}
                                <View
                                    className="w-16 h-4 bg-blue-300 rounded-t-lg absolute -top-2 left-2"
                                    style={{ transform: [{ perspective: 100 }, { rotateX: '45deg' }] }}
                                />
                                {/* Right face */}
                                <View
                                    className="w-4 h-16 bg-blue-500 rounded-r-lg absolute top-0 -right-2"
                                    style={{ transform: [{ perspective: 100 }, { rotateY: '45deg' }] }}
                                />
                                {/* Colored segments */}
                                <View className="absolute top-1 left-1 w-2 h-2 bg-red-400 rounded-sm" />
                                <View className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-sm" />
                                <View className="absolute bottom-1 left-1 w-2 h-2 bg-green-400 rounded-sm" />
                                <View className="absolute bottom-1 right-1 w-2 h-2 bg-orange-400 rounded-sm" />
                                <View className="absolute top-6 left-6 w-2 h-2 bg-purple-400 rounded-sm" />
                            </View>
                        </View>

                        {/* Challenge Info */}
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900 mb-1">
                                Complete Challenge
                            </Text>
                            <Text className="text-gray-600 text-sm mb-3">
                                Earn Rewards
                            </Text>

                            {/* Start Challenge Button */}
                            <TouchableOpacity
                                className={`px-6 py-2 rounded-full ${challengeStarted ? 'bg-gray-400' : 'bg-green-500'
                                    }`}
                                onPress={handleStartChallenge}
                                disabled={challengeStarted}
                            >
                                <Text className="text-white font-semibold text-sm text-center">
                                    {challengeStarted ? 'Challenge Active' : 'Start Challenge'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Earn Rewards Points Section */}
                <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                        Earn Rewards Points
                    </Text>

                    <Text className="text-gray-600 text-sm mb-4">
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
                                <View className="flex-row items-center">
                                    <Text className="text-green-600 text-sm font-medium mr-2">
                                        {item.points}pts
                                    </Text>
                                    <Ionicons
                                        name={item.completed ? "checkmark-circle" : "chevron-forward"}
                                        size={16}
                                        color={item.completed ? "#10B981" : "#9CA3AF"}
                                    />
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
                        className="bg-green-500 py-3 rounded-full shadow-sm"
                        onPress={handleEarnRewards}
                    >
                        <Text className="text-white font-semibold text-center text-base">
                            Earn Rewards
                        </Text>
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

export default ChallengeScreen;