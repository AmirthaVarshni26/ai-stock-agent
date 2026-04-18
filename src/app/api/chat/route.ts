import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Initialize the Groq provider
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, currentPrice } = await req.json();

    const result = await streamText({
      model: groq('llama-3.1-70b-versatile'),
      system: `You are a professional Crypto Analyst. 
      The live price of BTC is $${currentPrice}. 
      Provide a brief, expert technical summary.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("AI API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to connect to AI" }), { status: 500 });
  }
}