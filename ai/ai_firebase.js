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

// Factory to create Firebase chat handlers with access to component state via setters/getters
export const createFirebaseChatHandlers = ({
  db,
  getUserId, // () => string | null
  setMessages,
  setRecentChats,
  setCurrentChatId,
  setCurrentChatTitle,
  setIsInitialLoading,
  setIsSidebarOpen,
  getCurrentChatId, // () => string | null
  getCurrentChatTitle, // () => string
  getRecentChats, // () => array
}) => {
  // Load recent chats from Firebase
  const loadRecentChats = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const chatsRef = collection(db, "users", userId, "chatSessions");
      const qRef = query(chatsRef, orderBy("lastMessageTime", "desc"), limit(20));

      const unsubscribe = onSnapshot(qRef, (snapshot) => {
        const chats = [];
        snapshot.forEach((d) => {
          chats.push({
            id: d.id,
            ...d.data(),
            lastMessageTime: d.data().lastMessageTime?.toDate() || new Date(),
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
        text:
          "🌾 Hello, fellow farmer! I'm your AI farming assistant, here to help you grow better crops and manage your farm more effectively.\n\n🚜 I can help you with:\n• Crop diseases and pest identification\n• Soil health and fertilizer advice\n• Planting and harvesting schedules\n• Weather-based farming tips\n• Market insights and pricing\n• Sustainable farming practices\n\nWhat farming challenge can I help you solve today?",
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
      console.error("Error creating new chat session:", error);
      // Leave alerting to the caller UI if desired
    }
  };

  // Load specific chat
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
            timestamp: d.data().timestamp?.toDate() || new Date(),
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
      await addDoc(messagesRef, {
        ...message,
        timestamp: serverTimestamp(),
      });

      const chatSessionRef = doc(db, "users", userId, "chatSessions", currentChatId);
      const updateData = {
        lastMessage:
          message.text.substring(0, 100) + (message.text.length > 100 ? "..." : ""),
        lastMessageTime: serverTimestamp(),
      };

      const currentTitle = getCurrentChatTitle?.() || "";
      if (currentTitle === "New Chat" && !message.isBot) {
        const title =
          message.text.substring(0, 50) + (message.text.length > 50 ? "..." : "");
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
    const userId = getUserId();
    if (!userId) return;

    try {
      const messagesRef = collection(db, "users", userId, "chatSessions", chatId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      const deletePromises = messagesSnapshot.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletePromises);

      const chatSessionRef = doc(db, "users", userId, "chatSessions", chatId);
      await deleteDoc(chatSessionRef);

      if (getCurrentChatId?.() === chatId) {
        await startNewChat();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      // Leave alerting to the caller UI if desired
    }
  };

  return {
    loadRecentChats,
    startNewChat,
    loadChat,
    saveMessageToFirebase,
    deleteChat,
  };
};

export default { createFirebaseChatHandlers };