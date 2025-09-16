import { Ionicons } from "@expo/vector-icons";
// Firebase operations are encapsulated in ../ai/ai_firebase
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from "react";
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

// API functions and system prompt now come from ../ai/ai_api

const ChatPopup = ({ visible, onClose }) => {
	const [messages, setMessages] = useState([]);
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialLoading, setIsInitialLoading] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [recentChats, setRecentChats] = useState([]);
	const [currentChatId, setCurrentChatId] = useState(null);
	const [currentChatTitle, setCurrentChatTitle] = useState("New Chat");
	const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const scrollViewRef = useRef();
	const sidebarAnimation = useRef(new Animated.Value(-280)).current; // Start off-screen
	const overlayAnimation = useRef(new Animated.Value(0)).current; // For backdrop overlay
	const userId = auth.currentUser?.uid;

	// Create Firebase handlers wired to this component's state
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

	// Firebase handlers now provided by ../ai/ai_firebase

	// Toggle sidebar with mobile-first overlay experience
	const toggleSidebar = () => {
		const willBeOpen = !isSidebarOpen;
		setIsSidebarOpen(willBeOpen);

		// Animate sidebar slide and overlay fade
		Animated.parallel([
			Animated.timing(sidebarAnimation, {
				toValue: willBeOpen ? 0 : -280, // Slide from left (0 = visible, -280 = hidden)
				duration: 300,
				useNativeDriver: false,
			}),
			Animated.timing(overlayAnimation, {
				toValue: willBeOpen ? 1 : 0, // Fade overlay (1 = visible, 0 = hidden)
				duration: 300,
				useNativeDriver: false,
			}),
		]).start();
	};

	// Close sidebar when overlay is tapped
	const closeSidebar = () => {
		toggleSidebar();
	};

	// API call now uses external helper with current messages for context

	const sendMessage = async () => {
		if ((!inputText.trim() && !selectedImage) || isLoading) return;

		const userMessage = {
			id: Date.now().toString(),
			text: inputText || (selectedImage ? "Please analyze this image" : ""),
			isBot: false,
			timestamp: new Date(),
			image: selectedImage, // Include image if attached
		};

		setMessages((prev) => [...prev, userMessage]);
		const currentInput = inputText;
		setInputText("");
		setSelectedImage(null); // Clear selected image
		setShowAttachmentOptions(false); // Close attachment options
		setIsLoading(true);

		await saveMessageToFirebase(userMessage);

		try {
			const botResponseText = await callGeminiAPIExternal(currentInput, messages);

			const botResponse = {
				id: (Date.now() + 1).toString(),
				text: botResponseText,
				isBot: true,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, botResponse]);
			await saveMessageToFirebase(botResponse);
		} catch (error) {
			console.error("Error sending message:", error);
			Alert.alert(
				"Connection Error",
				"Failed to get farming advice. Please check your internet connection and try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Image picker functions
	const requestPermissions = async () => {
		const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
		const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
			Alert.alert(
				'Permissions Required',
				'Please grant camera and photo library permissions to upload images.'
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
			Alert.alert('Error', 'Failed to take photo. Please try again.');
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
			Alert.alert('Error', 'Failed to select image. Please try again.');
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

	// Format text with bold styling for **text**
	const formatTextWithBold = (text) => {
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
					className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.isBot
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
						className={`text-sm leading-5 ${message.isBot ? "text-gray-800" : "text-white"
							}`}
						selectable
					>
						{formatTextWithBold(message.text)}
					</Text>
					<Text
						className={`text-xs mt-2 ${message.isBot ? "text-gray-500" : "text-white/70"
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
							Analyzing your farming question...
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
										🌾 Farm Assistant
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
										Loading your farm chat...
									</Text>
								</View>
							) : (
								<>
									{messages.map((message) => (
										<MessageBubble key={message.id} message={message} />
									))}
									{isLoading && <LoadingBubble />}
								</>
							)}
						</ScrollView>

						{/* Input Area */}
						<View className="px-4 py-3 bg-primary border-t border-gray-200">
							{/* Image Preview */}
							{selectedImage && (
								<View className="mb-3 bg-white rounded-lg p-3">
									<View className="flex-row items-center justify-between mb-2">
										<Text className="text-gray-700 font-medium">Selected Image</Text>
										<TouchableOpacity onPress={removeSelectedImage}>
											<Ionicons name="close-circle" size={20} color="#ef4444" />
										</TouchableOpacity>
									</View>
									<Image
										source={{ uri: selectedImage }}
										style={{ width: '100%', height: 120 }}
										className="rounded-lg"
										resizeMode="cover"
									/>
								</View>
							)}

							{/* Quick action buttons */}
							<View className="flex-row justify-center mb-3 gap-2">
								<TouchableOpacity
									className="bg-white/20 px-3 py-2 rounded-full"
									onPress={() => setInputText("Identify this plant disease")}
								>
									<Text className="text-white text-xs">🦠 Disease ID</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="bg-white/20 px-3 py-2 rounded-full"
									onPress={() =>
										setInputText("What should I plant this season?")
									}
								>
									<Text className="text-white text-xs">🌱 Crop Plan</Text>
								</TouchableOpacity>
								<TouchableOpacity
									className="bg-white/20 px-3 py-2 rounded-full"
									onPress={() => setInputText("How to improve soil health?")}
								>
									<Text className="text-white text-xs">🌿 Soil Tips</Text>
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
										<Text className="ml-3 text-gray-800 font-medium">Take Photo</Text>
									</TouchableOpacity>
									<View className="h-px bg-gray-200 mx-2" />
									<TouchableOpacity
										className="flex-row items-center px-4 py-3 rounded-lg"
										onPress={pickImageFromGallery}
									>
										<Ionicons name="image" size={20} color="#314C1C" />
										<Text className="ml-3 text-gray-800 font-medium">Choose from Gallery</Text>
									</TouchableOpacity>
								</View>
							)}

							<View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
								<TouchableOpacity
									className="mr-3 bg-lime-200 p-2 rounded-full"
									onPress={() => setShowAttachmentOptions(!showAttachmentOptions)}
								>
									<Ionicons name="attach" size={20} color="#314C1C" />
								</TouchableOpacity>

								<TextInput
									className="flex-1 text-base text-gray-800 py-2"
									placeholder="Type your farm question..."
									placeholderTextColor="#9CA3AF"
									value={inputText}
									onChangeText={setInputText}
									multiline
									maxLength={1000}
									editable={!isLoading}
									onSubmitEditing={sendMessage}
								/>

								<TouchableOpacity
									onPress={sendMessage}
									className={`ml-3 rounded-full p-2 ${(inputText.trim() || selectedImage) && !isLoading
										? "bg-primary"
										: "bg-gray-300"
										}`}
									disabled={!(inputText.trim() || selectedImage) || isLoading}
								>
									{isLoading ? (
										<ActivityIndicator size={16} color="white" />
									) : (
										<Ionicons name="send" size={16} color="white" />
									)}
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* Mobile Overlay for Sidebar - Always render but control visibility with animation */}
					<>
						{/* Backdrop */}
						<Animated.View
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: '#0101014e',
								opacity: overlayAnimation,
								pointerEvents: isSidebarOpen ? 'auto' : 'none',
							}}
						>
							<TouchableOpacity
								style={{ flex: 1 }}
								onPress={closeSidebar}
								activeOpacity={1}
							/>
						</Animated.View>

						{/* Sliding Sidebar - Always rendered */}
						<Animated.View
							style={{
								position: 'absolute',
								left: sidebarAnimation,
								top: 0,
								bottom: 0,
								width: 280,
								backgroundColor: '#f9fafb',
								borderRightWidth: 1,
								borderRightColor: '#e5e7eb',
								elevation: 16,
								shadowColor: '#000',
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
									<Text className="text-white ml-2 font-medium">New Chat</Text>
								</TouchableOpacity>
							</View>

							<ScrollView className="flex-1 p-2">
								<Text className="text-gray-500 text-sm font-medium mb-3 px-2">
									Recent Chats
								</Text>
								{recentChats.map((chat) => (
									<TouchableOpacity
										key={chat.id}
										onPress={() => {
											loadChat(chat.id);
											closeSidebar(); // Close sidebar after selecting chat
										}}
										className={`p-3 rounded-lg mb-2 flex-row items-center justify-between ${currentChatId === chat.id ? "bg-primary/10" : "bg-white"
											}`}
									>
										<View className="flex-1">
											<Text
												className="text-gray-800 font-medium text-sm"
												numberOfLines={1}
											>
												{chat.title || "Untitled Chat"}
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
													"Delete Chat",
													"Are you sure you want to delete this chat?",
													[
														{ text: "Cancel", style: "cancel" },
														{
															text: "Delete",
															style: "destructive",
															onPress: () => deleteChat(chat.id),
														},
													]
												);
											}}
											className="ml-2"
										>
											<Ionicons name="trash-outline" size={16} color="#ef4444" />
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
