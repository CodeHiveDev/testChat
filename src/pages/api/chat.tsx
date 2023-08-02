// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { BotReplyResponse } from "../../types/apiTypes";
import { OpenAI } from "langchain/llms/openai";
import { HumanMessage, ChatMessage, SystemMessage } from "langchain/schema";

const llm = new OpenAI({
  openAIApiKey: "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",
  temperature: 0.9,
});



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | BotReplyResponse>
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        const initialMessage = {
          text: "Hello! How can I assist you?",
          isUser: false,
        };
        res.status(200).json([initialMessage]);
      } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
      }
      break;

    case "POST":
      try {
        const { text } = body;
        const botReply = await generateBotReply(text);

        res.status(200).json({ text: botReply });
      } catch (error) {
        res.status(500).json({ error: "Error sending message" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function generateBotReply(input: string): Promise<string> {
  
  
 
  // "Feetful of Fun"

  try {

    const result = await llm.predictMessages([
      new HumanMessage(input)
    ]);

    console.log(result?.data)

    return result?.data;
    
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to get bot reply.");
  }
}
