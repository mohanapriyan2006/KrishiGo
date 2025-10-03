import { Feather, Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { updateUserProfile } from '../../api/user/user_service';
import { DataContext } from '../../hooks/DataContext';

const EditAccountModal = ({
    showEditModal,
    setShowEditModal,
    userProfile,
}) => {
    const { t } = useTranslation();

    const { user, userDetails, fetchUserDetails } = useContext(DataContext);

    const [formData, setFormData] = useState({
        firstName: userDetails?.firstName || 'Vijay',
        lastName: userDetails?.lastName || 'Kumar',
        phoneNumber: userDetails?.phoneNumber || '+91 12345-67890',
        street: userDetails?.address?.street || 'South street',
        city: userDetails?.address?.city || 'Koomapatti',
        state: userDetails?.address?.state || 'Tamil Nadu',
        country: userDetails?.address?.country || 'India',
        zipCode: userDetails?.address?.zipCode || '600001',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = t('settings.profileEdit.errors.firstNameRequired');
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = t('settings.profileEdit.errors.firstNameMin');
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = t('settings.profileEdit.errors.lastNameRequired');
        } else if (formData.lastName.trim().length < 1) {
            newErrors.lastName = t('settings.profileEdit.errors.lastNameMin');
        }

        // Phone Number validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = formData.phoneNumber.replace(/[\s\-\(\)]/g, '');
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = t('settings.profileEdit.errors.phoneRequired');
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.phoneNumber = t('settings.profileEdit.errors.phoneInvalid');
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = t('settings.profileEdit.errors.cityRequired');
        }
        // State validation
        if (!formData.state.trim()) {
            newErrors.state = t('settings.profileEdit.errors.stateRequired');
        }
        // Country validation
        if (!formData.country.trim()) {
            newErrors.country = t('settings.profileEdit.errors.countryRequired');
        }
        // Street validation
        if (!formData.street.trim()) {
            newErrors.street = t('settings.profileEdit.errors.streetRequired');
        }
        // Zip code validation
        if (!formData.zipCode.trim()) {
            newErrors.zipCode = t('settings.profileEdit.errors.zipRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {

            await updateUserProfile(user.uid, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                address: {
                    city: formData.city,
                    street: formData.street,
                    state: formData.state,
                    country: formData.country,
                    zipCode: formData.zipCode,
                },
            });

            Alert.alert(
                t('common.success'),
                t('settings.profileEdit.updateSuccess'),
                [
                    {
                        text: t('common.ok'),
                        onPress: () => setShowEditModal(false)
                    }
                ]
            );
        } catch (_error) {
            Alert.alert(t('common.error'), t('settings.profileEdit.updateFailed'), [{ text: t('common.ok') }]);
        } finally {
            fetchUserDetails();
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        setErrors({});
        setShowEditModal(false);
    };

    const renderInputField = (
        label,
        field,
        placeholder,
        keyboardType = 'default',
        icon = null
    ) => (
        <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">{label}</Text>
            <View className={`flex-row items-center border-2 rounded-xl px-4 py-3 ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                }`}>
                {icon && (
                    <View className="mr-3">
                        {icon}
                    </View>
                )}
                <TextInput
                    value={formData[field]}
                    onChangeText={(value) => handleInputChange(field, value)}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    className="flex-1 text-base text-gray-900"
                    placeholderTextColor="#9CA3AF"
                />
            </View>
            {errors[field] && (
                <Text className="text-red-500 text-sm mt-1">{errors[field]}</Text>
            )}
        </View>
    );

    return (
        <Modal
            visible={showEditModal}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-black/50"
            >
                <SafeAreaView className="flex-1">
                    <View className="flex-1 bg-white mt-20 rounded-t-3xl">
                        {/* Header */}
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                            <TouchableOpacity
                                onPress={handleCancel}
                                className="w-8 h-8 items-center justify-center"
                                disabled={isLoading}
                            >
                                <Feather name="x" size={24} color="#6B7280" />
                            </TouchableOpacity>

                            <Text className="text-xl font-bold text-gray-900">{t('settings.profileEdit.title')}</Text>

                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-full ${isLoading ? 'bg-gray-300' : 'bg-primary'
                                    }`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center">
                                        <Text className="text-white font-semibold mr-2">{t('settings.profileEdit.saving')}</Text>
                                        <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold">{t('settings.profileEdit.save')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Form Content */}
                        <ScrollView
                            className="flex-1 px-6 py-4"
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text className="text-gray-600 text-sm mb-6">{t('settings.profileEdit.subtitle')}</Text>

                            {/* Profile Picture Section */}
                            <View className="items-center mb-6">
                                <View className="w-24 h-24 bg-lime-200 rounded-full items-center justify-center mb-3">
                                    <Ionicons name="person" size={40} color="#314C1C" />
                                </View>
                                <TouchableOpacity className="bg-primary px-4 py-2 rounded-full">
                                    <Text className="text-white font-medium">{t('settings.profileEdit.changePhoto')}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* First Name */}
                            {renderInputField(
                                t('settings.firstName'),
                                'firstName',
                                t('settings.profileEdit.placeholders.firstName'),
                                'default',
                                <Ionicons name="person-outline" size={20} color="#6B7280" />
                            )}

                            {/* Last Name */}
                            {renderInputField(
                                t('settings.lastName'),
                                'lastName',
                                t('settings.profileEdit.placeholders.lastName'),
                                'default',
                                <Ionicons name="person-outline" size={20} color="#6B7280" />
                            )}

                            {/* Phone Number */}
                            {renderInputField(
                                t('settings.phone'),
                                'phoneNumber',
                                t('settings.profileEdit.placeholders.phone'),
                                'phone-pad',
                                <Feather name="phone" size={20} color="#6B7280" />
                            )}

                            {/* Street */}
                            {renderInputField(
                                t('settings.profileEdit.labels.street'),
                                'street',
                                t('settings.profileEdit.placeholders.street'),
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* City */}
                            {renderInputField(
                                t('settings.profileEdit.labels.city'),
                                'city',
                                t('settings.profileEdit.placeholders.city'),
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* State */}
                            {renderInputField(
                                t('settings.profileEdit.labels.state'),
                                'state',
                                t('settings.profileEdit.placeholders.state'),
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* Country */}
                            {renderInputField(
                                t('settings.profileEdit.labels.country'),
                                'country',
                                t('settings.profileEdit.placeholders.country'),
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* Zip Code */}
                            {renderInputField(
                                t('settings.profileEdit.labels.zipCode'),
                                'zipCode',
                                t('settings.profileEdit.placeholders.zipCode'),
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* Privacy Notice */}
                            <View className="mt-4 p-4 bg-blue-50 rounded-xl">
                                <View className="flex-row items-start">
                                    <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center mr-3 mt-0.5">
                                        <Ionicons name="shield-checkmark" size={14} color="#3B82F6" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-blue-900 font-medium text-sm mb-1">
                                            {t('settings.profileEdit.privacyTitle')}
                                        </Text>
                                        <Text className="text-blue-700 text-xs leading-4">
                                            {t('settings.profileEdit.privacyText')}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Spacer */}
                            <View className="h-6" />
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default EditAccountModal;