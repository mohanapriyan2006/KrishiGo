import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import RoundProgress from '../components/RoundProgress';
import { DataContext } from '../hooks/DataContext';

export default function Home() {

    const navigation = useNavigation();

    // Dummy government schemes data
    const governmentSchemes = [
    {
        id: 1,
        title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        description: "Direct income support of ₹6000 per year to small and marginal farmers",
        amount: "₹6,000/year",
        deadline: "31 Dec 2024",
        status: "Active",
        image: require("../assets/images/schemes/pm-kisan.jpg"),
        link: "https://pmkisan.gov.in/"
    },
    {
        id: 2,
        title: "Kisan Credit Card (KCC)",
        description: "Easy access to credit for farmers at subsidized interest rates",
        amount: "Up to ₹3 Lakh",
        deadline: "Ongoing",
        status: "Apply Now",
        image: require("../assets/images/schemes/kcc-loan.jpg"),
        link: "https://www.pmkisan.gov.in/Documents/KCC.pdf"
    },
    {
        id: 3,
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        description: "Crop insurance scheme to protect farmers from crop losses",
        amount: "Premium: 2-5%",
        deadline: "15 Jan 2025",
        status: "Limited Time",
        image: require("../assets/images/schemes/pmp-crop.jpg"),
        link: "https://pmfby.gov.in/"
    },
    {
        id: 4,
        title: "Soil Health Card Scheme",
        description: "Free soil testing and nutrient management recommendations",
        amount: "Free Service",
        deadline: "Ongoing",
        status: "Available",
        image: require("../assets/images/schemes/soil-health-card.jpg"),
        link: "https://soilhealth.dac.gov.in/"
    },
    {
        id: 5,
        title: "National Agriculture Market (e-NAM)",
        description: "Online trading platform for agricultural commodities",
        amount: "Better Prices",
        deadline: "Ongoing",
        status: "Join Now",
        image: require("../assets/images/schemes/e-nam.jpg"),
        link: "https://enam.gov.in/web/"
    }
];


    const openExternalLink = async (url) => {
        if (!url) return;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            }
        } catch (e) {
            console.log("Error", "Failed to open link : ", e);
        }
    };



    // Add dummy badges data
    const userBadges = [
        {
            id: 1,
            image: require('../assets/images/badges/first-harvest.png'),
        },
        {
            id: 2,
            image: require('../assets/images/badges/green-thumb.png'),
        },
        {
            id: 3,
            image: require('../assets/images/badges/early-bird.png'),
        },
        {
            id: 4,
            image: require('../assets/images/badges/harvest-helper.png'),
        }
    ];

    const { userDetails } = useContext(DataContext);

    return (
        <ScrollView className="flex-1 bg-[#f5f5f5]">
            <View className="p-5 mb-10 pt-[50px]">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-5">
                    <View className="p-8">
                        <Text className="text-base text-[#666]">Good Morning</Text>
                        <Text className="text-3xl font-bold text-primaryDark">{userDetails?.firstName || "User"} !</Text>
                    </View>
                    <Image source={require('../assets/images/welcome_img.png')} style={{ width: 180, height: 150 }} />
                </View>

                {/* Green Action Bar */}
                <View className="flex-row bg-primary rounded-2xl py-4 px-2 justify-around mb-5 shadow-lg">
                    <TouchableOpacity className="items-center"
                        onPress={() => navigation.navigate('Journey')}>
                        <View className={HomeStyles.quickActions.iconView}>
                            <Ionicons name="school" size={30} color={HomeStyles.quickActions.iconColor} />
                        </View>
                        <Text className={HomeStyles.quickActions.text}>My Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center"
                        onPress={() => navigation.navigate('Rewards')}>
                        <View className={HomeStyles.quickActions.iconView}>
                            <Ionicons name="gift" size={30} color={HomeStyles.quickActions.iconColor} />
                        </View>
                        <Text className={HomeStyles.quickActions.text}>Rewards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center"
                        onPress={() => navigation.navigate('SavedCourses')}>
                        <View className={HomeStyles.quickActions.iconView}>
                            <Ionicons name="heart" size={30} color={HomeStyles.quickActions.iconColor} />
                        </View>
                        <Text className={HomeStyles.quickActions.text}>Wishlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="items-center"
                        onPress={() => navigation.navigate('SearchCourses')}>
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
                        <TouchableOpacity className="bg-primary py-2 px-4 rounded-xl self-start"
                            onPress={() => navigation.navigate('Challenge')}>
                            <Text className="text-white text-xs font-medium">Improve Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Badges Section */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4 px-2">
                        <Text className="text-lg font-bold text-primaryDark">Your Badges</Text>
                        <Text className="text-sm text-primary font-medium">{userBadges.length} Earned</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-2"
                    >
                        {userBadges.map((badge) => (
                            <View
                                key={badge.id}
                                className="bg-white rounded-full mr-3 my-2 border-dashed border border-primary items-center shadow-lg"
                            >
                                <View className="bg-primary/10 p-2 rounded-full">
                                    <Image
                                        source={badge.image}
                                        className="w-[100px] h-[100px]"
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Divider */}
                <View className="items-center mb-8">
                    <View className="w-80 h-0.5 bg-gray-300"></View>
                </View>

                {/* Government Schemes Slider Section */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4 px-2">
                        <Text className="text-lg font-bold text-primaryDark">Latest Government Schemes</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="p-2"
                    >
                        {governmentSchemes.map((scheme) => (
                            <View
                                key={scheme.id}
                                className="bg-white p-2 rounded-2xl mr-4"
                                style={{ width: 280 }}
                            >
                                <View className="relative">
                                    <Image
                                        source={scheme.image}
                                        className="w-full h-32 rounded-t-2xl"
                                        resizeMode="cover"
                                    />

                                </View>

                                <View className="p-4">
                                    <Text className="text-base font-bold text-primaryDark mb-2" numberOfLines={2}>
                                        {scheme.title}
                                    </Text>
                                    <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                                        {scheme.description}
                                    </Text>

                                    <View className="flex-row justify-between items-center mb-3">
                                        <View className="flex-row items-center">
                                            <Ionicons name="cash-outline" size={16} color="#78BB1B" />
                                            <Text className="text-primary font-bold ml-1">{scheme.amount}</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Ionicons name="time-outline" size={16} color="#666" />
                                            <Text className="text-gray-600 text-xs ml-1">{scheme.deadline}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity className="bg-primary py-2 px-4 rounded-lg" onPress={() => openExternalLink(scheme.link)}>
                                        <Text className="text-white text-center font-medium text-sm">Learn More</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Invite & Earn */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Rewards')}
                    activeOpacity={0.7}
                >
                    <View className="flex-row bg-[#67b00019] rounded-2xl p-5 mx-2 mb-10 items-center">
                        <Image source={require('../assets/images/invite.png')} style={{ width: 100, height: 90, resizeMode: 'contain', marginLeft: 10 }} />
                        <View className="flex-1">
                            <Text className="text-base font-bold text-[#333] mb-1">Invite & Earn</Text>
                            <Text className="text-sm text-[#666] mb-1">Share & Collect Rewards</Text>
                            <Text className="text-xs text-[#999]">Earn ₹/coin! | Refer Points | Make a Preorder | Grow Vegetation</Text>
                        </View>
                        <View className="bg-primary w-10 h-10 rounded-full justify-center items-center">
                            <Text className="text-white text-xs font-bold">₹50</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

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