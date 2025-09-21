import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
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
} from "react-native";
import * as yup from "yup";
import { auth, db } from "../../config/firebase";
import { DataContext } from "../../hooks/DataContext";

// Validation schema
const loginSchema = yup.object().shape({
    emailOrPhone: yup
        .string()
        .required("Email or Phone number is required")
        .test(
            "email-or-phone",
            "Enter a valid email address",
            function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            }
        ),
    password: yup.string().required("Password is required").min(6),
});

const Login = () => {
    const navigation = useNavigation();

    const { fetchUserDetails } = useContext(DataContext);

    const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkUserLogined = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserDetails();
                navigation.navigate("Main");
            }
        });
        return checkUserLogined;
    }, []);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validateForm = async () => {
        try {
            await loginSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationErrors) {
            const errorObject = {};
            validationErrors.inner.forEach((error) => {
                errorObject[error.path] = error.message;
            });
            setErrors(errorObject);
            return false;
        }
    };

    // Update last login
    const updateLastLogin = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                updatedAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            });
        } catch (error) {
            console.error("Error updating last login:", error);
        }
    };

    const handleLogin = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        setLoading(true);
        try {
            const isEmail = formData.emailOrPhone.includes("@");
            if (isEmail) {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    formData.emailOrPhone,
                    formData.password
                );
                await updateLastLogin(userCredential.user.uid);
                Alert.alert("Success", "Login successful!");
                fetchUserDetails();
                navigation.navigate("Main");
            } else {
                Alert.alert("Phone Login", "Phone login requires verification.");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.code === "auth/user-not-found") {
                Alert.alert("Error", "No account found with this email.");
            } else if (error.code === "auth/wrong-password") {
                Alert.alert("Error", "Incorrect password.");
            } else {
                Alert.alert("Error", "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-lime-100 to-lime-200">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-1 justify-center px-8 relative">
                        <View className="items-center mb-12">
                            <Text className="text-4xl font-bold tracking-wider text-primaryDark mb-2">
                                KrishiGo
                            </Text>
                        </View>

                        <View className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl">
                            {/* Email/Phone */}
                            <View className="mb-2">
                                <Text className="text-gray-600 text-sm mb-2 font-medium">
                                    Email
                                </Text>
                                <TextInput
                                    className={`w-full bg-white rounded-xl px-4 py-4 text-base border ${errors.emailOrPhone ? "border-red-500" : "border-gray-200"
                                        } shadow-sm`}
                                    placeholder="Enter email or phone"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.emailOrPhone}
                                    onChangeText={(text) =>
                                        handleInputChange("emailOrPhone", text)
                                    }
                                    autoCapitalize="none"
                                />
                                {errors.emailOrPhone && (
                                    <Text className="text-red-500 text-xs mt-1 ml-2">
                                        {errors.emailOrPhone}
                                    </Text>
                                )}
                            </View>

                            {/* Password */}
                            <View className="mb-8">
                                <Text className="text-gray-600 text-sm mb-2 font-medium">
                                    Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className={`w-full bg-white rounded-xl px-4 py-4 pr-12 text-base border ${errors.password ? "border-red-500" : "border-gray-200"
                                            } shadow-sm`}
                                        placeholder="Enter password"
                                        placeholderTextColor="#9CA3AF"
                                        value={formData.password}
                                        onChangeText={(text) => handleInputChange("password", text)}
                                        secureTextEntry={!isPasswordVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        className="absolute right-4 top-4"
                                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        <Ionicons
                                            name={isPasswordVisible ? "eye-off" : "eye"}
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
                                className={`w-full bg-primary rounded-xl py-2 mb-4 shadow-lg ${loading ? "opacity-70" : ""
                                    }`}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                <Text className="text-white text-center tracking-wider text-xl font-semibold">
                                    {loading ? "Logging in..." : "Login"}
                                </Text>
                            </TouchableOpacity>

                            {/* Register Link */}
                            <View className="flex-row justify-center items-center">
                                <Text className="text-gray-600 text-sm">New User? </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate("Register")}
                                >
                                    <Text className="text-primaryDark font-semibold underline">
                                        Register here
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Contact Support */}
                        <View className="items-center mt-8 mb-4">
                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert("Call Support", "Calling 055-599-788...")
                                }
                            >
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