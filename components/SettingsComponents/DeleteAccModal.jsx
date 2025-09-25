import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useContext, useState } from 'react';
import {
    Alert, Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../config/firebase';
import { DataContext } from '../../hooks/DataContext';

const DeleteAccModal = ({ showDeleteModal, setShowDeleteModal, userEmail }) => {

    const { userDetails } = useContext(DataContext);

    const [password, setPassword] = useState('');

    const user = auth.currentUser;

    const navigation = useNavigation();

    const handleDeleteAccount = async () => {
        try {
            await deleteDoc(doc(db, "users", user.uid));
            await user.delete();
            console.log('User account deleted');
            Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
            navigation.navigate('Login');
        } catch (error) {
            console.log('Error deleting user account:', error);
            Alert.alert('Error', 'There was an issue deleting your account. Please try again later.');
        }
    }

    const confirmDeleteAccount = async () => {
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password.');
            return;
        }

        try {
            // Reauthenticate user before deletion
            const credential = EmailAuthProvider.credential(userEmail, password);
            await reauthenticateWithCredential(user, credential);

            // If reauthentication successful, proceed with deletion
            setShowDeleteModal(false);
            setPassword('');
            Alert.alert(
                'Account Deleted',
                'Your account has been successfully deleted.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            handleDeleteAccount();
                        },
                    },
                ]
            );
        } catch (error) {
            console.log('Reauthentication failed:', error);
            Alert.alert(
                'Authentication Failed',
                'The password you entered is incorrect. Please try again.',
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
                        To confirm account deletion, please enter your password:
                    </Text>

                    {/* Password Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry={true}
                            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                            autoFocus={true}
                        />
                        <Text className="text-gray-500 text-sm mt-1">
                            Account: {userEmail}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() => {
                                setShowDeleteModal(false);
                                setPassword('');
                            }}
                            className="flex-1 bg-gray-200 py-3 rounded-xl"
                        >
                            <Text className="text-gray-800 font-semibold text-center">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirmDeleteAccount}
                            className="flex-1 bg-red-600 py-3 rounded-xl"
                            disabled={!password.trim()}
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