import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import RewardPopUp from '../components/RewardPopUp';
import RedeemScreen from '../components/RedeemComponents/RedeemScreen';

const RewardsScreen = () => {
    const [totalPoints, setTotalPoints] = useState(8490);
    const [redeemScreenVisible, setRedeemScreenVisible] = useState(false);

    const [rewardPopUpVisible, setRewardPopUpVisible] = useState(false);
    const [rewardPoints, setRewardPoints] = useState(0);

    const [dailyRewards, setDailyRewards] = useState([
        { id: 1, name: 'Reward 1', points: 50, claimed: false },
        { id: 2, name: 'Reward 2', points: 120, claimed: false },
    ]);

    const leaderboardData = [
        { rank: 119, name: 'You', points: 11501, isCurrentUser: true },
        { rank: 1, name: 'Vimal', points: 85010, isCurrentUser: false },
        { rank: 2, name: 'Kamal', points: 85010, isCurrentUser: false },
        { rank: 3, name: 'Anand', points: 85010, isCurrentUser: false },
        { rank: 4, name: 'Ajith', points: 85010, isCurrentUser: false },
    ];

    const handleRedeemPoints = () => {
        setRedeemScreenVisible(true);
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

        setRewardPoints(claimedReward.points);
        setRewardPopUpVisible(true);
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
            <ScrollView className="flex-1 mt-10" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-4 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">Your Rewards</Text>
                </View>

                {/* Points Card */}
                <View className="bg-primary mx-6 mt-4 p-6 flex items-center rounded-2xl shadow-2xl">
                    <View className="flex-row items-center gap-10 justify-between">
                        {/* Star Icon and Points */}
                        <View className="items-center justify-center flex-1/3 bg-yellow-100/80 p-2.5 rounded-full">
                            <Image source={require('../assets/images/Coin.png')}
                                style={{ height: 60, width: 60 }} />
                        </View>
                        <View className="flex-col flex-2/3">
                            <View>
                                <Text className="text-white text-2xl font-bold">
                                    {totalPoints.toLocaleString()} pts
                                </Text>
                                <Text className="text-white tracking-wider text-sm opacity-90">
                                    Total points earned
                                </Text>
                            </View>
                            {/* Redeem Button */}
                            <TouchableOpacity
                                className="bg-white mt-2 px-4 py-2 rounded-lg"
                                onPress={handleRedeemPoints}
                            >
                                <Text className="text-primaryDark tracking-wider font-semibold text-sm">
                                    Redeem Points
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

                {/* Referral Section */}
                <View className="mx-10 mt-4">
                    <View className="flex-row gap-2 items-center justify-between">
                        <View>
                            <Text className="text-primaryDark text-sm font-medium">
                                Refer your friends
                            </Text>
                            <Text className="text-primaryDark text-sm">
                                Earn upto 899pts
                            </Text>
                        </View>
                        <View className="flex-row gap-1">
                            <TouchableOpacity
                                className="flex-row items-center bg-[#67b00019] px-3 py-2 rounded-lg"
                                onPress={copyReferralCode}
                            >
                                <Text className="text-primaryDark text-sm mr-2">
                                    krishigo.in/ref-3213
                                </Text>
                                <Ionicons name="copy-outline" size={16} color="#314C1C" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-primary p-1 pt-2 rounded-lg"
                                onPress={handleReferFriends}
                            >
                                <Ionicons name="share-outline" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Daily Rewards Section */}
                <View className="bg-white mx-6 mt-6 rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                        Daily Rewards
                    </Text>

                    <View className="bg-[#67b00019] rounded-xl p-4">
                        {dailyRewards.map((reward) => (
                            <View key={reward.id} className="flex-row items-center justify-between border-b border-gray-200 py-3">
                                {/* Gift Icon and Reward Info */}
                                <View className="flex-row items-center flex-1">
                                    <Image source={require('../assets/images/gift.png')}
                                        style={{ width: 40, height: 40, marginRight: 12 }} />
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
                                    className={`px-4 py-2 rounded-xl ${reward.claimed
                                        ? 'bg-gray-200'
                                        : 'bg-[#85e30257]'
                                        }`}
                                    onPress={() => handleClaimReward(reward.id)}
                                    disabled={reward.claimed}
                                >
                                    <Text className={`font-medium text-sm ${reward.claimed
                                        ? 'text-gray-500'
                                        : 'text-primaryDark'
                                        }`}>
                                        {reward.claimed ? 'Claimed' : 'Claim'}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        ))}
                    </View>
                </View>

                {/* Reward Pop-Up */}
                <RewardPopUp visible={rewardPopUpVisible} onClose={() => setRewardPopUpVisible(false)} points={rewardPoints} />

                {/* Redeem Screen */}
                <RedeemScreen 
                    visible={redeemScreenVisible} 
                    onClose={() => setRedeemScreenVisible(false)} 
                    totalPoints={totalPoints} 
                />

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
                        className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
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