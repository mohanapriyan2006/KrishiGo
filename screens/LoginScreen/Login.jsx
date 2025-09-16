import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
import { auth, db } from '../../config/firebase';

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

const Login = () => {
    const navigation = useNavigation();

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

    // Update last login timestamp in Firestore
    const updateLastLogin = async (userId) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                updatedAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    };

    const handleLogin = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        setLoading(true);
        try {
            // Determine if input is email or phone
            const isEmail = formData.emailOrPhone.includes('@');
            
            if (isEmail) {
                // Login with email
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    formData.emailOrPhone,
                    formData.password
                );
                
                // Update last login timestamp
                await updateLastLogin(userCredential.user.uid);
                
                Alert.alert('Success', 'Login successful!');
                navigation.navigate('Main');
            } else {
                // For phone number login, we need to find the user by phone number first
                // This is a bit more complex as Firebase Auth doesn't support phone number + password login directly
                Alert.alert(
                    'Phone Login',
                    'Phone number login requires verification. Please use email login or implement phone verification.'
                );
            }
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.code === 'auth/user-not-found') {
                Alert.alert('Error', 'No account found with this email. Please register first.');
            } else if (error.code === 'auth/wrong-password') {
                Alert.alert('Error', 'Incorrect password. Please try again.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'Invalid email format. Please check your email address.');
            } else {
                Alert.alert('Error', 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            
            if (!userDoc.exists()) {
                // Create user document if it doesn't exist
                const userNameParts = user.displayName?.split(' ') || ['', ''];
                
                const userData = {
                    authId: user.uid,
                    email: user.email,
                    fullName: user.displayName || '',
                    profilePicture: user.photoURL || '',
                    phoneNumber: user.phoneNumber || '',
                    address: {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: 'India'
                    },
                    rewards: {
                        totalPoints: 0,
                        redeemedPoints: 0
                    },
                    enrolledCourses: [],
                    achievements: [],
                    preferences: {
                        language: 'en',
                        notificationsEnabled: true
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    isGoogleSignIn: true
                };

                await setDoc(doc(db, 'users', user.uid), userData);
            } else {
                // Update last login for existing user
                await updateLastLogin(user.uid);
            }

            Alert.alert('Success', 'Google login successful!');
            navigation.navigate('Main');
        } catch (error) {
            console.error('Google login error:', error);
            Alert.alert('Error', 'Google login failed. Please try again.');
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    const handleCall = () => {
        Alert.alert('Call Support', 'Calling 055-599-788...');
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-lime-100 to-lime-200">
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
                    <View className="flex-1 justify-center px-8 relative">

                        {/* Logo/Title */}
                        <View className="items-center mb-12">
                            <Text className="text-4xl font-bold tracking-wider text-primaryDark mb-2">
                                KrishiGo
                            </Text>
                        </View>

                        {/* Login Form */}
                        <View className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
                            {/* Email/Phone Input */}
                            <View className="mb-2">
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
                                className={`w-full bg-primary rounded-xl py-2 mb-4 shadow-lg ${loading ? 'opacity-70' : ''
                                    }`}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text className="text-white text-center tracking-wider text-xl font-semibold">
                                    {loading ? 'Logging in...' : 'Login'}
                                </Text>
                            </TouchableOpacity>

                            {/* Google Login Button */}
                            <TouchableOpacity
                                className="w-full bg-white border border-gray-200 rounded-xl py-2 mb-6 shadow-sm flex-row items-center justify-center"
                                onPress={handleGoogleLogin}
                                disabled={loading}
                            >
                                <Text className="text-lg mr-2">G</Text>
                                <Text className="text-gray-700 text-base font-medium">
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>

                            {/* Register Link */}
                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600 text-sm">
                                    New User?{' '}
                                </Text>
                                <TouchableOpacity onPress={handleRegister}>
                                    <Text className="text-primaryDark font-semibold underline">
                                        Register here
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Contact Support */}
                        <View className="items-center mt-8 mb-4">
                            <TouchableOpacity onPress={handleCall}>
                                <Text className="text-primaryDark text-base font-medium underline">
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