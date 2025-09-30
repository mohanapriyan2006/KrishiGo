import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const EditProfilePhoto = ({
    showPhotoModal,
    setShowPhotoModal,
    currentPhoto,
    onPhotoUpdate,
}) => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(currentPhoto || null);
    const [isLoading, setIsLoading] = useState(false);

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
            Alert.alert(
                t('settings.photo.permissionsTitle'),
                t('settings.photo.permissionsText'),
                [{ text: t('common.ok') }]
            );
            return false;
        }
        return true;
    };

    const pickImageFromCamera = async () => {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (_error) {
            Alert.alert(t('common.error'), t('settings.photo.takeFailed'));
        }
    };

    const pickImageFromGallery = async () => {
        const hasPermissions = await requestPermissions();
        if (!hasPermissions) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (_error) {
            Alert.alert(t('common.error'), t('settings.photo.selectFailed'));
        }
    };

    const removePhoto = () => {
        Alert.alert(
            t('settings.photo.removeTitle'),
            t('settings.photo.removeConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('settings.photo.remove'),
                    style: 'destructive',
                    onPress: () => setSelectedImage(null)
                }
            ]
        );
    };

    const handleSave = async () => {
        setIsLoading(true);

        try {
            // Simulate upload process
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call the update function passed from parent
            onPhotoUpdate(selectedImage);

            Alert.alert(
                t('common.success'),
                t('settings.photo.updateSuccess'),
                [
                    {
                        text: t('common.ok'),
                        onPress: () => setShowPhotoModal(false)
                    }
                ]
            );
        } catch (_error) {
            Alert.alert(t('common.error'), t('settings.photo.updateFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedImage(currentPhoto || null);
        setShowPhotoModal(false);
    };

    const photoOptions = [
        {
            title: t('settings.photo.takePhoto'),
            icon: 'camera',
            color: '#78BB1B',
            action: pickImageFromCamera
        },
        {
            title: t('settings.photo.chooseFromGallery'),
            icon: 'image',
            color: '#78BB1B',
            action: pickImageFromGallery
        },
        {
            title: t('settings.photo.removePhoto'),
            icon: 'trash-2',
            color: '#EF4444',
            action: removePhoto,
            show: selectedImage !== null
        }
    ];

    return (
        <Modal
            visible={showPhotoModal}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <SafeAreaView>
                    <View className="bg-white rounded-t-3xl">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <TouchableOpacity
                                onPress={handleCancel}
                                className="w-8 h-8 items-center justify-center"
                                disabled={isLoading}
                            >
                                <Feather name="x" size={24} color="#6B7280" />
                            </TouchableOpacity>

                            <Text className="text-xl font-bold text-gray-900">{t('settings.photo.title')}</Text>

                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={isLoading || selectedImage === currentPhoto}
                                className={`px-4 py-2 rounded-full ${isLoading || selectedImage === currentPhoto
                                    ? 'bg-gray-300'
                                    : 'bg-primary'
                                    }`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center">
                                        <Text className="text-white font-semibold mr-2">{t('settings.photo.saving')}</Text>
                                        <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold">{t('settings.photo.save')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Current Photo Preview */}
                        <View className="items-center py-8">
                            <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                                {selectedImage ? (
                                    <Image
                                        source={{ uri: selectedImage }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-full bg-lime-200 items-center justify-center">
                                        <Ionicons name="person" size={48} color="#314C1C" />
                                    </View>
                                )}
                            </View>

                            <Text className="text-gray-600 text-center text-sm px-6">{t('settings.photo.helperText')}</Text>
                        </View>

                        {/* Photo Options */}
                        <View className="px-6 pb-6">
                            <Text className="text-lg font-semibold text-gray-900 mb-4">{t('settings.photo.optionsTitle')}</Text>

                            <View className="gap-3">
                                {photoOptions.map((option, index) => {
                                    if (option.show === false) return null;

                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={option.action}
                                            disabled={isLoading}
                                            className="bg-gray-50 p-4 rounded-xl flex-row items-center"
                                            activeOpacity={0.7}
                                        >
                                            <View
                                                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                                                style={{ backgroundColor: `${option.color}20` }}
                                            >
                                                <Feather name={option.icon} size={20} color={option.color} />
                                            </View>
                                            <Text className="text-gray-900 font-medium text-base flex-1">
                                                {option.title}
                                            </Text>
                                            <Feather name="chevron-right" size={20} color="#6B7280" />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Guidelines */}
                        <View className="mx-6 mb-6">
                            <View className="bg-blue-50 rounded-xl p-4">
                                <View className="flex-row items-start">
                                    <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                                        <Ionicons name="information" size={14} color="#3B82F6" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-blue-900 font-medium text-sm mb-2">{t('settings.photo.guidelinesTitle')}</Text>
                                        <View className="gap-1">
                                            <Text className="text-blue-700 text-xs">• {t('settings.photo.guidelineClear')}</Text>
                                            <Text className="text-blue-700 text-xs">• {t('settings.photo.guidelineAppropriate')}</Text>
                                            <Text className="text-blue-700 text-xs">• {t('settings.photo.guidelineSquare')}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Bottom Safe Area */}
                        <View className="h-8" />
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default EditProfilePhoto;