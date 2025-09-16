import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const ChallengeUpload = ({ visible, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [activityName, setActivityName] = useState('');
    const [location, setLocation] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

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
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!name.trim() || !activityName.trim() || !location.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const data = {
            name: name.trim(),
            activityName: activityName.trim(),
            location: location.trim(),
            image: selectedImage,
        };

        onSubmit(data);
        handleReset();
    };

    const handleReset = () => {
        setName('');
        setActivityName('');
        setLocation('');
        setSelectedImage(null);
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
                    <View className="p-6">
                        {/* Image Upload Section */}
                        <TouchableOpacity
                            onPress={pickImage}
                            className="border-2 border-dashed border-red-300 rounded-xl p-4 mb-6 items-center justify-center min-h-[200px]"
                        >
                            {selectedImage ? (
                                <Image
                                    source={{ uri: selectedImage }}
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
                        <View className="flex gap-2">
                            <View>
                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View>
                                <TextInput
                                    value={activityName}
                                    onChangeText={setActivityName}
                                    placeholder="Activity name"
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View>
                                <TextInput
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="Location details"
                                    className="border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
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
                    </View>

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
