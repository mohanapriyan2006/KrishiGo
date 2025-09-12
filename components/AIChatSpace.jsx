import { Ionicons } from "@expo/vector-icons";
// Firebase operations are encapsulated in ../ai/ai_firebase
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
import { callGeminiAPI as callGeminiAPIExternal } from "../ai/ai_api";
import { createFirebaseChatHandlers } from "../ai/ai_firebase";
import { auth, db } from "../config/firebase";
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
		setIsSidebarOpen(!isSidebarOpen);

		// Animate sidebar slide and overlay fade
		Animated.parallel([
			Animated.timing(sidebarAnimation, {
				toValue: isSidebarOpen ? -280 : 0, // Slide from left
				duration: 300,
				useNativeDriver: false,
			}),
			Animated.timing(overlayAnimation, {
				toValue: isSidebarOpen ? 0 : 1, // Fade overlay
				duration: 300,
				useNativeDriver: false,
			}),
		]).start();
	};

	// Close sidebar when overlay is tapped
	const closeSidebar = () => {
		if (isSidebarOpen) {
			toggleSidebar();
		}
	};

	// API call now uses external helper with current messages for context

	const sendMessage = async () => {
		if (!inputText.trim() || isLoading) return;

		const userMessage = {
			id: Date.now().toString(),
			text: inputText,
			isBot: false,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		const currentInput = inputText;
		setInputText("");
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
						source={require("../assets/images/AI.png")}
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
					source={require("../assets/images/AI.png")}
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

	const overlayOpacity = overlayAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.5],
	});

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

							<View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
								<TouchableOpacity className="mr-3">
									<Ionicons name="camera" size={20} color="#314C1C" />
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
									className={`ml-3 rounded-full p-2 ${inputText.trim() && !isLoading
										? "bg-primary"
										: "bg-gray-300"
										}`}
									disabled={!inputText.trim() || isLoading}
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

					{/* Mobile Overlay for Sidebar */}
					{isSidebarOpen && (
						<>
							{/* Backdrop */}
							<Animated.View
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: 'black',
									opacity: overlayOpacity,
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
					)}
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
