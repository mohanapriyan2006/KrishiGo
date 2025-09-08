import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const RewardsScreen = () => {
    const [totalPoints, setTotalPoints] = useState(8490);
    const [dailyRewards, setDailyRewards] = useState([
        { id: 1, name: 'Reward 1', points: 100, claimed: false },
        { id: 2, name: 'Reward 2', points: 100, claimed: false },
    ]);

    const leaderboardData = [
        { rank: 119, name: 'You', points: 11501, isCurrentUser: true },
        { rank: 1, name: 'Vimal', points: 85010, isCurrentUser: false },
        { rank: 2, name: 'Kamal', points: 85010, isCurrentUser: false },
        { rank: 3, name: 'Anand', points: 85010, isCurrentUser: false },
        { rank: 4, name: 'Ajith', points: 85010, isCurrentUser: false },
    ];

    const handleRedeemPoints = () => {
        Alert.alert(
            'Redeem Points',
            `You have ${totalPoints} points available for redemption.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Redeem', onPress: () => {
                        Alert.alert('Success', 'Points redeemed successfully!');
                    }
                },
            ]
        );
    };

    const handleReferFriends = async () => {
        try {
            await Share.share({
                message: 'Join KrishiGo and earn rewards! Use my referral code: krishigo.in/ref-3213',
                url: 'krishigo.in/ref-3213',
                title: 'Join KrishiGo',
            });
        } catch (_error) {
            Alert.alert('Error', 'Unable to share referral link');
        }
    };

    const handleClaimReward = (rewardId) => {
        setDailyRewards(prev =>
            prev.map(reward =>
                reward.id === rewardId
                    ? { ...reward, claimed: true }
                    : reward
            )
        );

        const claimedReward = dailyRewards.find(r => r.id === rewardId);
        setTotalPoints(prev => prev + claimedReward.points);

        Alert.alert(
            'Reward Claimed!',
            `You earned ${claimedReward.points} points!`,
            [{ text: 'OK' }]
        );
    };

    const copyReferralCode = () => {
        Alert.alert(
            'Referral Code Copied',
            'krishigo.in/ref-3213 has been copied to clipboard',
            [{ text: 'OK' }]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-4 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">Your Rewards</Text>
                </View>

                {/* Points Card */}
                <View className="bg-green-500 mx-6 mt-4 rounded-2xl p-6 shadow-lg">
                    <View className="flex-row items-center justify-between">
                        {/* Star Icon and Points */}
                        <View className="flex-row items-center flex-1">
                            <View className="w-12 h-12 bg-orange-400 rounded-full items-center justify-center mr-4">
                                <Ionicons name="star" size={24} color="white" />
                            </View>
                            <View>
                                <Text className="text-white text-2xl font-bold">
                                    {totalPoints.toLocaleString()} pts
                                </Text>
                                <Text className="text-white text-sm opacity-90">
                                    Total points earned
                                </Text>
                            </View>
                        </View>

                        {/* Redeem Button */}
                        <TouchableOpacity
                            className="bg-white px-4 py-2 rounded-full"
                            onPress={handleRedeemPoints}
                        >
                            <Text className="text-green-600 font-semibold text-sm">
                                Redeem Points
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Referral Section */}
                <View className="mx-6 mt-4">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-green-600 text-sm font-medium">
                                Refer your friends
                            </Text>
                            <Text className="text-green-600 text-sm">
                                Earn upto 899pts
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
                            onPress={copyReferralCode}
                        >
                            <Text className="text-gray-700 text-sm mr-2">
                                krishigo.in/ref-3213
                            </Text>
                            <Ionicons name="copy-outline" size={16} color="#374151" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Daily Rewards Section */}
                <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                        Daily Rewards
                    </Text>

                    <View className="bg-green-50 rounded-xl p-4">
                        {dailyRewards.map((reward) => (
                            <View key={reward.id} className="flex-row items-center justify-between mb-3 last:mb-0">
                                {/* Gift Icon and Reward Info */}
                                <View className="flex-row items-center flex-1">
                                    <View className="w-10 h-10 mr-3">
                                        <Text className="text-2xl">🎁</Text>
                                    </View>
                                    <View>
                                        <Text className="text-gray-900 font-medium">
                                            {reward.name}
                                        </Text>
                                        <Text className="text-gray-600 text-sm">
                                            {reward.points} points
                                        </Text>
                                    </View>
                                </View>

                                {/* Claim Button */}
                                <TouchableOpacity
                                    className={`px-4 py-2 rounded-full ${reward.claimed
                                            ? 'bg-gray-200'
                                            : 'bg-green-400'
                                        }`}
                                    onPress={() => handleClaimReward(reward.id)}
                                    disabled={reward.claimed}
                                >
                                    <Text className={`font-medium text-sm ${reward.claimed
                                            ? 'text-gray-500'
                                            : 'text-white'
                                        }`}>
                                        {reward.claimed ? 'Claimed' : 'Claim'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
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
                                className={`flex-row items-center justify-between py-3 px-4 rounded-xl ${user.isCurrentUser
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-gray-50'
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
                                        {user.name}
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

export default RewardsScreen;