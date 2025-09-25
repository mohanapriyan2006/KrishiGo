import { Feather, Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
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
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 1) {
            newErrors.lastName = 'Last name must be at least 1 characters';
        }

        // Phone Number validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = formData.phoneNumber.replace(/[\s\-\(\)]/g, '');
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        // City validation
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        // State validation
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }
        // Country validation
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }
        // Street validation
        if (!formData.street.trim()) {
            newErrors.street = 'Street is required';
        }
        // Zip code validation
        if (!formData.zipCode.trim()) {
            newErrors.zipCode = 'Zip code is required';
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
                'Success',
                'Your profile has been updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => setShowEditModal(false)
                    }
                ]
            );
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to update profile. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            fetchUserDetails();
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            firstName: userProfile?.firstName || 'Vijay',
            lastName: userProfile?.lastName || 'Kumar',
            phoneNumber: userProfile?.phoneNumber || '+91 12345-67890',
            location: userProfile?.location || 'Koomapatti',
            street: userProfile?.address?.street || 'Street',
            state: userProfile?.address?.state || 'State',
            country: userProfile?.address?.country || 'Country',
            zipCode: userProfile?.address?.zipCode || 'Zip Code',
        });
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

                            <Text className="text-xl font-bold text-gray-900">Edit Profile</Text>

                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-full ${isLoading ? 'bg-gray-300' : 'bg-primary'
                                    }`}
                            >
                                {isLoading ? (
                                    <View className="flex-row items-center">
                                        <Text className="text-white font-semibold mr-2">Saving</Text>
                                        <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </View>
                                ) : (
                                    <Text className="text-white font-semibold">Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Form Content */}
                        <ScrollView
                            className="flex-1 px-6 py-4"
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text className="text-gray-600 text-sm mb-6">
                                Update your profile information below
                            </Text>

                            {/* Profile Picture Section */}
                            <View className="items-center mb-6">
                                <View className="w-24 h-24 bg-lime-200 rounded-full items-center justify-center mb-3">
                                    <Ionicons name="person" size={40} color="#314C1C" />
                                </View>
                                <TouchableOpacity className="bg-primary px-4 py-2 rounded-full">
                                    <Text className="text-white font-medium">Change Photo</Text>
                                </TouchableOpacity>
                            </View>

                            {/* First Name */}
                            {renderInputField(
                                'First Name',
                                'firstName',
                                'Enter your first name',
                                'default',
                                <Ionicons name="person-outline" size={20} color="#6B7280" />
                            )}

                            {/* Last Name */}
                            {renderInputField(
                                'Last Name',
                                'lastName',
                                'Enter your last name',
                                'default',
                                <Ionicons name="person-outline" size={20} color="#6B7280" />
                            )}

                            {/* Phone Number */}
                            {renderInputField(
                                'Phone Number',
                                'phoneNumber',
                                'Enter your phone number',
                                'phone-pad',
                                <Feather name="phone" size={20} color="#6B7280" />
                            )}

                            {/* Street */}
                            {renderInputField(
                                'Street',
                                'street',
                                'Enter your street',
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* City */}
                            {renderInputField(
                                'City',
                                'city',
                                'Enter your city',
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* State */}
                            {renderInputField(
                                'State',
                                'state',
                                'Enter your state',
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* Country */}
                            {renderInputField(
                                'Country',
                                'country',
                                'Enter your country',
                                'default',
                                <Ionicons name="location-outline" size={20} color="#6B7280" />
                            )}

                            {/* Zip Code */}
                            {renderInputField(
                                'Zip Code',
                                'zipCode',
                                'Enter your zip code',
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
                                            Privacy & Security
                                        </Text>
                                        <Text className="text-blue-700 text-xs leading-4">
                                            Your personal information is encrypted and securely stored.
                                            We never share your data with third parties without your consent.
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