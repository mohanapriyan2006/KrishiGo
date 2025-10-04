import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { DataContext } from '../hooks/DataContext';

const ChallengeScreen = () => {

    // eslint-disable-next-line no-unused-vars
    const navigation = useNavigation();

    const { rewardTasks } = useContext(DataContext);
    const { t } = useTranslation();

    const [challengeUploadVisible, setChallengeUploadVisible] = useState(false);

    // challenge pop-up state
    const [showPopup, setShowPopup] = useState(false);
    const [userPoints, setUserPoints] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const handleActivityStart = (activity) => {
        console.log('Starting activity:', activity.title);

        // Simulate activity completion and point earning
        setTimeout(() => {
            const points = parseInt(activity.points.replace('pts', ''));
            setUserPoints(prev => prev + points);
            Alert.alert(
                t('challenge.activityCompletedTitle'),
                t('challenge.activityCompletedMsg', { earned: activity.points, total: userPoints + points })
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
        Alert.alert(t('common.success'), t('challenge.submitSuccess'));
    };

    const handleEarnRewards = () => {
        setChallengeUploadVisible(true);
    };




    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 py-4 mt-10 bg-white">
                    <Text className="text-2xl font-bold text-gray-900">{t('challenge.title')}</Text>
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
                                {t('challenge.completeChallenge')}
                            </Text>
                            <Text className="text-gray-600 text-base mb-3">
                                {t('challenge.earnRewards')}
                            </Text>

                            {/* Start Challenge Button */}
                            <TouchableOpacity
                                className={`px-6 py-3 rounded-lg bg-primary`}
                                onPress={handleStartChallenge}
                            >
                                <Text className="text-white font-semibold text-base text-center">
                                    {t('challenge.startChallenge')}
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
                                    {t('challenge.earnRewardsPoints')} <Text className="font-medium text-sm">{t('challenge.uptoPoints', { points: totalPotential })}</Text>
                                </Text>
                                <Text className="text-gray-600 text-sm mb-4">
                                    {t('challenge.desc')}
                                </Text>

                                {/* Legend */}
                                <View className="flex-row mb-4">
                                    <View className="flex-row items-center mr-4">
                                        <View className="w-3 h-3 rounded-full bg-lime-600 mr-2" />
                                        <Text className="text-xs text-gray-600">{t('challenge.farmerPoints')}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-3 h-3 rounded-full bg-lime-300 mr-2" />
                                        <Text className="text-xs text-gray-600">{t('challenge.helperPoints')}</Text>
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
                                            const roleLabel = item.completedBy ? (item.completedBy === 'farmer' ? t('challenge.farmerDone') : t('challenge.helperDone')) : t('challenge.pending');
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
                                                                <Text className="text-[11px] text-white font-semibold">{t('challenge.farmerPlus', { points: item.farmerPoints })}</Text>
                                                            </View>
                                                        </View>
                                                        <View className="flex-row items-center">
                                                            <View className="px-2 py-1 rounded-md bg-lime-300">
                                                                <Text className="text-[11px] text-gray-800 font-semibold">{t('challenge.helperPlus', { points: item.helperPoints })}</Text>
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
                                        {t('challenge.submitProof')}
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