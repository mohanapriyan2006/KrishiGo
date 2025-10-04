import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert, Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../config/firebase';

const DeleteAccModal = ({ showDeleteModal, setShowDeleteModal, userEmail }) => {
    const { t } = useTranslation();

    const [password, setPassword] = useState('');

    const user = auth.currentUser;

    const navigation = useNavigation();

    const handleDeleteAccount = async () => {
        try {
            await deleteDoc(doc(db, "users", user.uid));
            await user.delete();
            console.log('User account deleted');
            Alert.alert(t('settings.delete.title'), t('settings.delete.success'));
            navigation.navigate('Login');
        } catch (error) {
            console.log('Error deleting user account:', error);
            Alert.alert(t('common.error'), t('settings.delete.failed'));
        }
    }

    const confirmDeleteAccount = async () => {
        if (!password.trim()) {
            Alert.alert(t('common.error'), t('settings.delete.enterPassword'));
            return;
        }

        try {
            // console.log('Reauthenticating user - password : ', password);
            // Reauthenticate user before deletion
            const credential = EmailAuthProvider.credential(userEmail, password);
            await reauthenticateWithCredential(user, credential);

            // If reauthentication successful, proceed with deletion
            setShowDeleteModal(false);
            setPassword('');
            Alert.alert(
                t('settings.delete.title'),
                t('settings.delete.success'),
                [
                    {
                        text: t('common.ok'),
                        onPress: () => {
                            handleDeleteAccount();
                        },
                    },
                ]
            );
        } catch (error) {
            console.log('Reauthentication failed:', error);
            Alert.alert(
                t('settings.delete.authFailedTitle'),
                t('settings.delete.authFailedText'),
                [{ text: t('settings.delete.tryAgain') }]
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
                        <Text className="text-xl font-bold text-gray-900 text-center">{t('settings.delete.title')}</Text>
                    </View>

                    {/* Warning Text */}
                    <Text className="text-gray-600 text-center mb-6">{t('settings.delete.instructions')}</Text>

                    {/* Password Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">{t('settings.delete.password')}</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder={t('settings.delete.passwordPlaceholder')}
                            secureTextEntry={true}
                            className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                            autoFocus={true}
                        />
                        <Text className="text-gray-500 text-sm mt-1">
                            {t('settings.delete.account')}: {userEmail}
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
                            <Text className="text-gray-800 font-semibold text-center">{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirmDeleteAccount}
                            className="flex-1 bg-red-600 py-3 rounded-xl"
                            disabled={!password.trim()}
                        >
                            <Text className="text-white font-semibold text-center">{t('settings.delete.confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

    )
}

export default DeleteAccModal;