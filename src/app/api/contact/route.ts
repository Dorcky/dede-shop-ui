import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { ContactMessage } from "@/types";

const filePath = path.join(process.cwd(), "src/data/contact-messages.json");

async function readMessages(): Promise<ContactMessage[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMessages(messages: ContactMessage[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(messages, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = await readMessages();

    const newMessage: ContactMessage = {
      id: `cm-${Date.now()}`,
      name: body.name,
      email: body.email,
      topicId: body.topicId,
      message: body.message,
      userId: body.userId || null,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    messages.unshift(newMessage);
    await writeMessages(messages);

    return NextResponse.json(newMessage, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
