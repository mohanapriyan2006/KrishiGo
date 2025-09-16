import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const CouponModal = ({ visible, onClose, selectedItem, onConfirm }) => {
    const [email, setEmail] = useState('');


    const getBrandIcon = (type) => {
        const icons = {
            amazon: 'bag-outline',
            flipkart: 'storefront-outline',
            zomato: 'restaurant-outline',
            bms: 'film-outline',
            swiggy: 'bicycle-outline',
        };
        return icons[type] || 'gift-outline';
    };

    const handleConfirmRedeem = () => {
        if (!email) {
            Alert.alert('Missing Information', 'Please provide your email address to receive the voucher.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        Alert.alert(
            'Voucher Sent!',
            `Your ${selectedItem?.title} voucher has been sent to ${email}. Please check your inbox within 10 minutes.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setEmail('');
                        onConfirm();
                        onClose();
                    }
                }
            ]
        );
    };

    const handleCancel = () => {
        setEmail('');
        onClose();
    };

    const brandIcon = getBrandIcon(selectedItem?.type);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-center px-6">
                <View className="bg-white rounded-xl p-6">
                    {/* Header */}
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-lime-100 rounded-full items-center justify-center mb-3">
                            <Ionicons name={brandIcon} size={32} color="#357900" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900">{selectedItem?.title}</Text>
                        <Text className="text-gray-600 text-center mt-1">{selectedItem?.description}</Text>
                        <View className="flex-row items-center mt-3 bg-lime-50 px-4 py-2 rounded-lg">
                            <Text className="text-lime-600 font-bold text-lg">
                                {selectedItem?.value}
                            </Text>
                            <Text className="text-gray-500 ml-2">• {selectedItem?.points} points</Text>
                        </View>
                    </View>

                    {/* Voucher Details */}
                    <View className="bg-gray-50 rounded-lg p-4 mb-6">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="gift-outline" size={20} color="#6b7280" />
                            <Text className="text-gray-700 font-medium ml-2">Voucher Details</Text>
                        </View>
                        <View className="space-y-2">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Type:</Text>
                                <Text className="text-gray-900 font-medium">Digital Voucher</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Validity:</Text>
                                <Text className="text-gray-900 font-medium">1 Year</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Delivery:</Text>
                                <Text className="text-gray-900 font-medium">Instant via Email</Text>
                            </View>
                        </View>
                    </View>

                    {/* Email Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                            placeholder="Enter your email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        {/* Info Note */}
                        <View className="bg-blue-50 p-3 rounded-lg mt-4">
                            <View className="flex-row items-start">
                                <Ionicons name="information-circle-outline" size={16} color="#3b82f6" />
                                <Text className="text-blue-600 text-xs ml-2 flex-1">
                                    Voucher code will be sent to your email within 10 minutes. Please check spam folder if not received.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Terms & Conditions */}
                    <View className="bg-yellow-50 p-3 rounded-lg mb-6">
                        <View className="flex-row items-start">
                            <Ionicons name="warning-outline" size={16} color="#f59e0b" />
                            <View className="ml-2 flex-1">
                                <Text className="text-yellow-700 text-xs font-medium mb-1">Terms & Conditions</Text>
                                <Text className="text-yellow-600 text-xs">
                                    • Voucher is non-refundable and non-transferable{'\n'}
                                    • Valid for online purchases only{'\n'}
                                    • Cannot be combined with other offers
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 bg-gray-200 py-3 rounded-lg"
                            onPress={handleCancel}
                        >
                            <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 bg-primary py-3 rounded-lg"
                            onPress={handleConfirmRedeem}
                        >
                            <Text className="text-white font-semibold text-center">Get Voucher</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CouponModal;
