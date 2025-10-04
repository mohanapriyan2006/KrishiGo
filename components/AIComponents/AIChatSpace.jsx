import { Ionicons } from "@expo/vector-icons";
import { S3 } from "aws-sdk";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
	ActivityIndicator,
	Alert,
	Animated,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { callGeminiAPI as callGeminiAPIExternal } from "../../ai/ai_api";
import { createFirebaseChatHandlers } from "../../ai/ai_firebase";
import { auth, db } from "../../config/firebase";
import FloatingAIButton from "./FloatingAIButton";

// Configure AWS S3 for Cloudflare R2
const s3 = new S3({
	endpoint: `https://${process.env.EXPO_PUBLIC_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	accessKeyId: process.env.EXPO_PUBLIC_R2_ACCESS_KEY_ID,
	secretAccessKey: process.env.EXPO_PUBLIC_R2_SECRET_ACCESS_KEY,
	signatureVersion: "v4",
	region: "auto",
});

const ChatPopup = ({ visible, onClose }) => {
	const { t, i18n } = useTranslation();
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [recentChats, setRecentChats] = useState([]);
	const [currentChatId, setCurrentChatId] = useState(null);
	const [currentChatTitle, setCurrentChatTitle] = useState(t('ai.chat.newChat'));
	const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [uploadingImage, setUploadingImage] = useState(false);
	const scrollViewRef = useRef();
	const sidebarAnimation = useRef(new Animated.Value(-280)).current;
	const overlayAnimation = useRef(new Animated.Value(0)).current;
	const userId = auth.currentUser?.uid;

	// Create Firebase handlers
	const {
		loadRecentChats,
		startNewChat,
		loadChat,
		saveMessageToFirebase,
		deleteChat,
	} = createFirebaseChatHandlers({
		db,
		getUserId: () => auth.currentUser?.uid,
		setMessages,
		setRecentChats,
		setCurrentChatId,
		setCurrentChatTitle,
		setIsInitialLoading,
		setIsSidebarOpen,
		getCurrentChatId: () => currentChatId,
		getCurrentChatTitle: () => currentChatTitle,
		getRecentChats: () => recentChats,
	});

	// Initialize chat when popup becomes visible
	useEffect(() => {
		if (visible && userId) {
			loadRecentChats();
			if (!currentChatId) {
				startNewChat();
			}
		}
	}, [visible, userId]); // eslint-disable-line react-hooks/exhaustive-deps

	const toggleSidebar = () => {
		const willBeOpen = !isSidebarOpen;
		setIsSidebarOpen(willBeOpen);

		Animated.parallel([
			Animated.timing(sidebarAnimation, {
				toValue: willBeOpen ? 0 : -280,
				duration: 300,
				useNativeDriver: false,
			}),
			Animated.timing(overlayAnimation, {
				toValue: willBeOpen ? 1 : 0,
				duration: 300,
				useNativeDriver: false,
			}),
		]).start();
	};

	const closeSidebar = () => {
		toggleSidebar();
	};

	// Upload image to Cloudflare R2
	const uploadImageToR2 = async (imageUri) => {
		try {
			setUploadingImage(true);

			// Generate unique filename
			const filename = `user-${userId}-${Date.now()}.jpg`;
			const response = await fetch(imageUri);
			const blob = await response.blob();

			const params = {
				Bucket: process.env.EXPO_PUBLIC_R2_BUCKET_NAME,
				Key: filename,
				Body: blob,
				ContentType: "image/jpeg",
				ACL: "public-read",
			};

			await s3.upload(params).promise();

			// Return the public URL
			return `${process.env.EXPO_PUBLIC_R2_PUBLIC_URL}/${filename}`;
		} catch (error) {
			console.log("Error uploading image to R2:", error);
			throw new Error(t('ai.chat.errors.uploadFailed'));
		} finally {
			setUploadingImage(false);
		}
	};

	const sendMessage = async () => {
		if ((!inputText.trim() && !selectedImage) || isLoading || uploadingImage)
			return;

		let imageUrl = null;

		// Upload image if selected
		if (selectedImage) {
			try {
				imageUrl = await uploadImageToR2(selectedImage);
				console.log("Image uploaded to R2:", imageUrl);
			} catch (error) {
				Alert.alert(
					 t('ai.chat.errors.uploadTitle'),
					 t('ai.chat.errors.uploadMessage'),
					error
				);
				return;
			}
		}

		const userMessage = {
			id: Date.now().toString(),
			text: inputText || (selectedImage ? t('ai.chat.messages.analyzeImage') : ""),
			isBot: false,
			timestamp: new Date(),
			image: selectedImage, // Local URI for display
			imageUrl: imageUrl, // Cloudflare R2 URL for API
		};

		setMessages((prev) => [...prev, userMessage]);
		const currentInput = inputText;
		setInputText("");
		setSelectedImage(null);
		setShowAttachmentOptions(false);
		setIsLoading(true);

		await saveMessageToFirebase(userMessage);

		try {
			// Determine human-readable language name for instruction
			const langCode = i18n.language;
			const languageNameMap = {
				en: 'English',
				hi: 'Hindi',
				ml: 'Malayalam',
				ta: 'Tamil'
			};
			const languageName = languageNameMap[langCode] || 'English';

			const systemInstruction = `You are an agricultural assistant. Respond ONLY in ${languageName}. If the user writes in another language, translate their request and answer in ${languageName}. Keep answers concise, practical, and farmer-friendly.`;

			const baseUserText = currentInput || (imageUrl ? t('ai.chat.messages.analyzeImage') : '');
			const localizedPrompt = `${systemInstruction}\n\n${baseUserText}`.trim();

			console.log("Sending to Gemini with:", {
				langCode,
				languageName,
				userText: baseUserText,
				hasImage: !!imageUrl,
				imageUrl: imageUrl,
			});

			// Use direct Gemini API call with language-aware prompt
			const botResponseText = await callGeminiAPIExternal(
				localizedPrompt,
				messages,
				imageUrl // Pass the Cloudflare R2 image URL directly to Gemini
			);

			console.log("Received response from Gemini");

			const botResponse = {
				id: (Date.now() + 1).toString(),
				text: botResponseText,
				isBot: true,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, botResponse]);
			await saveMessageToFirebase(botResponse);
		} catch (error) {
			console.log("Error sending message:", error);
			Alert.alert(
				 t('ai.chat.errors.connectionTitle'),
				 error.message.includes("image")
				 	? t('ai.chat.errors.imageAnalysis')
				 	: t('ai.chat.errors.generalAdvice')
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Image picker functions (unchanged)
	const requestPermissions = async () => {
		const { status: cameraStatus } =
			await ImagePicker.requestCameraPermissionsAsync();
		const { status: galleryStatus } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (cameraStatus !== "granted" || galleryStatus !== "granted") {
			Alert.alert(
				 t('ai.chat.permissions.title'),
				 t('ai.chat.permissions.msg')
			);
			return false;
		}
		return true;
	};

	const pickImageFromCamera = async () => {
		const hasPermission = await requestPermissions();
		if (!hasPermission) return;

		try {
			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				setSelectedImage(result.assets[0].uri);
				setShowAttachmentOptions(false);
			}
		} catch (_error) {
			Alert.alert(t('ai.chat.errors.genericTitle'), t('ai.chat.errors.takePhoto'));
		}
	};

	const pickImageFromGallery = async () => {
		const hasPermission = await requestPermissions();
		if (!hasPermission) return;

		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 0.8,
			});

			if (!result.canceled && result.assets[0]) {
				setSelectedImage(result.assets[0].uri);
				setShowAttachmentOptions(false);
			}
		} catch (_error) {
			Alert.alert(t('ai.chat.errors.genericTitle'), t('ai.chat.errors.selectImage'));
		}
	};

	const removeSelectedImage = () => {
		setSelectedImage(null);
	};

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (messages.length > 0) {
			setTimeout(() => {
				scrollViewRef.current?.scrollToEnd({ animated: true });
			}, 100);
		}
	}, [messages]);

	// Format text with bold styling
	const formatTextWithBold = (message) => {
		let text;
		if(message.id === "welcome") {
			const langCode = i18n.language;
			text = message.text[langCode] || message.text?.en || message.text;
		}else{
			text = message.text;
		}
		const parts = text.split(/(\*\*.*?\*\*)/g);
		return parts.map((part, index) => {
			if (part.startsWith("**") && part.endsWith("**")) {
				return (
					<Text key={index} className="font-bold">
						{part.replace(/\*\*/g, "")}
					</Text>
				);
			}
			return part;
		});
	};

	const MessageBubble = ({ message }) => (
		<View className={`mb-3 ${message.isBot ? "items-start" : "items-end"}`}>
			<View className="flex-col">
				{message.isBot && (
					<Image
						source={require("../../assets/images/AI.png")}
						style={{ width: 60, height: 60 }}
						className="-mb-6 -ml-6"
					/>
				)}
				<View
					className={`max-w-[80%] px-4 py-3 rounded-2xl ${
						message.isBot
							? "bg-lime-300/30 border border-primary rounded-tl-none"
							: "bg-primary rounded-tr-none"
					}`}
				>
					{/* Display image if present */}
					{message.image && (
						<Image
							source={{ uri: message.image }}
							style={{ width: 200, height: 150 }}
							className="rounded-lg mb-2"
							resizeMode="cover"
						/>
					)}
					<Text
						className={`text-sm leading-5 ${
							message.isBot ? "text-gray-800" : "text-white"
						}`}
						selectable
					>
						{formatTextWithBold(message)}
					</Text>
					<Text
						className={`text-xs mt-2 ${
							message.isBot ? "text-gray-500" : "text-white/70"
						}`}
					>
						{message.timestamp?.toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				</View>
			</View>
		</View>
	);

	const LoadingBubble = () => (
		<View className="mb-3 items-start">
			<View className="flex-col">
				<Image
					source={require("../../assets/images/AI.png")}
					style={{ width: 60, height: 60 }}
					className="-mb-6 -ml-6"
				/>
				<View className="bg-lime-300/30 border border-primary rounded-2xl rounded-tl-none px-4 py-3">
					<View className="flex-row items-center">
						<ActivityIndicator size="small" color="#314C1C" />
						<Text className="text-gray-800 text-sm ml-2">
							{uploadingImage
								? t('ai.chat.loading.uploadingImage')
								: t('ai.chat.loading.analyzing')}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-white">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1"
				>
					{/* Main Chat Area */}
					<View className="flex-1">
						{/* Header */}
						<View className="bg-primary px-6 py-4 flex-row items-center justify-between">
							<View className="flex-row items-center">
								<TouchableOpacity onPress={toggleSidebar} className="mr-3">
									<Ionicons name="menu" size={24} color="white" />
								</TouchableOpacity>
								<View>
									<Text className="text-white text-lg font-semibold">
										{t('ai.chat.header.title')}
									</Text>
									<Text className="text-white/70 text-xs">
										{currentChatTitle}
									</Text>
								</View>
							</View>
							<TouchableOpacity onPress={onClose}>
								<Ionicons name="close" size={24} color="white" />
							</TouchableOpacity>
						</View>
						{/* Messages */}
						<ScrollView
							ref={scrollViewRef}
							className="flex-1 px-4 py-4"
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 20 }}
						>
							{isInitialLoading ? (
								<View className="flex-1 justify-center items-center py-8">
									<ActivityIndicator size="large" color="#314C1C" />
									<Text className="text-gray-500 mt-2">
										{t('ai.chat.loading.initial')}
									</Text>
								</View>
							) : (
								<>
									{messages.length === 0 && !isLoading && !uploadingImage && (
										<View className="items-start mb-4">
											<View className="flex-col">
												<Image
													source={require("../../assets/images/AI.png")}
													style={{ width: 60, height: 60 }}
													className="-mb-6 -ml-6"
												/>
												<View className="max-w-[85%] px-4 py-3 rounded-2xl bg-lime-300/30 border border-primary rounded-tl-none">
													<Text className="text-gray-800 text-sm leading-5">
														{t('ai.chat.welcome.intro')}
													</Text>
												</View>
											</View>
										</View>
									)}
									{messages.map((message) => (
										<MessageBubble key={message.id} message={message} />
									))}
									{(isLoading || uploadingImage) && <LoadingBubble />}
								</>
							)}
						</ScrollView>

						{/* Input Area */}
						<View className="px-4 py-3 bg-primary border-t border-gray-200">
							{/* Image Preview */}
							{selectedImage && (
								<View className="mb-3 bg-white rounded-lg p-3">
									<View className="flex-row items-center justify-between mb-2">
										<Text className="text-gray-700 font-medium">
											{t('ai.chat.image.selected')} {uploadingImage && `(${t('ai.chat.loading.uploadingImage')})`}
										</Text>
										<TouchableOpacity
											onPress={removeSelectedImage}
											disabled={uploadingImage}
										>
											<Ionicons
												name="close-circle"
												size={20}
												color={uploadingImage ? "#ccc" : "#ef4444"}
											/>
										</TouchableOpacity>
									</View>
									<Image
										source={{ uri: selectedImage }}
										style={{ width: "100%", height: 120 }}
										className="rounded-lg"
										resizeMode="cover"
									/>
								</View>
							)}

							{/* Quick action buttons */}
							<View className="flex-row justify-center mb-3 gap-2">
								<TouchableOpacity
									className="bg-white/20 px-3 py-2 rounded-full"
									onPress={() => setInputText(t('ai.chat.quick.diseasePrompt'))}
								>
									<Text className="text-white text-xs">🦠 {t('ai.chat.quick.disease')}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="bg-white/20 px-3 py-2 rounded-full"
									onPress={() => setInputText(t('ai.chat.quick.cropPlanPrompt'))}
								>
									<Text className="text-white text-xs">🌱 {t('ai.chat.quick.cropPlan')}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="bg-white/20 px-3 py-2 rounded-full"
									onPress={() => setInputText(t('ai.chat.quick.soilPrompt'))}
								>
									<Text className="text-white text-xs">🌿 {t('ai.chat.quick.soil')}</Text>
								</TouchableOpacity>
							</View>

							{/* Attachment Options Modal */}
							{showAttachmentOptions && (
								<View className="absolute bottom-20 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-50">
									<TouchableOpacity
										className="flex-row items-center px-4 py-3 rounded-lg"
										onPress={pickImageFromCamera}
									>
										<Ionicons name="camera" size={20} color="#314C1C" />
										<Text className="ml-3 text-gray-800 font-medium">
											{t('ai.chat.actions.takePhoto')}
										</Text>
									</TouchableOpacity>
									<View className="h-px bg-gray-200 mx-2" />
									<TouchableOpacity
										className="flex-row items-center px-4 py-3 rounded-lg"
										onPress={pickImageFromGallery}
									>
										<Ionicons name="image" size={20} color="#314C1C" />
										<Text className="ml-3 text-gray-800 font-medium">
											{t('ai.chat.actions.chooseFromGallery')}
										</Text>
									</TouchableOpacity>
								</View>
							)}

							<View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
								<TouchableOpacity
									className="mr-3 bg-lime-200 p-2 rounded-full"
									onPress={() =>
										setShowAttachmentOptions(!showAttachmentOptions)
									}
									disabled={uploadingImage}
								>
									<Ionicons
										name="attach"
										size={20}
										color={uploadingImage ? "#ccc" : "#314C1C"}
									/>
								</TouchableOpacity>

								<TextInput
									className="flex-1 text-base text-gray-800 py-2"
									placeholder={t('ai.chat.input.placeholder')}
									placeholderTextColor="#9CA3AF"
									value={inputText}
									onChangeText={setInputText}
									multiline
									maxLength={1000}
									editable={!isLoading && !uploadingImage}
									onSubmitEditing={sendMessage}
								/>

								<TouchableOpacity
									onPress={sendMessage}
									className={`ml-3 rounded-full p-2 ${
										(inputText.trim() || selectedImage) &&
										!isLoading &&
										!uploadingImage
											? "bg-primary"
											: "bg-gray-300"
									}`}
									disabled={
										!(inputText.trim() || selectedImage) ||
										isLoading ||
										uploadingImage
									}
								>
									{isLoading || uploadingImage ? (
										<ActivityIndicator size={16} color="white" />
									) : (
										<Ionicons name="send" size={16} color="white" />
									)}
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Mobile Overlay for Sidebar */}
					<>
						{/* Backdrop */}
						<Animated.View
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: "#0101014e",
								opacity: overlayAnimation,
								pointerEvents: isSidebarOpen ? "auto" : "none",
							}}
						>
							<TouchableOpacity
								style={{ flex: 1 }}
								onPress={closeSidebar}
								activeOpacity={1}
							/>
						</Animated.View>

						{/* Sliding Sidebar */}
						<Animated.View
							style={{
								position: "absolute",
								left: sidebarAnimation,
								top: 0,
								bottom: 0,
								width: 280,
								backgroundColor: "#f9fafb",
								borderRightWidth: 1,
								borderRightColor: "#e5e7eb",
								elevation: 16,
								shadowColor: "#000",
								shadowOffset: { width: 2, height: 0 },
								shadowOpacity: 0.25,
								shadowRadius: 8,
							}}
						>
							<View className="p-4 border-b border-gray-200 bg-white">
								<TouchableOpacity
									onPress={startNewChat}
									className="bg-primary rounded-lg p-3 flex-row items-center justify-center"
								>
									<Ionicons name="add" size={16} color="white" />
									<Text className="text-white ml-2 font-medium">{t('ai.chat.actions.newChat')}</Text>
								</TouchableOpacity>
							</View>

							<ScrollView className="flex-1 p-2">
								<Text className="text-gray-500 text-sm font-medium mb-3 px-2">
									{t('ai.chat.sidebar.recent')}
								</Text>
								{recentChats.map((chat) => (
									<TouchableOpacity
										key={chat.id}
										onPress={() => {
											loadChat(chat.id);
											closeSidebar();
										}}
										className={`p-3 rounded-lg mb-2 flex-row items-center justify-between ${
											currentChatId === chat.id ? "bg-primary/10" : "bg-white"
										}`}
									>
										<View className="flex-1">
											<Text
												className="text-gray-800 font-medium text-sm"
												numberOfLines={1}
											>
												{chat.title || t('ai.chat.sidebar.untitled')}
											</Text>
											<Text
												className="text-gray-500 text-xs mt-1"
												numberOfLines={1}
											>
												{chat.lastMessage}
											</Text>
											<Text className="text-gray-400 text-xs mt-1">
												{chat.lastMessageTime?.toLocaleDateString()}
											</Text>
										</View>
										<TouchableOpacity
											onPress={() => {
												Alert.alert(
													 t('ai.chat.delete.title'),
													 t('ai.chat.delete.confirm'),
													 [
														{ text: t('common.cancel'), style: 'cancel' },
														{
															text: t('ai.chat.delete.deleteBtn'),
															style: 'destructive',
															onPress: () => deleteChat(chat.id),
														},
													 ]
												);
											}}
											className="ml-2"
										>
											<Ionicons
												name="trash-outline"
												size={16}
												color="#ef4444"
											/>
										</TouchableOpacity>
									</TouchableOpacity>
								))}
							</ScrollView>
						</Animated.View>
					</>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
};

// Usage Component
const AIChatSpace = () => {
	const [isActive, setIsActive] = useState(false);

	return (
		<View className="absolute">
			<FloatingAIButton isActive={isActive} setIsActive={setIsActive} />
			<ChatPopup visible={isActive} onClose={() => setIsActive(false)} />
		</View>
	);
};

export default AIChatSpace;
