import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

export const maxDuration = 30;
export const runtime = "edge";

export const POST = async (request: Request) => {
  const { messages } = await request.json();

  const result = streamText({
    model: xai("grok-2-1212"),
    messages,
    abortSignal: request.signal,
  });

  return result.toDataStreamResponse({ sendUsage: false, sendReasoning: true });
};
