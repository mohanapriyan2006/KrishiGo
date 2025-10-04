import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

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
        { id: 'standard', name: t('rewards.gadgets.delivery.standard'), time: t('rewards.gadgets.delivery.standardTime'), price: t('rewards.gadgets.delivery.standardPrice'), icon: 'car-outline' },
        { id: 'express', name: t('rewards.gadgets.delivery.express'), time: t('rewards.gadgets.delivery.expressTime'), price: t('rewards.gadgets.delivery.expressPrice'), icon: 'flash-outline' },
        { id: 'premium', name: t('rewards.gadgets.delivery.premium'), time: t('rewards.gadgets.delivery.premiumTime'), price: t('rewards.gadgets.delivery.premiumPrice'), icon: 'rocket-outline' },
    ];

    const handleConfirmRedeem = () => {
        const { fullName, address, city, pincode, phoneNumber } = deliveryDetails;
        
        if (!fullName || !address || !city || !pincode || !phoneNumber) {
            Alert.alert(t('rewards.gadgets.missingTitle'), t('rewards.gadgets.missingMsg'));
            return;
        }

        if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
            Alert.alert(t('rewards.gadgets.invalidPincodeTitle'), t('rewards.gadgets.invalidPincodeMsg'));
            return;
        }

        if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
            Alert.alert(t('rewards.gadgets.invalidPhoneTitle'), t('rewards.gadgets.invalidPhoneMsg'));
            return;
        }

        const selectedDelivery = deliveryOptions.find(option => option.id === deliverySpeed);
        
        Alert.alert(
            t('rewards.gadgets.orderConfirmedTitle'),
            t('rewards.gadgets.orderConfirmedMsg', { title: selectedItem?.title, color: selectedColor, time: selectedDelivery?.time }),
            [
                {
                    text: t('rewards.gadgets.trackOrder'),
                    onPress: () => {
                        Alert.alert(
                            t('rewards.gadgets.trackingTitle'),
                            t('rewards.gadgets.trackingMsg', { id: 'KG' + Math.random().toString(36).substr(2, 9).toUpperCase() })
                        );
                    }
                },
                {
                    text: t('common.ok'),
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
                        <Text className="text-xl font-bold text-gray-900">{t('rewards.gadgets.orderDetails')}</Text>
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
                                <Text className="text-gray-600 text-sm">{t('rewards.gadgets.byBrand', { brand: gadgetDetails.brand })}</Text>
                                <View className="flex-row items-center mt-2">
                                    <Text className="text-primary font-bold text-lg">{selectedItem?.value}</Text>
                                    <Text className="text-gray-500 text-sm ml-2">• {selectedItem?.points} {t('rewards.common.points')}</Text>
                                </View>
                                
                            </View>
                        </View>
                    </View>

                    {/* Color Selection */}
                    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-900 mb-3">{t('rewards.gadgets.selectColor')}</Text>
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
                                        {t(`rewards.gadgets.colors.${color.toLowerCase().replace(/\s+/g, '_')}`, { defaultValue: color })}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Delivery Options */}
                    <View className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-900 mb-3">{t('rewards.gadgets.deliveryOptions')}</Text>
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
                        <Text className="text-lg font-bold text-gray-900 mb-4">{t('rewards.gadgets.deliveryAddress')}</Text>
                        
                        <View className="gap-2">
                            <View>
                                <Text className="text-gray-700 font-medium mb-2">{t('rewards.gadgets.fullNameLabel')}</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                    placeholder={t('rewards.gadgets.fullNamePlaceholder')}
                                    value={deliveryDetails.fullName}
                                    onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, fullName: text }))}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 font-medium mb-2">{t('rewards.gadgets.addressLabel')}</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                    placeholder={t('rewards.gadgets.addressPlaceholder')}
                                    value={deliveryDetails.address}
                                    onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, address: text }))}
                                    multiline
                                    numberOfLines={2}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-2">{t('rewards.gadgets.cityLabel')}</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                        placeholder={t('rewards.gadgets.cityPlaceholder')}
                                        value={deliveryDetails.city}
                                        onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, city: text }))}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-700 font-medium mb-2">{t('rewards.gadgets.pincodeLabel')}</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                        placeholder={t('rewards.gadgets.pincodePlaceholder')}
                                        value={deliveryDetails.pincode}
                                        onChangeText={(text) => setDeliveryDetails(prev => ({ ...prev, pincode: text.replace(/[^0-9]/g, '') }))}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>
                            </View>

                            <View>
                                <Text className="text-gray-700 font-medium mb-2">{t('rewards.gadgets.phoneLabel')}</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                                    placeholder={t('rewards.gadgets.phonePlaceholder')}
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
                        <Text className="text-lg font-bold text-gray-900 mb-3">{t('rewards.gadgets.orderSummary')}</Text>
                        <View className="space-y-2">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">{t('rewards.gadgets.summary.productValue')}</Text>
                                <Text className="text-gray-900 font-medium">{selectedItem?.value}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">{t('rewards.gadgets.summary.pointsUsed')}</Text>
                                <Text className="text-gray-900 font-medium">{selectedItem?.points} {t('rewards.common.points')}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">{t('rewards.gadgets.summary.selectedColor')}</Text>
                                <Text className="text-gray-900 font-medium">{t(`rewards.gadgets.colors.${selectedColor.toLowerCase().replace(/\s+/g, '_')}`, { defaultValue: selectedColor })}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">{t('rewards.gadgets.summary.delivery')}</Text>
                                <Text className="text-gray-900 font-medium">
                                    {deliveryOptions.find(opt => opt.id === deliverySpeed)?.price}
                                </Text>
                            </View>
                            <View className="border-t border-gray-200 pt-2 mt-2">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-900 font-bold">{t('rewards.gadgets.summary.totalPoints')}</Text>
                                    <Text className="text-primary font-bold">{selectedItem?.points} {t('rewards.common.points')}</Text>
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
                                <Text className="text-gray-700 font-semibold text-center">{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-primary py-4 rounded-lg"
                                onPress={handleConfirmRedeem}
                            >
                                <Text className="text-white font-semibold text-center">{t('rewards.gadgets.placeOrder')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default GadgetsModal;
