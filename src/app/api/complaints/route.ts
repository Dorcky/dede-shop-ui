import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Complaint } from "@/types";

const filePath = path.join(process.cwd(), "src/data/complaints.json");

async function readComplaints(): Promise<Complaint[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeComplaints(complaints: Complaint[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(complaints, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const complaints = await readComplaints();

    const newComplaint: Complaint = {
      id: body.type === "RETURN" ? `ret-${Date.now()}` : `rec-${Date.now()}`,
      type: body.type,
      orderId: body.orderId || null,
      userId: body.userId || null,
      name: body.name,
      email: body.email,
      subject: body.subject,
      reason: body.reason || null,
      message: body.message,
      status: "OPEN",
      createdAt: new Date().toISOString()
    };

    complaints.unshift(newComplaint);
    await writeComplaints(complaints);

    return NextResponse.json(newComplaint, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const complaints = await readComplaints();
    return NextResponse.json(complaints);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
