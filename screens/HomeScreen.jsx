import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";
import RoundProgress from "../components/RoundProgress";
import { DataContext } from "../hooks/DataContext";


export default function Home() {
	const navigation = useNavigation();
	const { t } = useTranslation();

	// Government schemes data with translation keys
	const governmentSchemes = [
		{
			id: 1,
			title: t("schemes.pmKisan.title"),
			description: t("schemes.pmKisan.description"),
			amount: t("schemes.pmKisan.amount"),
			deadline: t("schemes.pmKisan.deadline"),
			status: t("schemes.pmKisan.status"),
			image: require("../assets/images/schemes/pm-kisan.jpg"),
			link: "https://pmkisan.gov.in/"
		},
		{
			id: 2,
			title: t("schemes.kcc.title"),
			description: t("schemes.kcc.description"),
			amount: t("schemes.kcc.amount"),
			deadline: t("schemes.kcc.deadline"),
			status: t("schemes.kcc.status"),
			image: require("../assets/images/schemes/kcc-loan.jpg"),
			link: "https://www.pmkisan.gov.in/Documents/KCC.pdf"
		},
		{
			id: 3,
			title: t("schemes.pmfby.title"),
			description: t("schemes.pmfby.description"),
			amount: t("schemes.pmfby.amount"),
			deadline: t("schemes.pmfby.deadline"),
			status: t("schemes.pmfby.status"),
			image: require("../assets/images/schemes/pmp-crop.jpg"),
			link: "https://pmfby.gov.in/"
		},
		{
			id: 4,
			title: t("schemes.shc.title"),
			description: t("schemes.shc.description"),
			amount: t("schemes.shc.amount"),
			deadline: t("schemes.shc.deadline"),
			status: t("schemes.shc.status"),
			image: require("../assets/images/schemes/soil-health-card.jpg"),
			link: "https://soilhealth.dac.gov.in/"
		},
		{
			id: 5,
			title: t("schemes.eNam.title"),
			description: t("schemes.eNam.description"),
			amount: t("schemes.eNam.amount"),
			deadline: t("schemes.eNam.deadline"),
			status: t("schemes.eNam.status"),
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
						<Text className="text-base text-[#666]">{t("home.greeting")}</Text>
						<Text className="text-3xl font-bold text-primaryDark">
							{userDetails?.firstName || t("home.user")} !
						</Text>
					</View>
					<Image
						source={require("../assets/images/welcome_img.png")}
						style={{ width: 180, height: 150 }}
					/>
				</View>

				{/* Green Action Bar */}
				<View className="flex-row bg-primary rounded-2xl py-4 px-2 justify-around mb-5 shadow-lg">
					<TouchableOpacity
						className="items-center"
						onPress={() => navigation.navigate("Journey")}
					>
						<View className={HomeStyles.quickActions.iconView}>
							<Ionicons
								name="school"
								size={30}
								color={HomeStyles.quickActions.iconColor}
							/>
						</View>
						<Text className={HomeStyles.quickActions.text}>
							{t("home.myCourse")}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="items-center"
						onPress={() => navigation.navigate("Rewards")}
					>
						<View className={HomeStyles.quickActions.iconView}>
							<Ionicons
								name="gift"
								size={30}
								color={HomeStyles.quickActions.iconColor}
							/>
						</View>
						<Text className={HomeStyles.quickActions.text}>
							{t("home.rewards")}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="items-center"
						onPress={() => navigation.navigate("SavedCourses")}
					>
						<View className={HomeStyles.quickActions.iconView}>
							<Ionicons
								name="heart"
								size={30}
								color={HomeStyles.quickActions.iconColor}
							/>
						</View>
						<Text className={HomeStyles.quickActions.text}>
							{t("home.wishlist")}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="items-center"
						onPress={() => navigation.navigate("SearchCourses")}
					>
						<View className={HomeStyles.quickActions.iconView}>
							<Ionicons
								name="search"
								size={30}
								color={HomeStyles.quickActions.iconColor}
							/>
						</View>
						<Text className={HomeStyles.quickActions.text}>
							{t("home.search")}
						</Text>
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
						<Text className="text-base  text-[#333] mb-1">
							{t("home.sustainabilityScore")}
						</Text>
						<Text className="text-[14px] font-bold text-black mb-1">
							{t("home.scoreBest")}
						</Text>
						<Text className="text-sm font-medium text-primary mb-2">
							{t("home.growingStrong")}
						</Text>
						<TouchableOpacity
							className="bg-primary py-2 px-4 rounded-xl self-start"
							onPress={() => navigation.navigate("Challenge")}
						>
							<Text className="text-white text-xs font-medium">
								{t("home.improveNow")}
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Badges Section */}
				<View className="mb-6">
					<View className="flex-row justify-between items-center mb-4 px-2">
						<Text className="text-lg font-bold text-primaryDark">
							{t("home.yourBadges")}
						</Text>
						<Text className="text-sm text-primary font-medium">
							{t("home.badgesEarned", { count: userBadges.length })}
						</Text>
					</View>

					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="px-2"
					>
						{userBadges.map((badge) => (
							<TouchableOpacity
								key={badge.id}
								className="bg-white rounded-full mr-3 my-2 border-dashed border border-primary items-center shadow-lg"
								activeOpacity={0.8}
							>
								<View className="bg-primary/10 p-2 rounded-full">
									<Image
										source={badge.image}
										className="w-[100px] h-[100px]"
										resizeMode="contain"
									/>
								</View>
							</TouchableOpacity>
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
						<Text className="text-lg font-bold text-primaryDark">
							{t("home.governmentSchemes")}
						</Text>
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
									<Text
										className="text-base font-bold text-primaryDark mb-2"
										numberOfLines={2}
									>
										{scheme.title}
									</Text>
									<Text
										className="text-sm text-gray-600 mb-3"
										numberOfLines={2}
									>
										{scheme.description}
									</Text>

									<View className="flex-row justify-between items-center mb-3">
										<View className="flex-row items-center">
											<Ionicons name="cash-outline" size={16} color="#78BB1B" />
											<Text className="text-primary font-bold ml-1">
												{scheme.amount}
											</Text>
										</View>
										<View className="flex-row items-center">
											<Ionicons name="time-outline" size={16} color="#666" />
											<Text className="text-gray-600 text-xs ml-1">
												{scheme.deadline}
											</Text>
										</View>
									</View>

									<TouchableOpacity onPress={() => openExternalLink(scheme.link)} className="bg-primary py-2 px-4 rounded-lg">
										<Text className="text-white text-center font-medium text-sm">
											{t("home.learnMore")}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</ScrollView>
				</View>

				{/* Invite & Earn */}
				<TouchableOpacity
					onPress={() => navigation.navigate("Rewards")}
					activeOpacity={0.7}
				>
					<View className="flex-row bg-[#67b00019] rounded-2xl p-5 mx-2 mb-10 items-center">
						<Image
							source={require("../assets/images/invite.png")}
							style={{
								width: 100,
								height: 90,
								resizeMode: "contain",
								marginLeft: 10,
							}}
						/>
						<View className="flex-1">
							<Text className="text-base font-bold text-[#333] mb-1">
								{t("home.inviteEarn")}
							</Text>
							<Text className="text-sm text-[#666] mb-1">
								{t("home.shareCollect")}
							</Text>
							<Text className="text-xs text-[#999]">
								{t("home.earnRewards")}
							</Text>
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
		text: "text-white text-sm mt-1 font-medium",
	},
};
