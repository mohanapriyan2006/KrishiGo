import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { DataContext } from '../../hooks/DataContext';

const ChallengeUpload = ({ visible, onClose }) => {

    const { rewardTasks = [] } = useContext(DataContext);

    const [challengeData, setChallengeData] = useState({
        name: '',
        activityName: '',
        activityId: '',
        location: '',
        description: '',
        image: null,
    });

    const [activityPickerVisible, setActivityPickerVisible] = useState(false);

    const pickImage = async () => {
        // Request permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setChallengeData(prev => ({ ...prev, image: result.assets[0].uri }));
        }
    };

    const handleSubmit = () => {
        if (!challengeData.name.trim() || !challengeData.activityName.trim() || !challengeData.location.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const data = {
            name: challengeData.name.trim(),
            activityName: challengeData.activityName.trim(),
            activityId: challengeData.activityId.trim(),
            location: challengeData.location.trim(),
            description: challengeData.description.trim() || '',
            image: challengeData.image,
        };

        console.log('Submitted Challenge Data:', data);
        Alert.alert('Success', 'Activity submitted successfully!');
        handleReset();
    };

    const handleReset = () => {
        setChallengeData({
            name: '',
            activityName: '',
            activityId: '',
            location: '',
            description: '',
            image: null,
        });
        setActivityPickerVisible(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-xl">
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                        <Text className="text-lg font-semibold text-gray-800">Upload Activity</Text>
                        <TouchableOpacity onPress={handleClose} className="p-2">
                            <Feather name="x" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView className="p-6">
                        {/* Image Upload Section */}
                        <TouchableOpacity
                            onPress={pickImage}
                            className="border-2 border-dashed border-red-300 rounded-xl p-4 mb-6 items-center justify-center min-h-[200px]"
                        >
                            {challengeData.image ? (
                                <Image
                                    source={{ uri: challengeData.image }}
                                    className="w-full h-[280px] scale-80 rounded-lg"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="items-center">
                                    <Feather name="camera" size={32} color="#9CA3AF" className="mb-2" />
                                    <Text className="text-gray-600 font-medium mb-1">Upload a photo here</Text>
                                    <View className="bg-primaryDark px-4 py-2 rounded-lg">
                                        <Text className="text-white font-medium">Browse a file</Text>
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Form Fields */}
                        <View className="flex gap-3">
                            {/* Name */}
                            <TextInput
                                value={challengeData.name}
                                onChangeText={(text) => setChallengeData(prev => ({ ...prev, name: text }))}
                                placeholder="Enter your name"
                                className="border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
                                placeholderTextColor="#9CA3AF"
                            />

                            {/* Activity Picker Trigger */}
                            <View>
                                <TouchableOpacity
                                    onPress={() => setActivityPickerVisible(v => !v)}
                                    activeOpacity={0.8}
                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 flex-row justify-between items-center"
                                >
                                    <Text className={`text-sm ${challengeData.activityName ? 'text-gray-800' : 'text-gray-400'}`}> {challengeData.activityName || 'Select Activity'} </Text>
                                    <Feather name={activityPickerVisible ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
                                </TouchableOpacity>
                                {activityPickerVisible && (
                                    <View className="mt-2 border border-gray-200 rounded-xl bg-white max-h-56 overflow-hidden">
                                        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                                            {rewardTasks.map(task => (
                                                <TouchableOpacity
                                                    key={task.id}
                                                    onPress={() => {
                                                        setChallengeData(prev => ({ ...prev, activityName: task.task, activityId: String(task.id) }));
                                                        setActivityPickerVisible(false);
                                                    }}
                                                    className="px-4 py-3 border-b border-gray-100 active:bg-gray-50"
                                                >
                                                    <Text className="text-gray-800 text-sm font-medium" numberOfLines={1}>{task.task}</Text>
                                                    <Text className="text-[10px] text-primaryDark mt-1" numberOfLines={1}>ID: {task.id} • Farmer +{task.farmerPoints} / Helper +{task.helperPoints}</Text>
                                                </TouchableOpacity>
                                            ))}
                                            {rewardTasks.length === 0 && (
                                                <View className="px-4 py-4 items-center">
                                                    <Text className="text-xs text-gray-500">No activities available</Text>
                                                </View>
                                            )}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>

                            {/* Activity ID (Read-only once selected) */}
                            {challengeData.activityId ? (
                                <View className="flex-row items-center justify-between border border-primary bg-lime-100 rounded-xl px-4 py-3">
                                    <Text className="text-xs font-medium text-primaryDark">Selected ID</Text>
                                    <Text className="text-sm font-semibold text-primaryDark">#{challengeData.activityId}</Text>
                                </View>
                            ) : null}

                            {/* Location */}
                            <TextInput
                                value={challengeData.location}
                                onChangeText={(text) => setChallengeData(prev => ({ ...prev, location: text }))}
                                placeholder="Location details"
                                className="border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
                                placeholderTextColor="#9CA3AF"
                            />

                            {/* Description */}
                            <TextInput
                                value={challengeData.description}
                                onChangeText={(text) => setChallengeData(prev => ({ ...prev, description: text }))}
                                placeholder="Description (optional)"
                                className="border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
                                placeholderTextColor="#9CA3AF"
                                multiline
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="bg-primary rounded-xl py-4 mt-6 shadow-sm"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-semibold tracking-wider text-center text-lg">
                                Submit Activity
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Guidelines */}
                    <View className="mx-6 mb-6">
                        <View className="bg-blue-50 rounded-xl p-4">
                            <View className="flex-row items-start">
                                <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                                    <Ionicons name="information" size={14} color="#3B82F6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-blue-900 font-medium text-sm mb-2">
                                        Photo Guidelines
                                    </Text>
                                    <View className="gap-1">
                                        <Text className="text-blue-700 text-xs">
                                            • Use a clear, Geo-tagged photo of yourself
                                        </Text>
                                        <Text className="text-blue-700 text-xs">
                                            • Avoid inappropriate or offensive content
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ChallengeUpload;
