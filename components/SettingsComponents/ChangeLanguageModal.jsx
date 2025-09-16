import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ChangeLanguageModal = ({
    showLanguageModal,
    setShowLanguageModal,
    currentLanguage,
    onLanguageChange,
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || 'English');

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
    ];

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language.name);
    };

    const handleSaveLanguage = () => {
        onLanguageChange(selectedLanguage);
        setShowLanguageModal(false);
    };

    const handleCancel = () => {
        setSelectedLanguage(currentLanguage || 'English');
        setShowLanguageModal(false);
    };

    return (
        <Modal
            visible={showLanguageModal}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <View className="flex-1 bg-black/50">
                <SafeAreaView className="flex-1">
                    <View className="flex-1 bg-white mt-20 rounded-t-3xl">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <TouchableOpacity
                                onPress={handleCancel}
                                className="w-8 h-8 items-center justify-center"
                            >
                                <Feather name="x" size={24} color="#6B7280" />
                            </TouchableOpacity>
                            <Text className="text-xl font-bold text-gray-900">Change Language</Text>
                            <TouchableOpacity
                                onPress={handleSaveLanguage}
                                className="px-4 py-2 bg-primary rounded-full"
                            >
                                <Text className="text-white font-semibold">Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Language List */}
                        <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
                            <Text className="text-gray-600 text-sm mb-4">
                                Select your preferred language for the app
                            </Text>

                            <View className="gap-2">
                                {languages.map((language) => (
                                    <TouchableOpacity
                                        key={language.code}
                                        onPress={() => handleLanguageSelect(language)}
                                        className={`p-4 rounded-xl border-2 ${selectedLanguage === language.name
                                            ? 'border-primary bg-lime-50'
                                            : 'border-gray-200 bg-white'
                                            }`}
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-1">
                                                <Text className={`text-base font-semibold ${selectedLanguage === language.name
                                                    ? 'text-primaryDark'
                                                    : 'text-gray-900'
                                                    }`}>
                                                    {language.name}
                                                </Text>
                                                <Text className={`text-sm ${selectedLanguage === language.name
                                                    ? 'text-primary'
                                                    : 'text-gray-600'
                                                    }`}>
                                                    {language.nativeName}
                                                </Text>
                                            </View>

                                            {selectedLanguage === language.name && (
                                                <View className="w-6 h-6 bg-primary rounded-full items-center justify-center">
                                                    <Feather name="check" size={16} color="white" />
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Info Section */}
                            <View className="mt-6 p-4 bg-blue-50 rounded-xl">
                                <View className="flex-row items-start">
                                    <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                                        <Ionicons name="information" size={14} color="#3B82F6" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-blue-900 font-medium text-sm mb-1">
                                            Language Support
                                        </Text>
                                        <Text className="text-blue-700 text-xs leading-4">
                                            The app interface will be displayed in your selected language.
                                            Some content might still appear in English while we work on
                                            complete translations.
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Spacer */}
                            <View className="h-6" />
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default ChangeLanguageModal;