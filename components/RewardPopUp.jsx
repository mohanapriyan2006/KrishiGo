import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

const RewardPopUp = ({ visible, onClose, points = 100 }) => {
    const { t } = useTranslation();
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-white rounded-2xl w-full max-w-sm mx-4 shadow-xl">
                    {/* Header */}
                    <View className="flex-row justify-end items-center p-3">
                        <TouchableOpacity onPress={onClose} className="p-1">
                            <Feather name="x" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <View className="px-6 pb-6 -mt-2 items-center gap-2">
                        <Image source={require('../assets/images/coin_spin.gif')}
                            style={{ width: 100, height: 100 }} />
                        <Text className='text-primaryDark text-2xl font-semibold'>{t('rewards.popup.congrats')}</Text>
                        <Text className='text-gray-600'>{t('rewards.popup.redeemedPoints', { points })}</Text>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default RewardPopUp;