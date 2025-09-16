import { MaterialIcons } from '@expo/vector-icons';
import {
    Alert, Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const DeleteAccModal = ({ showDeleteModal, setShowDeleteModal, phoneNumber, setPhoneNumber, userPhoneNumber }) => {

    const confirmDeleteAccount = () => {
        const normalizedUserPhone = userPhoneNumber.replace(/[\s-]/g, '');
        const normalizedInputPhone = phoneNumber.replace(/[\s-]/g, '');

        if (normalizedInputPhone === normalizedUserPhone) {
            setShowDeleteModal(false);
            setPhoneNumber('');
            Alert.alert(
                'Account Deleted',
                'Your account has been successfully deleted.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            console.log('Account deletion confirmed');
                            // Handle account deletion logic here
                            // Navigate to login screen or perform logout
                        },
                    },
                ]
            );
        } else {
            Alert.alert(
                'Phone Number Mismatch',
                'The phone number you entered does not match your registered phone number.',
                [{ text: 'Try Again' }]
            );
        }
    };

    return (
        <Modal
            visible={showDeleteModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDeleteModal(false)}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-6">
                <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                    {/* Warning Icon */}
                    <View className="items-center mb-4">
                        <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
                            <MaterialIcons name="warning" size={32} color="#EF4444" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 text-center">Delete Account</Text>
                    </View>

                    {/* Warning Text */}
                    <Text className="text-gray-600 text-center mb-6">
                        To confirm account deletion, please enter your phone number:
                    </Text>

                    {/* Phone Number Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>
                        <TextInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                            autoFocus={true}
                        />
                        <Text className="text-gray-500 text-sm mt-1">
                            Registered: {userPhoneNumber}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => {
                                setShowDeleteModal(false);
                                setPhoneNumber('');
                            }}
                            className="flex-1 bg-gray-200 py-3 rounded-xl"
                        >
                            <Text className="text-gray-800 font-semibold text-center">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirmDeleteAccount}
                            className="flex-1 bg-red-600 py-3 rounded-xl"
                            disabled={!phoneNumber.trim()}
                        >
                            <Text className="text-white font-semibold text-center">Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

export default DeleteAccModal;