import { NextResponse } from "next/server";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const runtime = "edge";
export async function POST(req: Request) {
  // Wrap with a try/catch to handle API errors
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: "You must be Signed In." },
        { status: 401 },
      );
    }
    const points = Number(user?.publicMetadata?.points || 0);
    if (!points) {
      return NextResponse.json(
        { message: "You run out of points." },
        { status: 402 },
      );
    }
    const { messages } = await req.json();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });
    // Deduct points
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        points: points - 1,
      },
    });
    console.log("Deduct points");
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}
