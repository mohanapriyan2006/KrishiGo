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

const UpiModal = ({ visible, onClose, selectedItem, onConfirm }) => {
    const [paymentDetails, setPaymentDetails] = useState({
        upiId: '',
        phoneNumber: '',
    });

    const handleConfirmRedeem = () => {
        if (!paymentDetails.upiId && !paymentDetails.phoneNumber) {
            Alert.alert('Missing Information', 'Please provide UPI ID or phone number for money transfer.');
            return;
        }

        // Validate UPI ID format if provided
        if (paymentDetails.upiId && !paymentDetails.upiId.includes('@')) {
            Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g., name@upi)');
            return;
        }

        // Validate phone number if provided
        if (paymentDetails.phoneNumber && paymentDetails.phoneNumber.length !== 10) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
            return;
        }

        Alert.alert(
            'Transfer Initiated!',
            `₹${selectedItem?.value?.replace('₹', '')} will be transferred to your ${paymentDetails.upiId ? 'UPI ID' : 'phone number'} within 24 hours.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        setPaymentDetails({ upiId: '', phoneNumber: '' });
                        onConfirm();
                        onClose();
                    }
                }
            ]
        );
    };

    const handleCancel = () => {
        setPaymentDetails({ upiId: '', phoneNumber: '' });
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-center px-6">
                <View className="bg-white rounded-xl p-6">
                    {/* Header */}
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-lime-100 rounded-full items-center justify-center mb-3">
                            <Ionicons name="cash-outline" size={32} color="#357900" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900">UPI Money Transfer</Text>
                        <Text className="text-gray-600 text-center mt-1">{selectedItem?.description}</Text>
                        <View className="flex-row items-center mt-3 bg-lime-50 px-4 py-2 rounded-lg">
                            <Text className="text-lime-600 font-bold text-lg">{selectedItem?.value}</Text>
                            <Text className="text-gray-500 ml-2">• {selectedItem?.points} points</Text>
                        </View>
                    </View>

                    {/* Payment Details Form */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-4">Choose Transfer Method</Text>

                        {/* UPI ID Input */}
                        <View className="mb-4">
                            <Text className="text-gray-600 text-sm mb-2">UPI ID (Recommended)</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                placeholder="Enter UPI ID (e.g., name@paytm, name@phonepe)"
                                value={paymentDetails.upiId}
                                onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, upiId: text, phoneNumber: text ? '' : prev.phoneNumber }))}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {/* OR Divider */}
                        <View className="flex-row items-center my-4">
                            <View className="flex-1 h-px bg-gray-300" />
                            <Text className="px-3 text-gray-500 text-sm">OR</Text>
                            <View className="flex-1 h-px bg-gray-300" />
                        </View>

                        {/* Phone Number Input */}
                        <View>
                            <Text className="text-gray-600 text-sm mb-2">Phone Number</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                placeholder="Enter 10-digit phone number"
                                value={paymentDetails.phoneNumber}
                                onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, phoneNumber: text.replace(/[^0-9]/g, ''), upiId: text ? '' : prev.upiId }))}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>

                        {/* Info Note */}
                        <View className="bg-blue-50 p-3 rounded-lg mt-4">
                            <View className="flex-row items-start">
                                <Ionicons name="information-circle-outline" size={16} color="#3b82f6" className="mt-0.5" />
                                <Text className="text-blue-600 text-xs ml-2 flex-1">
                                    {" Money will be transferred within 24 hours. You'll receive an SMS confirmation once the transfer is completed."}
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
                            <Text className="text-white font-semibold text-center">Confirm Transfer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default UpiModal;
