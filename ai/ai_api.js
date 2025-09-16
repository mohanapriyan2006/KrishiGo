// Gemini API configuration and helper functions extracted from AIChatSpace

import { FARMER_SYSTEM_PROMPT } from "./ai_contest";

// Environment-driven API key (Expo public env var)
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Farmer-friendly system prompt
const farmer_system_prompt = FARMER_SYSTEM_PROMPT

// Build conversation history for context
export const buildConversationHistory = (messages = []) => {
    const recentMessages = messages.slice(-10);
    const conversationParts = [
        {
            text: farmer_system_prompt,
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
export const callGeminiAPI = async (userMessage, messages = []) => {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error("Gemini API key not found in environment variables");
        }

        const conversationHistory = buildConversationHistory(messages);
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

export default {
    callGeminiAPI,
    buildConversationHistory,
    FARMER_SYSTEM_PROMPT,
};