// -------------------- ai_api.js (local inline helper) --------------------
// You may extract this to ../../ai/ai_api.js if preferred. This version expects an image URL to be included in user prompt when needed.

export const FARMER_SYSTEM_PROMPT = `You are an expert agricultural assistant designed to help farmers with practical, actionable advice. Use clear language, emojis, step-by-step guidance, and analyze images when an image URL is provided.`;

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const buildConversationHistory = (messages = []) => {
	const recentMessages = messages.slice(-10);
	const conversationParts = [{ text: FARMER_SYSTEM_PROMPT }];
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
