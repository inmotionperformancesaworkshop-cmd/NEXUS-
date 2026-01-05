import { GoogleGenAI, Type } from "@google/genai";
import { ModelId, ModelProfile, GenerationResult, Review } from "../types";
import { MODELS } from "../constants";

// Initialize the API client
// Note: In a real "Link my accounts" app, we would use different clients. 
// For this demo, we use Gemini to power the 'Personas' to simulate the requested functionality.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Use the Flash model for speed as we are making parallel requests
const MODEL_NAME = 'gemini-3-flash-preview'; 

export const generatePersonaResponse = async (
  modelId: ModelId,
  userPrompt: string
): Promise<GenerationResult> => {
  try {
    const profile = MODELS[modelId];
    
    // We strictly use the provided system prompt instructions for the specific model persona
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: `${profile.systemPromptStyle} Keep your response under 150 words.`,
        temperature: 0.7, // Add variety
      }
    });

    return {
      modelId,
      content: response.text || "No response generated.",
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`Error generating for ${modelId}:`, error);
    return {
      modelId,
      content: "Connection failed. System offline.",
      timestamp: Date.now()
    };
  }
};

export const reviewAndGradeResponse = async (
  reviewerId: ModelId,
  targetContent: string
): Promise<Review> => {
  try {
    const profile = MODELS[reviewerId];

    // JSON Schema for structured review
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Review the following text provided by an anonymous AI model:\n\n"${targetContent}"\n\nCritique it based on accuracy, clarity, and style. Then assign a score out of 10.`,
      config: {
        systemInstruction: `You are acting as ${profile.name}. ${profile.systemPromptStyle} You are conducting a blind peer review. Be critical but fair. Return JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critique: { type: Type.STRING, description: "A 1-2 sentence critique of the answer." },
            score: { type: Type.NUMBER, description: "A score from 1 to 10 (can use decimals)." }
          },
          required: ["critique", "score"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");

    return {
      reviewerId,
      targetModelId: ModelId.GEMINI, // Placeholder, updated in caller
      critique: json.critique || "Analysis failed.",
      score: typeof json.score === 'number' ? json.score : 0
    };
  } catch (error) {
    console.error(`Error reviewing by ${reviewerId}:`, error);
    return {
      reviewerId,
      targetModelId: ModelId.GEMINI,
      critique: "Review process interrupted.",
      score: 0
    };
  }
};