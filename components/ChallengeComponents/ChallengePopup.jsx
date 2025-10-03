import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const activities = [
    {
        id: 1,
        diff: 'easy',
        points: '30pts',
        icon: 'clock',
    },
    {
        id: 2,
        diff: 'medium',
        points: '150pts',
        icon: 'brain',
    },
    {
        id: 3,
        diff: 'hard',
        points: '500pts',
        icon: 'sun',
    }
];

const ActivityItem = ({ activity, onStart }) => (
    <View className="flex-row items-center justify-between p-4 mb-3">
        <View className="flex-row items-center flex-1">
            {/* Icon */}
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-4">
                {activity.icon === 'clock' && <Feather name="clock" size={24} color="white" />}
                {activity.icon === 'brain' && <Feather name="head" size={24} color="white" />}
                {activity.icon === 'sun' && <Feather name="sun" size={24} color="white" />}
            </View>

            {/* Title */}
            <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-1">
                    {activity.title}
                </Text>
                <Text className="text-white/70 text-sm">
                    {activity.description}
                </Text>
            </View>
        </View>

        {/* Points and Start Button */}
        <View className="flex-col items-center gap-2 ">

            <TouchableOpacity
                onPress={() => onStart(activity)}
                className="bg-green-800 rounded-lg px-4 py-1 shadow-lg"
                activeOpacity={0.8}
            >
                <Text className="text-white font-semibold text-sm">start</Text>
            </TouchableOpacity>
            <View className="bg-white rounded-lg p-1 px-2">
                <Text className="text-primaryDark font-bold text-sm">
                    {activity.points}
                </Text>
            </View>
        </View>
    </View>
);

const ChallengePopup = ({ visible, onClose }) => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    const handleActivityStart = (activity) => {
        Alert.alert(
            t('challenge.startActivityTitle'),
            t('challenge.startActivityMsg', { title: activity.title }),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('challenge.start'),
                    onPress: () => {
                        navigation.navigate('Quiz', { activityId: activity.id });
                        onClose();
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-1">
                <View className=" rounded-2xl w-full max-w-sm mx-1 shadow-xl">
                    {/* Main Card */}
                    <View className="bg-lime-600/90 rounded-3xl p-2 shadow-lg">
                        {/* Header */}
                        <View className="flex-row justify-between items-center px-4 pt-2">
                            <Text className="text-white text-xl font-bold">{t('challenge.dailyActivities')}</Text>
                            <TouchableOpacity
                                onPress={onClose}
                                className="bg-white/20 rounded-full p-2"
                                activeOpacity={0.7}
                            >
                                <Feather name="x" size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Activities List */}
                        <View className="gap-1">
                            {activities.map((activity) => {
                                const localized = {
                                    ...activity,
                                    title: t(`challenge.activities.${activity.diff}.title`),
                                    description: t(`challenge.activities.${activity.diff}.description`),
                                };
                                return (
                                    <ActivityItem
                                        key={activity.id}
                                        activity={localized}
                                        onStart={handleActivityStart}
                                    />
                                );
                            })}
                        </View>

                        {/* Footer */}
                        <View className=" mb-2 pt-4 border-t border-white/20">
                            <Text className="text-white/80 text-center text-sm">
                                {t('challenge.earnByCompleting')}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal >
    );
};

export default ChallengePopup;
