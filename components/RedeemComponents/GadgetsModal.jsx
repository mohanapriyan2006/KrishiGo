import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const GadgetsModal = ({ visible, onClose, selectedItem, onConfirm }) => {
    const [deliveryDetails, setDeliveryDetails] = useState({
        fullName: '',
        address: '',
        city: '',
        pincode: '',
        phoneNumber: '',
    });
    const [selectedColor, setSelectedColor] = useState('Black');
    const [deliverySpeed, setDeliverySpeed] = useState('standard');

    const getGadgetDetails = (type) => {
        const gadgetInfo = {
            earbuds: {
                colors: ['Black', 'White', 'Blue'],
                image: require('../../assets/images/AI.png'), // Placeholder
                brand: 'TechPro',
            },
            powerbank: {
                colors: ['Black', 'Silver', 'Red'],
                image: require('../../assets/images/AI.png'), // Placeholder
                brand: 'PowerMax',
            },
            stand: {
                colors: ['Black', 'White', 'Silver'],
                image: require('../../assets/images/AI.png'), // Placeholder
                brand: 'StandPro',
            },
            cables: {
                colors: ['Black', 'White'],
                image: require('../../assets/images/AI.png'), // Placeholder
                brand: 'CableMax',
            },
            speaker: {
                colors: ['Black', 'Blue', 'Red'],
                image: require('../../assets/images/AI.png'), // Placeholder
                brand: 'SoundPro',
            },
            watch: {
                colors: ['Black', 'Silver', 'Rose Gold'],
                image: require('../../assets/images/AI.png'), // Placeholder
                brand: 'FitWatch',
            },
        };
        return gadgetInfo[type] || gadgetInfo.earbuds;
    };

    const deliveryOptions = [
        { id: 'standard', name: 'Standard Delivery', time: '5-7 days', price: 'Free', icon: 'car-outline' },
        { id: 'express', name: 'Express Delivery', time: '2-3 days', price: '+₹50', icon: 'flash-outline' },
        { id: 'premium', name: 'Premium Delivery', time: '1-2 days', price: '+₹100', icon: 'rocket-outline' },
    ];

    const handleConfirmRedeem = () => {
        const { fullName, address, city, pincode, phoneNumber } = deliveryDetails;
        
        if (!fullName || !address || !city || !pincode || !phoneNumber) {
            Alert.alert('Missing Information', 'Please fill in all delivery details.');
            return;
        }

        if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
            Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode.');
            return;
        }

        if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number.');
            return;
        }

        const selectedDelivery = deliveryOptions.find(option => option.id === deliverySpeed);
        
        Alert.alert(
            'Order Confirmed!',
            `Your ${selectedItem?.title} (${selectedColor}) will be delivered within ${selectedDelivery?.time}. Tracking details will be sent via SMS.`,
            [
                {
                    text: 'Track Order',
                    onPress: () => {
                        Alert.alert('Order Tracking', 'Order ID: KG' + Math.random().toString(36).substr(2, 9).toUpperCase() + '\n\nYou can track your order in the Profile > My Orders section.');
                    }
                },
                {
                    text: 'OK',
                    onPress: () => {
                        resetForm();
                        onConfirm();
                        onClose();
                    }
                }
            ]
        );
    };

    const resetForm = () => {
        setDeliveryDetails({
            fullName: '',
            address: '',
            city: '',
            pincode: '',
            phoneNumber: '',
        });
        setSelectedColor('Black');
        setDeliverySpeed('standard');
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const gadgetDetails = getGadgetDetails(selectedItem?.type);

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-gray-900">Order Details</Text>
                        <TouchableOpacity onPress={handleCancel} className="p-2">
                            <Ionicons name="close" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Product Card */}
                    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
                        <View className="flex-row">
                            <Image 
                                source={gadgetDetails.image} 
                                className="w-20 h-20 rounded-lg bg-gray-100" 
                                resizeMode="cover"
                            />
                            <View className="flex-1 ml-4">
                                <Text className="text-lg font-bold text-gray-900">{selectedItem?.title}</Text>
                                <Text className="text-gray-600 text-sm">by {gadgetDetails.brand}</Text>
                                <View className="flex-row items-center mt-2">
                                    <Text className="text-primary font-bold text-lg">{selectedItem?.value}</Text>
                                    <Text className="text-gray-500 text-sm ml-2">• {selectedItem?.points} points</Text>
                                </View>
                                
                            </View>
                        </View>
                    </View>

                    {/* Color Selection */}
                    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Select Color</Text>
                        <View className="flex-row gap-3">
                            {gadgetDetails.colors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    className={`px-4 py-2 rounded-lg border-2 ${selectedColor === color 
                                        ? 'border-primary bg-lime-50' 
                                        : 'border-gray-200 bg-white'
                                    }`}
                                    onPress={() => setSelectedColor(color)}
                                >
                                    <Text className={`font-medium ${selectedColor === color 
                                        ? 'text-primary' 
                                        : 'text-gray-700'
                                    }`}>
                                        {color}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Delivery Options */}
                    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Delivery Options</Text>
                        {deliveryOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                className={`flex-row items-center p-3 rounded-lg border-2 mb-2 ${deliverySpeed === option.id 
                                    ? 'border-primary bg-lime-50' 
                                    : 'border-gray-200'
                                }`}
                                onPress={() => setDeliverySpeed(option.id)}
                            >
                                <Ionicons name={option.icon} size={20} color={deliverySpeed === option.id ? '#357900' : '#6b7280'} />
                                <View className="flex-1 ml-3">
                                    <Text className={`font-medium ${deliverySpeed === option.id ? 'text-primary' : 'text-gray-900'}`}>
                                        {option.name}
                                    </Text>
                                    <Text className="text-gray-600 text-sm">{option.time}</Text>
                                </View>
                                <Text className={`font-bold ${deliverySpeed === option.id ? 'text-primary' : 'text-gray-700'}`}>
                                    {option.price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Delivery Address Form */}
                    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-900 mb-4">Delivery Address</Text>
                        
                        <View className="gap-2">
                            <View>
                                <Text className="text-gray-700 font-medium mb-2">Full Name *</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                    placeholder="Enter your full name"
                                    value={deliveryDetails.fullName}
                                    onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, fullName: text }))}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 font-medium mb-2">Address *</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                    placeholder="House no, Street, Area"
                                    value={deliveryDetails.address}
                                    onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, address: text }))}
                                    multiline
                                    numberOfLines={2}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-2">City *</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                        placeholder="City"
                                        value={deliveryDetails.city}
                                        onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, city: text }))}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-2">Pincode *</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                        placeholder="Pincode"
                                        value={deliveryDetails.pincode}
                                        onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, pincode: text.replace(/[^0-9]/g, '') }))}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-gray-700 font-medium mb-2">Phone Number *</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                    placeholder="10-digit phone number"
                                    value={deliveryDetails.phoneNumber}
                                    onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, phoneNumber: text.replace(/[^0-9]/g, '') }))}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Order Summary */}
                    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-900 mb-3">Order Summary</Text>
                        <View className="space-y-2">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Product Value:</Text>
                                <Text className="text-gray-900 font-medium">{selectedItem?.value}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Points Used:</Text>
                                <Text className="text-gray-900 font-medium">{selectedItem?.points} pts</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Selected Color:</Text>
                                <Text className="text-gray-900 font-medium">{selectedColor}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Delivery:</Text>
                                <Text className="text-gray-900 font-medium">
                                    {deliveryOptions.find(opt => opt.id === deliverySpeed)?.price}
                                </Text>
                            </View>
                            <View className="border-t border-gray-200 pt-2 mt-2">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-900 font-bold">Total Points:</Text>
                                    <Text className="text-primary font-bold">{selectedItem?.points} pts</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="mx-4 my-6">
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                className="flex-1 bg-gray-200 py-4 rounded-lg"
                                onPress={handleCancel}
                            >
                                <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-primary py-4 rounded-lg"
                                onPress={handleConfirmRedeem}
                            >
                                <Text className="text-white font-semibold text-center">Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default GadgetsModal;
