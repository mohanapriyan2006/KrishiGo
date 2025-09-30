import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const About = ({ navigation }) => {
    const { t } = useTranslation();

    const features = t('about.features', { returnObjects: true });
    const benefits = t('about.benefits', { returnObjects: true });
    const impacts = t('about.impacts', { returnObjects: true });

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-center px-4 py-3 mt-10 relative">
                    <TouchableOpacity
                        onPress={() => navigation?.goBack()}
                        className="w-8 h-8 rounded-full bg-primary absolute left-5 items-center justify-center"
                    >
                        <Feather name="chevron-left" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-gray-900">{t('about.title')}</Text>
                </View>

                {/* Welcome Section */}
                <View className="mx-6 mt-6">
                    <View className="bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl p-6">
                        <Text className="text-3xl font-bold text-center mb-2">{t('about.bannerTitle')}</Text>
                        <Text className="text-base text-gray-700 text-center leading-6">
                            {t('about.bannerWelcome')}
                        </Text>
                        <Text className="text-base text-gray-700 text-center leading-6 mt-4">
                            {t('about.bannerDescription')}
                        </Text>
                    </View>
                </View>

                {/* Mission Section */}
                <View className="mx-6 mt-6">
                    <View className="bg-blue-50 rounded-2xl p-6">
                        <View className="flex-row items-center mb-4">
                            <View className="w-8 h-8 bg-blue-200 rounded-full items-center justify-center mr-3">
                                <Ionicons name="flag" size={20} color="#1E40AF" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900">{t('about.missionTitle')}</Text>
                        </View>
                        <Text className="text-base text-gray-700 leading-6">
                            {t('about.missionText')}
                        </Text>
                    </View>
                </View>

                {/* How It Works Section */}
                <View className="mx-6 mt-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">{t('about.howWorksTitle')}</Text>
                    <View className="gap-4">
                        {features.map((feature, index) => (
                            <View key={index} className="bg-lime-50 rounded-xl p-4">
                                <View className="flex-row items-start">
                                    <Text className="text-2xl mr-3 mt-1">{feature.icon}</Text>
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</Text>
                                        <Text className="text-gray-700 leading-5">{feature.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Why KrishiGo Section */}
                <View className="mx-6 mt-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">{t('about.whyTitle')}</Text>
                    <View className="gap-4">
                        {benefits.map((benefit, index) => (
                            <View key={index} className="bg-lime-50 rounded-xl p-4">
                                <View className="flex-row items-start">
                                    <Text className="text-2xl mr-3 mt-1">{benefit.icon}</Text>
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-gray-900 mb-1">{benefit.title}</Text>
                                        <Text className="text-gray-700 leading-5">{benefit.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Our Impact Section */}
                <View className="mx-6 mt-6">
                    <View className="bg-lime-50 rounded-2xl p-6">
                        <View className="flex-row items-center mb-4">
                            <View className="w-8 h-8 bg-lime-200 rounded-full items-center justify-center mr-3">
                                <MaterialIcons name="trending-up" size={20} color="green" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900">{t('about.impactTitle')}</Text>
                        </View>
                        <View className="gap-3">
                            {impacts.map((impact, index) => (
                                <View key={index} className="flex-row items-start">
                                    <View className="w-2 h-2 bg-lime-500 rounded-full mr-3 mt-2" />
                                    <Text className="flex-1 text-gray-700 leading-5">{impact}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Closing Message */}
                <View className="mx-6 mt-6 mb-8">
                    <View className="bg-lime-50 rounded-2xl p-6 border border-purple-100">
                        <Text className="text-center text-lg font-semibold text-gray-900 leading-6">{t('about.closing')}</Text>
                    </View>
                </View>

                {/* Contact Section */}
                <View className="mx-6 mb-6">
                    <View className="bg-gray-50 rounded-2xl p-6">
                        <Text className="text-lg font-bold text-gray-900 mb-4 text-center">{t('about.contactTitle')}</Text>
                        <View className="gap-3">
                            <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center justify-center border border-gray-200">
                                <Ionicons name="mail" size={20} color="#4c8b1f" />
                                <Text className="text-primary font-medium ml-2">{t('about.contact.email')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center justify-center border border-gray-200">
                                <Ionicons name="globe" size={20} color="#4c8b1f" />
                                <Text className="text-primary font-medium ml-2">{t('about.contact.website')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Version Info */}
                <View className="mx-6 mb-8">
                    <View className="bg-gray-100 rounded-xl p-4">
                        <Text className="text-center text-gray-600 text-sm">{t('about.version')}</Text>
                        <Text className="text-center text-gray-500 text-xs mt-1">{t('about.copyright')}</Text>
                    </View>
                </View>

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default About;