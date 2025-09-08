import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
    return (
        <ScrollView className="flex-1 bg-[#f5f5f5]">
            <View className="p-5 pb-24">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-5">
                    <View>
                        <Text className="text-base text-[#666]">Good Morning</Text>
                        <Text className="text-2xl font-bold text-[#333]">Vijay !</Text>
                    </View>
                    <View className="bg-white p-2.5 rounded-full shadow">
                        <Ionicons name="bicycle" size={40} color="#FF6B35" />
                    </View>
                </View>

                {/* Green Action Bar */}
                <View className="flex-row bg-[#8BC34A] rounded-2xl py-4 px-2 justify-around mb-5 shadow">
                    <TouchableOpacity className="items-center">
                        <View className="bg-green-100/40 p-2.5 rounded-full mb-1 shadow">
                            <Ionicons name="school" size={24} color="white" />
                        </View>
                        <Text className="text-white text-xs mt-1 font-medium">My Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Ionicons name="gift" size={24} color="white" />
                        <Text className="text-white text-xs mt-1 font-medium">Rewards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Ionicons name="heart" size={24} color="white" />
                        <Text className="text-white text-xs mt-1 font-medium">Favorite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <Ionicons name="search" size={24} color="white" />
                        <Text className="text-white text-xs mt-1 font-medium">Search</Text>
                    </TouchableOpacity>
                </View>

                {/* Sustainability Score */}
                <View className="flex-row bg-white rounded-xl p-5 mb-5 shadow">
                    <View className="mr-5">
                        <View className="w-20 h-20 rounded-full bg-[#8BC34A] justify-center items-center">
                            <Text className="text-2xl font-bold text-white">60%</Text>
                        </View>
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-[#333] mb-1">Sustainability Score</Text>
                        <Text className="text-sm text-[#666] mb-1">Best : 70 - 100%</Text>
                        <Text className="text-sm text-[#8BC34A] mb-2">Growing Strong 🌱</Text>
                        <TouchableOpacity className="bg-[#8BC34A] py-2 px-4 rounded-xl self-start">
                            <Text className="text-white text-xs font-medium">Improve Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Invite & Earn */}
                <View className="flex-row bg-[#FFF3E0] rounded-xl p-5 items-center shadow">
                    <View className="bg-[#FFE0B2] p-2.5 rounded-lg mr-4">
                        <Ionicons name="mail" size={30} color="#FF6B35" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-[#333] mb-1">Invite & Earn</Text>
                        <Text className="text-sm text-[#666] mb-1">Share & Collect Rewards</Text>
                        <Text className="text-xs text-[#999]">Earn ₹/coin! | Refer Points | Make a Preorder | Grow Vegetation</Text>
                    </View>
                    <View className="bg-[#8BC34A] w-10 h-10 rounded-full justify-center items-center">
                        <Text className="text-white text-xs font-bold">₹1</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}