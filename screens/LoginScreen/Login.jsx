import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import * as yup from 'yup';

// Validation schema
const loginSchema = yup.object().shape({
    emailOrPhone: yup
        .string()
        .required('Email or Phone number is required')
        .test('email-or-phone', 'Enter a valid email or phone number', function (value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10}$/;
            return emailRegex.test(value) || phoneRegex.test(value);
        }),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

const Login = ({ setIsLogined }) => {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const validateForm = async () => {
        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationErrors) {
            const errorObject = {};
            validationErrors.inner.forEach(error => {
                errorObject[error.path] = error.message;
            });
            setErrors(errorObject);
            return false;
        }
    };

    const handleLogin = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            Alert.alert('Success', 'Login successful!');
            setIsLogined(true);
            // Navigate to home screen
        } catch (_error) {
            Alert.alert('Error', 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        Alert.alert('Google Login', 'Google login functionality will be implemented here');
    };

    const handleRegister = () => {
        Alert.alert('Register', 'Navigate to registration screen');
    };

    const handleCall = () => {
        Alert.alert('Call Support', 'Calling 055-599-788...');
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-green-100 to-green-200">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View className="flex-1 justify-center px-8">
                        {/* Logo/Title */}
                        <View className="items-center mb-12">
                            <Text className="text-4xl font-bold text-green-700 mb-2">
                                KrishiGo
                            </Text>
                        </View>

                        {/* Login Form */}
                        <View className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
                            {/* Email/Phone Input */}
                            <View className="mb-6">
                                <Text className="text-gray-600 text-sm mb-2 font-medium">
                                    Email or Phone number
                                </Text>
                                <TextInput
                                    className={`w-full bg-white rounded-xl px-4 py-4 text-base border ${errors.emailOrPhone ? 'border-red-500' : 'border-gray-200'
                                        } shadow-sm`}
                                    placeholder="Enter email or phone number"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.emailOrPhone}
                                    onChangeText={(text) => handleInputChange('emailOrPhone', text)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                {errors.emailOrPhone && (
                                    <Text className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.emailOrPhone}
                                    </Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View className="mb-8">
                                <Text className="text-gray-600 text-sm mb-2 font-medium">
                                    Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className={`w-full bg-white rounded-xl px-4 py-4 pr-12 text-base border ${errors.password ? 'border-red-500' : 'border-gray-200'
                                            } shadow-sm`}
                                        placeholder="Enter password"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.password}
                                        onChangeText={(text) => handleInputChange('password', text)}
                                        secureTextEntry={!isPasswordVisible}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        className="absolute right-4 top-4"
                                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        <Ionicons
                                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                                            size={20}
                                            color="#9CA3AF"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.password && (
                                    <Text className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.password}
                                    </Text>
                                )}
                            </View>

                            {/* Login Button */}
                            <TouchableOpacity
                                className={`w-full bg-green-600 rounded-xl py-4 mb-4 shadow-lg ${loading ? 'opacity-70' : ''
                                    }`}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text className="text-white text-center text-lg font-semibold">
                                    {loading ? 'Logging in...' : 'Login'}
                                </Text>
                            </TouchableOpacity>

                            {/* Google Login Button */}
                            <TouchableOpacity
                                className="w-full bg-white border border-gray-200 rounded-xl py-4 mb-6 shadow-sm flex-row items-center justify-center"
                                onPress={handleGoogleLogin}
                            >
                                <Text className="text-lg mr-2">G</Text>
                                <Text className="text-gray-700 text-base font-medium">
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>

                            {/* Register Link */}
                            <View className="items-center">
                                <Text className="text-gray-600 text-sm">
                                    New User?{' '}
                                    <TouchableOpacity onPress={handleRegister}>
                                        <Text className="text-green-600 font-semibold underline">
                                            Register here
                                        </Text>
                                    </TouchableOpacity>
                                </Text>
                            </View>
                        </View>

                        {/* Contact Support */}
                        <View className="items-center mt-8 mb-4">
                            <TouchableOpacity onPress={handleCall}>
                                <Text className="text-gray-700 text-base font-medium underline">
                                    Call us : 055-599-788
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;