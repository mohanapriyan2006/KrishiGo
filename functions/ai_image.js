import { FARMER_SYSTEM_PROMPT } from "../ai/ai_contest";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require("node-fetch");

admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.callGeminiWithImage = functions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new functions.https.HttpsError(
			"unauthenticated",
			"User must be authenticated"
		);
	}

	try {
		const { text, chatHistory, imageUrl } = data;

		// Use gemini-pro-vision for images, gemini-pro for text only
		const modelName = imageUrl ? "gemini-pro-vision" : "gemini-pro";
		const model = genAI.getGenerativeModel({
			model: modelName,
			generationConfig: {
				temperature: 0.7,
				topK: 40,
				topP: 0.95,
				maxOutputTokens: 1024,
			},
		});

		// Build conversation history
		let prompt = FARMER_SYSTEM_PROMPT + "\n\n";

		if (chatHistory && chatHistory.length > 0) {
			prompt += "Previous conversation:\n";
			chatHistory.forEach((message) => {
				const role = message.isBot ? "Assistant" : "User";
				prompt += `${role}: ${message.text}\n`;
			});
			prompt += "\n";
		}

		prompt += `Current user message: ${text}`;

		let result;

		if (imageUrl) {
			console.log("Processing image analysis for URL:", imageUrl);

			// Fetch the image from Cloudflare R2
			const response = await fetch(imageUrl);
			if (!response.ok) {
				throw new Error(
					`Failed to fetch image: ${response.status} ${response.statusText}`
				);
			}

			// Get image buffer
			const imageBuffer = await response.buffer();
			const imageBase64 = imageBuffer.toString("base64");

			// For vision model, structure the content differently
			const contents = [
				{
					role: "user",
					parts: [
						{ text: prompt },
						{
							inlineData: {
								mimeType: "image/jpeg",
								data: imageBase64,
							},
						},
					],
				},
			];

			result = await model.generateContent(contents);
		} else {
			// Text-only request
			result = await model.generateContent(prompt);
		}

		const responseText = await result.response;
		return { response: responseText.text() };
	} catch (error) {
		console.log("Error in callGeminiWithImage:", error);
		throw new functions.https.HttpsError("internal", error.message);
	}
});
