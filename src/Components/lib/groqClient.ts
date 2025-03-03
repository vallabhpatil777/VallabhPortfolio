import { ChatGroq } from "@langchain/groq";

const groqApiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!groqApiKey) {
  throw new Error("Missing GROQ API Key");
}

export const groqChatModel = new ChatGroq({
  apiKey: groqApiKey,
  model: "llama3-8b-8192", 
});
