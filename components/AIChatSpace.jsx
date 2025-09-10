import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import FloatingAIButton from './FloatingAIButton';

const ChatPopup = ({ visible, onClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! 😊 How can I help you today?",
            isBot: true,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (inputText.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputText,
                isBot: false,
                timestamp: new Date(),
            };

            setMessages([...messages, newMessage]);
            setInputText('');

            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    text: "Thanks for your message! I'm here to help you.",
                    isBot: true,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    const MessageBubble = ({ message }) => (
        <View
            className={`mb-3 ${message.isBot ? 'items-start' : 'items-end'
                }`}
        >
            <View className="flex-col ">
                {message.isBot && (
                    <Image source={require('../assets/images/AI.png')}
                        style={{ width: 60, height: 60 }}
                        className="-mb-6 -ml-6" />
                )}
                <View
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.isBot
                        ? 'bg-lime-300/30 border border-primary rounded-tl-none'
                        : 'bg-primary rounded-tr-none'
                        }`}
                >
                    <Text
                        className={`text-sm ${message.isBot ? 'text-gray-800' : 'text-white'
                            }`}
                    >
                        {message.text}
                    </Text>
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
            <View className="flex-1 justify-end bg-black/50">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="bg-white rounded-t-3xl h-full"
                >
                    {/* Header */}
                    <View className="bg-primary rounded-t-3xl px-6 py-4 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3">
                                <Ionicons name="chatbubble" size={16} color="white" />
                            </View>
                            <Text className="text-white text-lg font-semibold">
                                AI Assistant
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Messages */}
                    <ScrollView
                        className="flex-1 px-4 py-4"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                    </ScrollView>

                    {/* Input Area */}
                    <View className="px-4 py-4 bg-primary border-t border-gray-200">
                        <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                            <TouchableOpacity className="mr-3">
                                <Ionicons name="attach" size={20} color="#314C1C" />
                            </TouchableOpacity>

                            <TextInput
                                className="flex-1 text-base text-gray-800 py-2"
                                placeholder="Type here....."
                                placeholderTextColor="#9CA3AF"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                maxLength={500}
                            />

                            <TouchableOpacity
                                onPress={sendMessage}
                                className="ml-3 bg-primary rounded-full p-2"
                                disabled={!inputText.trim()}
                            >
                                <Ionicons name="send" size={16} color="white" />
                            </TouchableOpacity>
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
            <ChatPopup
                visible={isActive}
                onClose={() => setIsActive(false)}
            />
        </View>
    );
};

export default AIChatSpace;