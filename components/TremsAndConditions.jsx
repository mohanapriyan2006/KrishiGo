import { Feather, Ionicons } from '@expo/vector-icons';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TermsAndConditions = ({ navigation }) => {
    const termsData = [
        {
            number: '1',
            title: 'Acceptance of Terms',
            content: 'By downloading, registering, or using KrishiGo, you agree to comply with these Terms. If you do not agree, please do not use the app.',
            icon: '✅'
        },
        {
            number: '2',
            title: 'Eligibility ',
            content: [
                'The app is designed for young farmers and youth (18+ years).',
                'Users under 18 must have parental/guardian consent.',
                'You agree to provide accurate registration details (name, age, email/phone).'
            ],
            icon: '👤'
        },
        {
            number: '3',
            title: 'Use of the App ',
            content: [
                'KrishiGo is for educational and entertainment purposes related to agriculture and sustainability.',
                'You agree not to misuse the app for fraudulent activities, hacking, or unauthorized access.',
                'Quiz answers must be given fairly—no cheating or use of automated tools.'
            ],
            icon: '📱'
        },
        {
            number: '4',
            title: 'Points & Rewards',
            content: [
                'Points are earned through quizzes, challenges, and in-app activities.',
                'Points have no cash value outside the app unless converted through authorized reward mechanisms.',
                'Conversion of points to money or vouchers is subject to availability, verification, and KrishiGo policies.',
                'KrishiGo reserves the right to modify, suspend, or discontinue reward programs at any time.'
            ],
            icon: '⭐'
        },
        {
            number: '5',
            title: 'Sustainability & Content ',
            content: [
                'Quiz content is for awareness and learning purposes only.',
                'KrishiGo does not guarantee that following suggested practices will result in specific farming outcomes.',
                'Users should consult agricultural experts before applying any techniques in real farming.'
            ],
            icon: '🌱'
        },
        {
            number: '6',
            title: 'Privacy & Data ',
            content: [
                'We respect your privacy. Your data will be used only for app functionality, rewards distribution, and improving user experience.',
                'We may share aggregated (non-personal) data for research and reporting purposes.',
                'By using the app, you consent to our data practices outlined in the Privacy Policy.'
            ],
            icon: '🔒'
        },
        {
            number: '7',
            title: 'Prohibited Activities ',
            content: [
                'Create multiple fake accounts to exploit rewards.',
                'Sell or transfer points/accounts without KrishiGo\'s permission.',
                'Spread harmful, misleading, or offensive content.'
            ],
            icon: '🚫',
            subtitle: 'You agree not to:'
        },
        {
            number: '8',
            title: 'Limitation of Liability ',
            content: [
                'KrishiGo is not responsible for technical issues, network failures, or delays in reward redemption.',
                'We are not liable for financial, farming, or personal losses arising from the use of our app.',
                'All use of the app is at your own risk.'
            ],
            icon: '⚖️'
        },
        {
            number: '9',
            title: 'Modifications & Updates ',
            content: [
                'KrishiGo may update these Terms anytime. Changes will be notified in-app or on our website.',
                'Continued use of the app means you accept the updated Terms.'
            ],
            icon: '🔄'
        },
        {
            number: '10',
            title: 'Contact Us ',
            content: 'For questions, feedback, or concerns regarding these Terms, please contact us at:',
            icon: '📩',
            hasContact: true
        }
    ];

    const renderTermItem = (term) => (
        <View key={term.number} className="mb-6">
            <View className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                {/* Header */}
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                        <Text className="text-white font-bold text-sm">{term.number}</Text>
                    </View>
                    <Text className="text-lg font-bold text-gray-900 flex-1">{term.title}</Text>
                </View>

                {/* Content */}
                <View className="ml-11">
                    {term.subtitle && (
                        <Text className="text-gray-700 font-medium mb-2">{term.subtitle}</Text>
                    )}

                    {Array.isArray(term.content) ? (
                        <View className="gap-2">
                            {term.content.map((item, index) => (
                                <View key={index} className="flex-row items-start">
                                    <View className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2" />
                                    <Text className="flex-1 text-gray-700 leading-5">{item}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className="text-gray-700 leading-5">{term.content}</Text>
                    )}

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
                    <Text className="text-2xl font-bold text-gray-900">Terms & Conditions</Text>
                </View>

                {/* Welcome Section */}
                <View className="mx-6 mt-6">
                    <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                        <Text className="text-2xl font-bold text-center mb-2">📜 Terms & Conditions</Text>
                        <Text className="text-center text-lg font-semibold text-primaryDark mb-3">KrishiGo</Text>
                        <Text className="text-base text-gray-700 text-center leading-6">
                            Welcome to KrishiGo! By accessing or using our app, you agree to the following Terms & Conditions.
                            Please read them carefully.
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
                            <Text className="text-xl font-bold text-gray-900">Summary</Text>
                        </View>
                        <Text className="text-gray-700 leading-6 text-center">
                            {" KrishiGo is built to make farming fun, rewarding, and sustainable. Play fair, respect the rules, and together we'll grow knowledge and sustainability. 🌍💚"}
                        </Text>
                    </View>
                </View>


                {/* Last Updated */}
                <View className="mx-6 mb-8">
                    <View className="bg-gray-100 rounded-xl p-4">
                        <Text className="text-center text-gray-600 text-sm">
                            Last Updated: December 2024
                        </Text>
                        <Text className="text-center text-gray-500 text-xs mt-1">
                            Version 1.0 - KrishiGo Terms & Conditions
                        </Text>
                    </View>
                </View>

                {/* Spacer for bottom navigation */}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsAndConditions;