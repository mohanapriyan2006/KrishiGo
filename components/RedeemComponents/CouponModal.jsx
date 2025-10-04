import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const CouponModal = ({ visible, onClose, selectedItem, onConfirm }) => {
    const { t } = useTranslation();
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
            Alert.alert(t('rewards.coupon.missingTitle'), t('rewards.coupon.missingMsg'));
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert(t('rewards.coupon.invalidEmailTitle'), t('rewards.coupon.invalidEmailMsg'));
            return;
        }

        Alert.alert(
            t('rewards.coupon.sentTitle'),
            t('rewards.coupon.sentMsg', { title: selectedItem?.title, email }),
            [
                {
                    text: t('common.ok'),
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
                            <Text className="text-gray-500 ml-2">• {selectedItem?.points} {t('rewards.common.points')}</Text>
                        </View>
                    </View>

                    {/* Voucher Details */}
                    <View className="bg-gray-50 rounded-lg p-4 mb-6">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="gift-outline" size={20} color="#6b7280" />
                            <Text className="text-gray-700 font-medium ml-2">{t('rewards.coupon.detailsTitle')}</Text>
                        </View>
                        <View className="space-y-2">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">{t('rewards.coupon.typeLabel')}</Text>
                                <Text className="text-gray-900 font-medium">{t('rewards.coupon.typeValue')}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">{t('rewards.coupon.validityLabel')}</Text>
                                <Text className="text-gray-900 font-medium">{t('rewards.coupon.validityValue')}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">{t('rewards.coupon.deliveryLabel')}</Text>
                                <Text className="text-gray-900 font-medium">{t('rewards.coupon.deliveryValue')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Email Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">{t('rewards.coupon.emailLabel')}</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                            placeholder={t('rewards.coupon.emailPlaceholder')}
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
                                    {t('rewards.coupon.infoNote')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Terms & Conditions */}
                    <View className="bg-yellow-50 p-3 rounded-lg mb-6">
                        <View className="flex-row items-start">
                            <Ionicons name="warning-outline" size={16} color="#f59e0b" />
                            <View className="ml-2 flex-1">
                                <Text className="text-yellow-700 text-xs font-medium mb-1">{t('rewards.coupon.termsTitle')}</Text>
                                <Text className="text-yellow-600 text-xs">{t('rewards.coupon.termsText')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 bg-gray-200 py-3 rounded-lg"
                            onPress={handleCancel}
                        >
                            <Text className="text-gray-700 font-semibold text-center">{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 bg-primary py-3 rounded-lg"
                            onPress={handleConfirmRedeem}
                        >
                            <Text className="text-white font-semibold text-center">{t('rewards.coupon.getVoucher')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CouponModal;
