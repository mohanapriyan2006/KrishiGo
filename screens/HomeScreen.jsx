import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import FloatingAIButton from '../components/FloatingAIButton';
import RoundProgress from '../components/RoundProgress';

export default function Home() {


    return (
        <ScrollView className="flex-1 bg-[#f5f5f5]">
            <View className="p-5 pb-30 pt-[50px]">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-5">
                    <View className="p-8">
                        <Text className="text-base text-[#666]">Good Morning</Text>
                        <Text className="text-3xl font-bold text-primaryDark">Vijay !</Text>
                    </View>
                    <Image source={require('../assets/images/welcome_img.png')} style={{ width: 180, height: 150 }} />
                </View>

                {/* Green Action Bar */}
                <View className="flex-row bg-primary rounded-2xl py-4 px-2 justify-around mb-5 shadow">
                    <TouchableOpacity className="items-center">
                        <View className={HomeStyles.quickActions.iconView}>
                            <Ionicons name="school" size={30} color={HomeStyles.quickActions.iconColor} />
                        </View>
                        <Text className={HomeStyles.quickActions.text}>My Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <View className={HomeStyles.quickActions.iconView}>
                            <Ionicons name="gift" size={30} color={HomeStyles.quickActions.iconColor} />
                        </View>
                        <Text className={HomeStyles.quickActions.text}>Rewards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <View className={HomeStyles.quickActions.iconView}>
                            <Ionicons name="heart" size={30} color={HomeStyles.quickActions.iconColor} />
                        </View>
                        <Text className={HomeStyles.quickActions.text}>Favorite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center">
                        <View className={HomeStyles.quickActions.iconView}>
                            <Ionicons name="search" size={30} color={HomeStyles.quickActions.iconColor} />
                        </View>
                        <Text className={HomeStyles.quickActions.text}>Search</Text>
                    </TouchableOpacity>
                </View>

                {/* Sustainability Score */}
                <View className="flex-row p-10">
                    <View className="mr-10 flex-1/3 items-center justify-center">
                        <RoundProgress
                            progress={80}
                            size={120}
                            showPercentage={true}
                            className="mb-2"
                        />
                    </View>
                    <View className="flex-2/3 justify-center">
                        <Text className="text-base  text-[#333] mb-1">Sustainability Score</Text>
                        <Text className="text-[14px] font-bold text-black mb-1">Best : 70 - 100%</Text>
                        <Text className="text-sm font-medium text-primary mb-2">Growing Strong 🌱</Text>
                        <TouchableOpacity className="bg-primary py-2 px-4 rounded-xl self-start">
                            <Text className="text-white text-xs font-medium">Improve Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Divider */}
                <View className="items-center mb-8">
                    <View className="w-80 h-0.5 bg-gray-300"></View>
                </View>

                {/* Invite & Earn */}
                <View className="flex-row bg-[#67b00019] rounded-2xl p-5 mx-2 items-center">
                    <Image source={require('../assets/images/invite.png')} style={{ width: 100, height: 90, resizeMode: 'contain', marginLeft: 10 }} />
                    <View className="flex-1">
                        <Text className="text-base font-bold text-[#333] mb-1">Invite & Earn</Text>
                        <Text className="text-sm text-[#666] mb-1">Share & Collect Rewards</Text>
                        <Text className="text-xs text-[#999]">Earn ₹/coin! | Refer Points | Make a Preorder | Grow Vegetation</Text>
                    </View>
                    <View className="bg-primary w-10 h-10 rounded-full justify-center items-center">
                        <Text className="text-white text-xs font-bold">₹1</Text>
                    </View>
                </View>
            </View>

            <FloatingAIButton/>
        </ScrollView>
    );
}


const HomeStyles = {
    quickActions: {
        iconView: "bg-yellow-100/80 p-2.5 rounded-full mb-1",
        iconColor: "#314C1C",
        text: "text-white text-sm mt-1 font-medium"
    }
}