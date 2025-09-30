import { Feather, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TermsAndConditions = ({ navigation }) => {
    const { t } = useTranslation();

    const termsData = [
        { number: '1', icon: '✅' },
        { number: '2', icon: '👤' },
        { number: '3', icon: '📱' },
        { number: '4', icon: '⭐' },
        { number: '5', icon: '🌱' },
        { number: '6', icon: '🔒' },
        { number: '7', icon: '🚫' },
        { number: '8', icon: '⚖️' },
        { number: '9', icon: '🔄' },
        { number: '10', icon: '📩', hasContact: true },
    ];

    const renderTermItem = (term) => (
        <View key={term.number} className="mb-6">
            <View className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                {/* Header */}
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                        <Text className="text-white font-bold text-sm">{term.number}</Text>
                    </View>
                    <Text className="text-lg font-bold text-gray-900 flex-1">{t(`terms.items.${term.number}.title`)}</Text>
                </View>

                {/* Content */}
                <View className="ml-11">
                    {term.number === '7' && (
                        <Text className="text-gray-700 font-medium mb-2">{t('terms.items.7.subtitle')}</Text>
                    )}

                    {(() => {
                        const content = t(`terms.items.${term.number}.content`, { returnObjects: true });
                        if (Array.isArray(content)) {
                            return (
                                <View className="gap-2">
                                    {content.map((item, index) => (
                                        <View key={index} className="flex-row items-start">
                                            <View className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2" />
                                            <Text className="flex-1 text-gray-700 leading-5">{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            );
                        }
                        return <Text className="text-gray-700 leading-5">{content}</Text>;
                    })()}

                    {/* Contact Section */}
                    {term.hasContact && (
                        <TouchableOpacity className="mt-4 bg-primary/10 rounded-xl p-4 flex-row items-center">
                            <Ionicons name="mail" size={20} color="#4c8b1f" />
                            <Text className="text-primaryDark font-medium ml-2">support@krishigo.app</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-center px-4 py-3 mt-10 relative bg-white">
                    <TouchableOpacity
                        onPress={() => navigation?.goBack()}
                        className="w-8 h-8 rounded-full bg-primary absolute left-5 items-center justify-center"
                    >
                        <Feather name="chevron-left" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-gray-900">{t('terms.title')}</Text>
                </View>

                {/* Welcome Section */}
                <View className="mx-6 mt-6">
                    <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                        <Text className="text-2xl font-bold text-center mb-2">{t('terms.bannerTitle')}</Text>
                        <Text className="text-center text-lg font-semibold text-primaryDark mb-3">{t('terms.appName')}</Text>
                        <Text className="text-base text-gray-700 text-center leading-6">
                            {t('terms.bannerDescription')}
                        </Text>
                    </View>
                </View>

                {/* Terms List */}
                <View className="mx-6 mt-6">
                    {termsData.map(renderTermItem)}
                </View>

                {/* Summary Section */}
                <View className="mx-6 mb-6">
                    <View className="bg-gradient-to-br from-green-50 to-lime-50 rounded-2xl p-6 border border-green-200">
                        <View className="flex-row items-center mb-4">
                            <View className="w-8 h-8 bg-green-200 rounded-full items-center justify-center mr-3">
                                <Text className="text-2xl">✅</Text>
                            </View>
                            <Text className="text-xl font-bold text-gray-900">{t('terms.summaryTitle')}</Text>
                        </View>
                        <Text className="text-gray-700 leading-6 text-center">{t('terms.summaryText')}</Text>
                    </View>
                </View>


                {/* Last Updated */}
                <View className="mx-6 mb-8">
                    <View className="bg-gray-100 rounded-xl p-4">
                        <Text className="text-center text-gray-600 text-sm">{t('terms.lastUpdated')}</Text>
                        <Text className="text-center text-gray-500 text-xs mt-1">{t('terms.version')}</Text>
                    </View>
                </View>

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsAndConditions;