import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const activities = [
    {
        id: 1,
        title: 'Solve Quiz',
        points: '30pts',
        icon: 'clock',
        description: 'Test your knowledge with quick quizzes'
    },
    {
        id: 2,
        title: 'Create learnings',
        points: '150pts',
        icon: 'brain',
        description: 'Share knowledge and help others learn'
    },
    {
        id: 3,
        title: 'Help a farmer',
        points: '500pts',
        icon: 'sun',
        description: 'Provide assistance to local farmers'
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
            <View className="bg-white rounded-lg px-3 py-1">
                <Text className="text-primaryDark font-bold text-sm">
                    {activity.points}
                </Text>
            </View>
        </View>
    </View>
);

const ChallengePopup = ({ visible, onClose, onActivityStart }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleActivityStart = (activity) => {
        Alert.alert(
            'Start Activity',
            `Are you ready to start "${activity.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Start',
                    onPress: () => {
                        onActivityStart(activity);
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
                            <Text className="text-white text-xl font-bold">Activities</Text>
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
                            {activities.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    onStart={handleActivityStart}
                                />
                            ))}
                        </View>

                        {/* Footer */}
                        <View className=" mb-2 pt-4 border-t border-white/20">
                            <Text className="text-white/80 text-center text-sm">
                                Earn points by completing activities
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal >
    );
};

export default ChallengePopup;

// // Usage Example Component
// export const ChallengePopupExample = () => {
//     const [showPopup, setShowPopup] = useState(false);
//     const [userPoints, setUserPoints] = useState(0);

//     const handleActivityStart = (activity) => {
//         console.log('Starting activity:', activity.title);

//         // Simulate activity completion and point earning
//         setTimeout(() => {
//             const points = parseInt(activity.points.replace('pts', ''));
//             setUserPoints(prev => prev + points);
//             Alert.alert(
//                 'Activity Completed!',
//                 `You earned ${activity.points}! Total: ${userPoints + points} points`
//             );
//         }, 2000);
//     };

//     return (
//         <View className="flex-1 bg-gray-100 justify-center items-center p-4">
//             {/* User Stats */}
//             <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
//                 <Text className="text-gray-600 text-sm">Total Points</Text>
//                 <Text className="text-2xl font-bold text-green-600">{userPoints} pts</Text>
//             </View>

//             {/* Open Popup Button */}
//             <TouchableOpacity
//                 onPress={() => setShowPopup(true)}
//                 className="bg-green-500 rounded-xl px-8 py-4 shadow-lg"
//                 activeOpacity={0.8}
//             >
//                 <Text className="text-white font-semibold text-lg">View Activities</Text>
//             </TouchableOpacity>

//             {/* Info */}
//             <Text className="text-gray-500 text-center mt-4 px-6">
//                 Complete activities to earn points and help the community
//             </Text>

//             <ChallengePopup
//                 visible={showPopup}
//                 onClose={() => setShowPopup(false)}
//                 onActivityStart={handleActivityStart}
//             />
//         </View>
//     );
// };