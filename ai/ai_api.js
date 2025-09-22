import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../config/firebase"; // Adjust path as needed
import { FARMER_SYSTEM_PROMPT } from "./ai_contest"; // Import from ai_contest.js

// Initialize Firebase Functions
const functions = getFunctions(app);

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const buildConversationHistory = (messages = []) => {
	const recentMessages = messages.slice(-10);
	const conversationParts = [{ text: FARMER_SYSTEM_PROMPT }]; // Use imported prompt
	recentMessages.forEach((message) => {
		if (message.id !== "welcome") {
			conversationParts.push({
				text: `${message.isBot ? "Assistant" : "User"}: ${message.text}`,
			});
			if (message.image && !message.isBot) {
				conversationParts.push({ text: `User image: ${message.image}` });
			}
		}
	});
	return conversationParts;
};

export const callGeminiAPI = async (userMessage, messages = []) => {
	try {
		if (!GEMINI_API_KEY) throw new Error("Gemini API key not found");
		const conversationHistory = buildConversationHistory(messages);
		conversationHistory.push({ text: `User: ${userMessage}` });

		const payload = {
			contents: [{ parts: conversationHistory }],
			generationConfig: {
				temperature: 0.7,
				topK: 40,
				topP: 0.95,
				maxOutputTokens: 1024,
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
		};

		const response = await fetch(GEMINI_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || "Unknown Gemini error");
		}

		const data = await response.json();
		const responseText =
			data.candidates?.[0]?.content?.parts?.[0]?.text ||
			"Sorry, I couldn't generate a response.";
		return responseText.replace(/^Assistant:\s*/, "");
	} catch (error) {
		console.error("Gemini API error:", error);
		return `🚜 Sorry, I'm having trouble connecting right now. Please check your internet connection and try again.\n\nError details: ${error.message}`;
	}
};

// Updated to use Firebase Cloud Function
export const callGeminiAPIExternal = async (
	input,
	messages,
	imageUrl = null
) => {
	try {
		// Prepare the payload for Firebase Function
		const payload = {
			text: input,
			chatHistory: messages.slice(-10).map((msg) => ({
				text: msg.text,
				isBot: msg.isBot,
				timestamp: msg.timestamp,
			})),
			imageUrl: imageUrl, // Cloudflare R2 URL
		};

		console.log("Calling Firebase Function with:", {
			hasImage: !!imageUrl,
			text: input,
			imageUrl: imageUrl,
		});

		// Call Firebase Cloud Function
		const callGeminiFunction = httpsCallable(functions, "callGeminiWithImage");
		const result = await callGeminiFunction(payload);

		return result.data.response;
	} catch (error) {
		console.error("Error calling Firebase Function:", error);

		// Provide more specific error messages
		if (error.message.includes("image")) {
			return "🚜 I had trouble analyzing your image. Please try again or describe the issue in words.";
		}

		// Fallback to direct text-only API if Firebase Function fails
		if (imageUrl) {
			console.log("Falling back to text-only API due to function error");
			return callGeminiAPI(input, messages);
		}

		throw error;
	}
};
// Re-export the prompt in case other files need it
export { FARMER_SYSTEM_PROMPT };
