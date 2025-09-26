import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const About = ({ navigation }) => {
    const features = [
        {
            icon: '🧩',
            title: 'Play Quizzes',
            description: 'Learn about modern farming, sustainability, and best agri-practices.'
        },
        {
            icon: '⭐',
            title: 'Earn Points',
            description: 'Every correct answer gives you points for your knowledge and effort.'
        },
        {
            icon: '🎁',
            title: 'Claim Rewards',
            description: 'Redeem your points for vouchers, agri-products, or exclusive discounts.'
        },
        {
            icon: '💰',
            title: 'Convert to Money',
            description: 'Use your points to unlock financial benefits and farming resources.'
        }
    ];

    const benefits = [
        {
            icon: '👩‍🌾',
            title: 'For Farmers',
            description: 'Practical tips, eco-friendly methods, and a chance to earn while learning.'
        },
        {
            icon: '👨‍💻',
            title: 'For Youth',
            description: 'A fun, engaging way to connect with agriculture and contribute to a sustainable future.'
        },
        {
            icon: '🌍',
            title: 'For the Environment',
            description: 'Promoting reduced chemical use, water conservation, and healthier farming practices.'
        }
    ];

    const impacts = [
        'Encouraging young farmers to adopt sustainable practices.',
        'Making agriculture exciting through quizzes, challenges, and community competitions.',
        'Building greener ecosystems while rewarding knowledge and action.'
    ];

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
                    <Text className="text-2xl font-bold text-gray-900">About KrishiGo</Text>
                </View>

                {/* Welcome Section */}
                <View className="mx-6 mt-6">
                    <View className="bg-gradient-to-br from-lime-50 to-green-50 rounded-2xl p-6">
                        <Text className="text-3xl font-bold text-center mb-2">🌱 About KrishiGo</Text>
                        <Text className="text-base text-gray-700 text-center leading-6">
                            Welcome to KrishiGo – where farming meets fun, learning, and rewards! 🚜✨
                        </Text>
                        <Text className="text-base text-gray-700 text-center leading-6 mt-4">
                            KrishiGo is a gamified platform designed for young farmers and agri-enthusiasts who want to learn,
                            engage, and contribute to sustainable farming practices while earning exciting rewards.
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
                            <Text className="text-xl font-bold text-gray-900">🎯 Our Mission</Text>
                        </View>
                        <Text className="text-base text-gray-700 leading-6">
                            To empower the next generation of farmers with knowledge, motivation, and incentives that make
                            agriculture smarter, greener, and more sustainable.
                        </Text>
                    </View>
                </View>

                {/* How It Works Section */}
                <View className="mx-6 mt-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">🔑 How KrishiGo Works</Text>
                    <View className="gap-4">
                        {features.map((feature, index) => (
                            <View key={index} className="bg-lime-50 rounded-xl p-4">
                                <View className="flex-row items-start">
                                    <Text className="text-2xl mr-3 mt-1">{feature.icon}</Text>
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                                            {feature.title}
                                        </Text>
                                        <Text className="text-gray-700 leading-5">
                                            {feature.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Why KrishiGo Section */}
                <View className="mx-6 mt-6">
                    <Text className="text-xl font-bold text-gray-900 mb-4">🌾 Why KrishiGo?</Text>
                    <View className="gap-4">
                        {benefits.map((benefit, index) => (
                            <View key={index} className="bg-lime-50 rounded-xl p-4">
                                <View className="flex-row items-start">
                                    <Text className="text-2xl mr-3 mt-1">{benefit.icon}</Text>
                                    <View className="flex-1">
                                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                                            {benefit.title}
                                        </Text>
                                        <Text className="text-gray-700 leading-5">
                                            {benefit.description}
                                        </Text>
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
                            <Text className="text-xl font-bold text-gray-900">🚀 Our Impact</Text>
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
                        <Text className="text-center text-lg font-semibold text-gray-900 leading-6">
                            {" 👉 With KrishiGo, farming isn't just about growing crops its about growing knowledge, rewards, and a sustainable future. 🌱💡"}
                        </Text>
                    </View>
                </View>

                {/* Contact Section */}
                <View className="mx-6 mb-6">
                    <View className="bg-gray-50 rounded-2xl p-6">
                        <Text className="text-lg font-bold text-gray-900 mb-4 text-center">Get in Touch</Text>
                        <View className="gap-3">
                            <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center justify-center border border-gray-200">
                                <Ionicons name="mail" size={20} color="#4c8b1f" />
                                <Text className="text-primary font-medium ml-2">support@krishigo.com</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center justify-center border border-gray-200">
                                <Ionicons name="globe" size={20} color="#4c8b1f" />
                                <Text className="text-primary font-medium ml-2">www.krishigo.com</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Version Info */}
                <View className="mx-6 mb-8">
                    <View className="bg-gray-100 rounded-xl p-4">
                        <Text className="text-center text-gray-600 text-sm">
                            KrishiGo v1.0.0
                        </Text>
                        <Text className="text-center text-gray-500 text-xs mt-1">
                            © 2024 KrishiGo. All rights reserved.
                        </Text>
                    </View>
                </View>

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default About;