import { FARMER_SYSTEM_PROMPT } from "./ai_contest";

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
			if (message.imageUrl && !message.isBot) {
				conversationParts.push({ text: `User shared an image` });
			}
		}
	});
	return conversationParts;
};

export const callGeminiAPI = async (
	userMessage,
	messages = [],
	imageUrl = null
) => {
	try {
		if (!GEMINI_API_KEY) throw new Error("Gemini API key not found");

		const conversationHistory = buildConversationHistory(messages);
		conversationHistory.push({ text: `User: ${userMessage}` });

		let payload;

		if (imageUrl) {
			console.log("Processing image with Gemini Vision API");

			// Fetch image and convert to base64
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			const base64Data = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					// Remove data:image/jpeg;base64, prefix
					const base64 = reader.result.split(",")[1];
					resolve(base64);
				};
				reader.readAsDataURL(blob);
			});

			payload = {
				contents: [
					{
						parts: [
							...conversationHistory,
							{
								inlineData: {
									mimeType: "image/jpeg",
									data: base64Data,
								},
							},
						],
					},
				],
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
		} else {
			// Text-only request
			payload = {
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
		}

		console.log("Sending to Gemini API:", {
			hasImage: !!imageUrl,
			text: userMessage,
			imageUrl: imageUrl,
		});

		const response = await fetch(GEMINI_API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.log("Gemini API error response:", errorData);
			throw new Error(errorData.error?.message || "Unknown Gemini error");
		}

		const data = await response.json();
		const responseText =
			data.candidates?.[0]?.content?.parts?.[0]?.text ||
			"Sorry, I couldn't generate a response.";

		return responseText.replace(/^Assistant:\s*/, "");
	} catch (error) {
		console.log("Gemini API error:", error);

		if (imageUrl) {
			return `🚜 I had trouble analyzing your image. Please try again or describe what you see in words.\n\nError: ${error.message}`;
		}

		return `🚜 Sorry, I'm having trouble connecting right now. Please check your internet connection and try again.\n\nError: ${error.message}`;
	}
};

// Keep this for backward compatibility, but it now uses direct API call
export const callGeminiAPIExternal = async (
	input,
	messages,
	imageUrl = null
) => {
	return await callGeminiAPI(input, messages, imageUrl);
};

// Re-export the prompt
export { FARMER_SYSTEM_PROMPT };
