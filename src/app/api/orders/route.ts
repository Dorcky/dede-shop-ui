import { NextResponse } from "next/server";
import { Order } from "@/types";
import fs from "fs/promises";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "src/data/orders.json");

async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ordersFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

export async function GET() {
  try {
    const orders = await readOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orders = await readOrders();

    const newOrder: Order = {
      ...body,
      id: `DNK-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    await writeOrders(orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
