import { Ionicons } from "@expo/vector-icons";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
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
import { auth, db } from "../config/firebase";
import FloatingAIButton from "./FloatingAIButton";

// Gemini API configuration
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Farmer-friendly system prompt
const FARMER_SYSTEM_PROMPT = `You are an expert agricultural assistant designed to help farmers with practical, actionable advice. Your role is to:

CORE IDENTITY:
- Act as a knowledgeable, friendly farming expert who understands real-world agricultural challenges
- Provide practical, cost-effective solutions that work for small to medium-scale farmers
- Focus on sustainable farming practices, crop management, pest control, soil health, and farm economics
- Consider local conditions, weather patterns, and seasonal farming cycles

COMMUNICATION STYLE:
- Use simple, clear language that any farmer can understand and use emojis to make responses friendly and engaging
- Be concise and to the point, avoiding unnecessary details and lengthy explanations
- Prioritize actionable advice that farmers can implement immediately
- Avoid technical jargon unless necessary, and always explain complex terms
- Break down complex topics into easy-to-follow steps
- Use bullet points, numbered lists, and short paragraphs for better readability
- Be encouraging and supportive - farming is challenging work

CAPABILITIES:
- Analyze images of crops, soil, pests, diseases, or farm equipment
- Provide crop recommendations based on soil type, climate, and market conditions
- Offer pest and disease identification and treatment advice
- Suggest fertilizer and irrigation schedules
- Help with farm planning and crop rotation strategies
- Provide market insights and pricing guidance when possible
- Assist with sustainable farming practices and organic methods

RESPONSE FORMAT:
- Start with a brief, clear answer to the main question
- Follow with a step-by-step action plan if applicable
- Use headings, bullet points, and numbered steps for easy scanning
- Include practical tips and warnings when relevant
- End with actionable next steps or follow-up suggestions
- If analyzing images, describe what you see clearly before giving advice or recommendations

Remember: You're here to make farming easier and more profitable for hardworking farmers. Always prioritize practical, implementable solutions. Be the friendly expert they can rely on for real-world farming advice.`;

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
	const sidebarAnimation = useRef(new Animated.Value(0)).current;
	const userId = auth.currentUser?.uid;

	// Initialize chat when popup becomes visible
	useEffect(() => {
		if (visible && userId) {
			loadRecentChats();
			if (!currentChatId) {
				startNewChat();
			}
		}
	}, [visible, userId]);

	// Load recent chats from Firebase
	const loadRecentChats = async () => {
		if (!userId) return;

		try {
			const chatsRef = collection(db, "users", userId, "chatSessions");
			const q = query(chatsRef, orderBy("lastMessageTime", "desc"), limit(20));

			const unsubscribe = onSnapshot(q, (snapshot) => {
				const chats = [];
				snapshot.forEach((doc) => {
					chats.push({
						id: doc.id,
						...doc.data(),
						lastMessageTime: doc.data().lastMessageTime?.toDate() || new Date(),
					});
				});
				setRecentChats(chats);
			});

			return unsubscribe;
		} catch (error) {
			console.error("Error loading recent chats:", error);
		}
	};

	// Start a new chat session
	const startNewChat = async () => {
		if (!userId) return;

		try {
			// Create a new chat session document in Firebase
			const chatSessionRef = collection(db, "users", userId, "chatSessions");
			const newChatDocRef = await addDoc(chatSessionRef, {
				title: "New Chat",
				lastMessage: "Chat started",
				lastMessageTime: serverTimestamp(),
				createdAt: serverTimestamp(),
			});

			// Set the current chat ID to the newly created document ID
			setCurrentChatId(newChatDocRef.id);
			setCurrentChatTitle("New Chat");

			// Add welcome message
			const welcomeMessage = {
				id: "welcome-" + Date.now(),
				text: "🌾 Hello, fellow farmer! I'm your AI farming assistant, here to help you grow better crops and manage your farm more effectively.\n\n🚜 I can help you with:\n• Crop diseases and pest identification\n• Soil health and fertilizer advice\n• Planting and harvesting schedules\n• Weather-based farming tips\n• Market insights and pricing\n• Sustainable farming practices\n\nWhat farming challenge can I help you solve today?",
				isBot: true,
				timestamp: new Date(),
			};

			setMessages([welcomeMessage]);

			// Save welcome message to Firebase
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				newChatDocRef.id,
				"messages"
			);
			await addDoc(messagesRef, {
				...welcomeMessage,
				timestamp: serverTimestamp(),
			});
		} catch (error) {
			console.error("Error creating new chat session:", error);
			Alert.alert("Error", "Could not start a new chat. Please try again.");
		}
	};

	// Load specific chat
	const loadChat = async (chatId) => {
		try {
			setIsInitialLoading(true);
			setCurrentChatId(chatId);
			setIsSidebarOpen(false);

			// Find chat title from recent chats
			const chatSession = recentChats.find((chat) => chat.id === chatId);
			setCurrentChatTitle(chatSession?.title || "Chat");

			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				chatId,
				"messages"
			);
			const q = query(messagesRef, orderBy("timestamp", "asc"));

			const unsubscribe = onSnapshot(q, (snapshot) => {
				const chatHistory = [];
				snapshot.forEach((doc) => {
					chatHistory.push({
						id: doc.id,
						...doc.data(),
						timestamp: doc.data().timestamp?.toDate() || new Date(),
					});
				});

				setMessages(chatHistory);
				setIsInitialLoading(false);
			});

			return unsubscribe;
		} catch (error) {
			console.error("Error loading chat:", error);
			setIsInitialLoading(false);
		}
	};

	// Save message to Firebase
	const saveMessageToFirebase = async (message) => {
		if (!userId || !currentChatId) return;

		try {
			// Save message to chat
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				currentChatId,
				"messages"
			);
			await addDoc(messagesRef, {
				...message,
				timestamp: serverTimestamp(),
			});

			// Update chat session with last message
			const chatSessionRef = doc(
				db,
				"users",
				userId,
				"chatSessions",
				currentChatId
			);
			const updateData = {
				lastMessage:
					message.text.substring(0, 100) +
					(message.text.length > 100 ? "..." : ""),
				lastMessageTime: serverTimestamp(),
			};

			// Generate title from first user message if it's a new chat
			if (currentChatTitle === "New Chat" && !message.isBot) {
				const title =
					message.text.substring(0, 50) +
					(message.text.length > 50 ? "..." : "");
				updateData.title = title;
				setCurrentChatTitle(title);
			}

			await updateDoc(chatSessionRef, updateData);
		} catch (error) {
			console.error("Error saving message:", error);
		}
	};

	// Delete chat
	const deleteChat = async (chatId) => {
		try {
			// Delete all messages in the chat
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				chatId,
				"messages"
			);
			const messagesSnapshot = await getDocs(messagesRef);

			const deletePromises = messagesSnapshot.docs.map((doc) =>
				deleteDoc(doc.ref)
			);
			await Promise.all(deletePromises);

			// Delete the chat session
			const chatSessionRef = doc(db, "users", userId, "chatSessions", chatId);
			await deleteDoc(chatSessionRef);

			// If this was the current chat, start a new one
			if (currentChatId === chatId) {
				startNewChat();
			}
		} catch (error) {
			console.error("Error deleting chat:", error);
			Alert.alert("Error", "Failed to delete chat");
		}
	};

	// Toggle sidebar
	const toggleSidebar = () => {
		const toValue = isSidebarOpen ? 0 : 1;
		setIsSidebarOpen(!isSidebarOpen);

		Animated.timing(sidebarAnimation, {
			toValue,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	// Build conversation history for context
	const buildConversationHistory = () => {
		const recentMessages = messages.slice(-10);
		const conversationParts = [
			{
				text: FARMER_SYSTEM_PROMPT,
			},
		];

		recentMessages.forEach((message) => {
			if (message.id !== "welcome") {
				conversationParts.push({
					text: `${message.isBot ? "Assistant" : "User"}: ${message.text}`,
				});
			}
		});

		return conversationParts;
	};

	// Call Gemini API with enhanced farming context
	const callGeminiAPI = async (userMessage) => {
		try {
			if (!GEMINI_API_KEY) {
				throw new Error("Gemini API key not found in environment variables");
			}

			const conversationHistory = buildConversationHistory();
			conversationHistory.push({
				text: `User: ${userMessage}`,
			});

			const response = await fetch(GEMINI_API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contents: [
						{
							parts: conversationHistory,
						},
					],
					generationConfig: {
						temperature: 0.7,
						topK: 40,
						topP: 0.95,
						maxOutputTokens: 2048,
					},
					safetySettings: [
						{
							category: "HARM_CATEGORY_HARASSMENT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
						{
							category: "HARM_CATEGORY_HATE_SPEECH",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
						{
							category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
						{
							category: "HARM_CATEGORY_DANGEROUS_CONTENT",
							threshold: "BLOCK_MEDIUM_AND_ABOVE",
						},
					],
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					`Gemini API error: ${errorData.error?.message || "Unknown error"}`
				);
			}

			const data = await response.json();
			const responseText =
				data.candidates?.[0]?.content?.parts?.[0]?.text ||
				"Sorry, I couldn't generate a response. Please try asking your farming question again.";

			return responseText.replace(/^Assistant:\s*/, "");
		} catch (error) {
			console.error("Gemini API error:", error);
			return `🚜 Sorry, I'm having trouble connecting right now. Please check your internet connection and try again.\n\nError details: ${error.message}`;
		}
	};

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
			const botResponseText = await callGeminiAPI(currentInput);

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
					className={`max-w-[80%] px-4 py-3 rounded-2xl ${
						message.isBot
							? "bg-lime-300/30 border border-primary rounded-tl-none"
							: "bg-primary rounded-tr-none"
					}`}
				>
					<Text
						className={`text-sm leading-5 ${
							message.isBot ? "text-gray-800" : "text-white"
						}`}
						selectable
					>
						{formatTextWithBold(message.text)}
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

	const sidebarWidth = sidebarAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 280],
	});

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="bg-white h-full flex-row"
				>
					{/* Sidebar */}
					<Animated.View
						style={{ width: sidebarWidth }}
						className="bg-gray-50 border-r border-gray-200 h-full"
					>
						<View className="p-4 border-b border-gray-200">
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
									onPress={() => loadChat(chat.id)}
									className={`p-3 rounded-lg mb-2 flex-row items-center justify-between ${
										currentChatId === chat.id ? "bg-primary/10" : "bg-white"
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
						<View className="px-4 py-4 bg-primary border-t border-gray-200">
							<View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
								<TouchableOpacity className="mr-3">
									<Ionicons name="camera" size={20} color="#314C1C" />
								</TouchableOpacity>

								<TextInput
									className="flex-1 text-base text-gray-800 py-2"
									placeholder="Ask about crops, pests, soil, weather..."
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
									className={`ml-3 rounded-full p-2 ${
										inputText.trim() && !isLoading
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

							{/* Quick action buttons */}
							<View className="flex-row justify-center mt-3 space-x-2">
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
						</View>
					</View>
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
