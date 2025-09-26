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
    startAfter,
    updateDoc,
} from "firebase/firestore";

export const createFirebaseChatHandlers = ({
	db,
	getUserId,
	setMessages,
	setRecentChats,
	setCurrentChatId,
	setCurrentChatTitle,
	setIsInitialLoading,
	setIsSidebarOpen,
	getCurrentChatId,
	getCurrentChatTitle,
	getRecentChats,
}) => {
	const PAGE_SIZE = 20;

	const loadRecentChats = async () => {
		const userId = getUserId();
		if (!userId) return;
		try {
			const chatsRef = collection(db, "users", userId, "chatSessions");
			const qRef = query(
				chatsRef,
				orderBy("lastMessageTime", "desc"),
				limit(20)
			);
			const unsubscribe = onSnapshot(qRef, (snapshot) => {
				const chats = [];
				snapshot.forEach((d) => {
					chats.push({
						id: d.id,
						...d.data(),
						lastMessageTime: d.data().lastMessageTime?.toDate?.() || new Date(),
					});
				});
				setRecentChats(chats);
			});
			return unsubscribe;
		} catch (error) {
			console.log("Error loading recent chats:", error);
		}
	};

	const startNewChat = async () => {
		const userId = getUserId();
		if (!userId) return;
		try {
			const chatSessionRef = collection(db, "users", userId, "chatSessions");
			const newChatDocRef = await addDoc(chatSessionRef, {
				title: "New Chat",
				lastMessage: "Chat started",
				lastMessageTime: serverTimestamp(),
				createdAt: serverTimestamp(),
			});
			setCurrentChatId(newChatDocRef.id);
			setCurrentChatTitle("New Chat");

			const welcomeMessage = {
				id: "welcome-" + Date.now(),
				text: "🌾 Hello, fellow farmer! I'm your AI farming assistant...",
				isBot: true,
				timestamp: new Date(),
			};
			setMessages([welcomeMessage]);

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
			console.log("Error creating new chat session:", error);
		}
	};

	const loadChat = async (chatId) => {
		try {
			setIsInitialLoading(true);
			setCurrentChatId(chatId);
			setIsSidebarOpen(false);

			const recent = getRecentChats?.() || [];
			const chatSession = recent.find((c) => c.id === chatId);
			setCurrentChatTitle(chatSession?.title || "Chat");

			const userId = getUserId();
			if (!userId) return;
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				chatId,
				"messages"
			);
			const qRef = query(messagesRef, orderBy("timestamp", "asc"));

			const unsubscribe = onSnapshot(qRef, (snapshot) => {
				const chatHistory = [];
				snapshot.forEach((d) => {
					chatHistory.push({
						id: d.id,
						...d.data(),
						timestamp: d.data().timestamp?.toDate?.() || new Date(),
					});
				});
				setMessages(chatHistory);
				setIsInitialLoading(false);
			});
			return unsubscribe;
		} catch (error) {
			console.log("Error loading chat:", error);
			setIsInitialLoading(false);
		}
	};

	const saveMessageToFirebase = async (message) => {
		const userId = getUserId();
		const currentChatId = getCurrentChatId();
		if (!userId || !currentChatId) return;
		try {
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				currentChatId,
				"messages"
			);
			await addDoc(messagesRef, { ...message, timestamp: serverTimestamp() });

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
			const currentTitle = getCurrentChatTitle?.() || "";
			if (currentTitle === "New Chat" && !message.isBot) {
				const title =
					message.text.substring(0, 50) +
					(message.text.length > 50 ? "..." : "");
				updateData.title = title;
				setCurrentChatTitle(title);
			}

			await updateDoc(chatSessionRef, updateData);
		} catch (error) {
			console.log("Error saving message:", error);
		}
	};

	const deleteChat = async (chatId) => {
		const userId = getUserId();
		if (!userId) return;
		try {
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				chatId,
				"messages"
			);
			const messagesSnapshot = await getDocs(messagesRef);
			const deletePromises = messagesSnapshot.docs.map((d) => deleteDoc(d.ref));
			await Promise.all(deletePromises);
			const chatSessionRef = doc(db, "users", userId, "chatSessions", chatId);
			await deleteDoc(chatSessionRef);
			if (getCurrentChatId?.() === chatId) {
				await startNewChat();
			}
		} catch (error) {
			console.log("Error deleting chat:", error);
		}
	};

	// Pagination helpers
	const fetchLatestMessagesPage = async (chatId) => {
		const userId = getUserId();
		if (!userId || !chatId)
			return { messages: [], lastCursor: null, hasMore: false };
		try {
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				chatId,
				"messages"
			);
			const q = query(
				messagesRef,
				orderBy("timestamp", "desc"),
				limit(PAGE_SIZE)
			);
			const snapshot = await getDocs(q);
			const docs = snapshot.docs;
			const msgs = docs.map((d) => ({
				id: d.id,
				...d.data(),
				timestamp: d.data().timestamp?.toDate?.() || new Date(),
			}));
			const reversed = msgs.reverse();
			const lastCursor = docs[docs.length - 1] || null;
			const hasMore = docs.length === PAGE_SIZE;
			return { messages: reversed, lastCursor, hasMore };
		} catch (error) {
			console.log("Error fetching latest messages page:", error);
			return { messages: [], lastCursor: null, hasMore: false };
		}
	};

	const fetchOlderMessagesPage = async (chatId, lastCursor) => {
		const userId = getUserId();
		if (!userId || !chatId)
			return { messages: [], lastCursor: null, hasMore: false };
		try {
			const messagesRef = collection(
				db,
				"users",
				userId,
				"chatSessions",
				chatId,
				"messages"
			);
			let q;
			if (!lastCursor) {
				q = query(messagesRef, orderBy("timestamp", "desc"), limit(PAGE_SIZE));
			} else {
				q = query(
					messagesRef,
					orderBy("timestamp", "desc"),
					startAfter(lastCursor),
					limit(PAGE_SIZE)
				);
			}
			const snapshot = await getDocs(q);
			const docs = snapshot.docs;
			const msgs = docs.map((d) => ({
				id: d.id,
				...d.data(),
				timestamp: d.data().timestamp?.toDate?.() || new Date(),
			}));
			const reversed = msgs.reverse();
			const newLastCursor = docs[docs.length - 1] || null;
			const hasMore = docs.length === PAGE_SIZE;
			return { messages: reversed, lastCursor: newLastCursor, hasMore };
		} catch (error) {
			console.log("Error fetching older messages page:", error);
			return { messages: [], lastCursor: null, hasMore: false };
		}
	};

	return {
		loadRecentChats,
		startNewChat,
		loadChat,
		saveMessageToFirebase,
		deleteChat,
		fetchLatestMessagesPage,
		fetchOlderMessagesPage,
	};
};

export default { createFirebaseChatHandlers };
