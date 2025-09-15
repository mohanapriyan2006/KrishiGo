import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import UpiModal from './RedeemScreen/UpiModal';
import CouponModal from './RedeemScreen/CouponModal';
import GadgetsModal from './RedeemScreen/GadgetsModal';

const RedeemScreen = ({ visible, onClose, totalPoints }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    
    // Modal states
    const [upiModalVisible, setUpiModalVisible] = useState(false);
    const [couponModalVisible, setCouponModalVisible] = useState(false);
    const [gadgetsModalVisible, setGadgetsModalVisible] = useState(false);

    const categories = [
        { id: 'all', name: 'All', icon: 'apps-outline' },
        { id: 'money', name: 'Real Money', icon: 'cash-outline' },
        { id: 'coupons', name: 'Coupons', icon: 'gift-outline' },
        { id: 'gadgets', name: 'Gadgets', icon: 'phone-portrait-outline' },
    ];

    const redeemOptions = {
        money: [
            { id: 1, title: 'UPI Transfer', description: 'Direct UPI money transfer', points: 1000, value: '₹100', type: 'upi', icon: 'cash-outline' },
            { id: 2, title: 'UPI Transfer', description: 'Direct UPI money transfer', points: 2500, value: '₹250', type: 'upi', icon: 'cash-outline' },
            { id: 3, title: 'UPI Transfer', description: 'Direct UPI money transfer', points: 5000, value: '₹500', type: 'upi', icon: 'cash-outline' },
            { id: 4, title: 'UPI Transfer', description: 'Direct UPI money transfer', points: 10000, value: '₹1000', type: 'upi', icon: 'cash-outline' },
        ],
        coupons: [
            { id: 5, title: 'Amazon Voucher', description: '₹500 Amazon gift card', points: 4500, value: '₹500', type: 'amazon', icon: 'bag-outline' },
            { id: 6, title: 'Flipkart Voucher', description: '₹250 Flipkart gift card', points: 2250, value: '₹250', type: 'flipkart', icon: 'storefront-outline' },
            { id: 7, title: 'Zomato Voucher', description: '₹200 food delivery voucher', points: 1800, value: '₹200', type: 'zomato', icon: 'restaurant-outline' },
            { id: 8, title: 'BookMyShow', description: 'Movie tickets voucher', points: 1500, value: '₹300', type: 'bms', icon: 'film-outline' },
            { id: 9, title: 'Swiggy Voucher', description: '₹150 food delivery voucher', points: 1350, value: '₹150', type: 'swiggy', icon: 'bicycle-outline' },
        ],
        gadgets: [
            { id: 10, title: 'Wireless Earbuds', description: 'Bluetooth 5.0 earbuds', points: 15000, value: '₹1500', type: 'earbuds', icon: 'headset-outline' },
            { id: 11, title: 'Power Bank', description: '10000mAh portable charger', points: 12000, value: '₹1200', type: 'powerbank', icon: 'battery-charging-outline' },
            { id: 12, title: 'Smartphone Holder', description: 'Adjustable phone stand', points: 3000, value: '₹300', type: 'stand', icon: 'phone-portrait-outline' },
            { id: 13, title: 'USB Cable Set', description: 'Multi-port charging cables', points: 2000, value: '₹200', type: 'cables', icon: 'flash-outline' },
            { id: 14, title: 'Bluetooth Speaker', description: 'Portable wireless speaker', points: 20000, value: '₹2000', type: 'speaker', icon: 'volume-high-outline' },
            { id: 15, title: 'Smart Watch', description: 'Fitness tracking smartwatch', points: 35000, value: '₹3500', type: 'watch', icon: 'watch-outline' },
        ],
    };

    const handleCategorySelect = () => {
        if (selectedCategory === 'all') {
            return [...redeemOptions.money, ...redeemOptions.coupons, ...redeemOptions.gadgets];
        }
        return redeemOptions[selectedCategory];
    };

    const handleRedeemItem = (item) => {
        if (totalPoints < item.points) {
            // Simple alert without importing Alert
            console.log('Insufficient Points', `You need ${item.points} points to redeem this item. You currently have ${totalPoints} points.`);
            return;
        }
        
        setSelectedItem(item);
        
        // Open appropriate modal based on item type
        if (item.type === 'upi') {
            setUpiModalVisible(true);
        } else if (['amazon', 'flipkart', 'zomato', 'bms', 'swiggy'].includes(item.type)) {
            setCouponModalVisible(true);
        } else if (['earbuds', 'powerbank', 'stand', 'cables', 'speaker', 'watch'].includes(item.type)) {
            setGadgetsModalVisible(true);
        }
    };

    const handleModalConfirm = () => {
        // Handle successful redemption - could update total points here
        console.log('Redemption successful for:', selectedItem?.title);
    };

    const renderRedeemItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            onPress={() => handleRedeemItem(item)}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 bg-lime-100 rounded-full items-center justify-center mr-3">
                        <Ionicons name={item.icon} size={24} color="#357900" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-900 font-semibold text-base">{item.title}</Text>
                        <Text className="text-gray-600 text-sm mt-1">{item.description}</Text>
                        <View className="flex-row items-center mt-2">
                            <Text className="text-primary font-bold text-sm">{item.value}</Text>
                            <Text className="text-gray-500 text-xs ml-2">• {item.points} points</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    className={`px-4 py-2 rounded-lg ${totalPoints >= item.points ? 'bg-primary' : 'bg-gray-300'}`}
                    onPress={() => handleRedeemItem(item)}
                    disabled={totalPoints < item.points}
                >
                    <Text className={`font-medium text-sm ${totalPoints >= item.points ? 'text-white' : 'text-gray-500'}`}>
                        Redeem
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <SafeAreaView className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white px-6 py-4 border-b border-gray-200">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-2xl font-bold text-gray-900">Redeem Points</Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <Ionicons name="close" size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center mt-2">
                        <Image source={require('../assets/images/Coin.png')} style={{ width: 20, height: 20 }} />
                        <Text className="text-primary font-bold text-lg ml-2">{totalPoints?.toLocaleString()} points available</Text>
                    </View>
                </View>

                {/* Category Tabs */}
                <View className="bg-white px-6 py-3">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    className={`flex-row items-center px-4 py-2 rounded-full ${selectedCategory === category.id
                                        ? 'bg-primary'
                                        : 'bg-gray-200'
                                        }`}
                                    onPress={() => setSelectedCategory(category.id)}
                                >
                                    <Ionicons
                                        name={category.icon}
                                        size={18}
                                        color={selectedCategory === category.id ? 'white' : '#6b7280'}
                                    />
                                    <Text
                                        className={`ml-2 font-medium ${selectedCategory === category.id
                                            ? 'text-white'
                                            : 'text-gray-600'
                                            }`}
                                    >
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Redeem Options */}
                <View className="flex-1 px-6 py-4">
                    <FlatList
                        data={handleCategorySelect()}
                        renderItem={renderRedeemItem}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                {/* UPI Modal */}
                <UpiModal
                    visible={upiModalVisible}
                    onClose={() => setUpiModalVisible(false)}
                    selectedItem={selectedItem}
                    onConfirm={handleModalConfirm}
                />

                {/* Coupon Modal */}
                <CouponModal
                    visible={couponModalVisible}
                    onClose={() => setCouponModalVisible(false)}
                    selectedItem={selectedItem}
                    onConfirm={handleModalConfirm}
                />

                {/* Gadgets Modal */}
                <GadgetsModal
                    visible={gadgetsModalVisible}
                    onClose={() => setGadgetsModalVisible(false)}
                    selectedItem={selectedItem}
                    onConfirm={handleModalConfirm}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default RedeemScreen;
