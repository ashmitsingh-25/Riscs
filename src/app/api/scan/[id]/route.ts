import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const scan = await prisma.scanTask.findFirst({
      where: {
        OR: [{ id: id }, { trackingId: id }],
      },
      include: {
        riskResult: true,
      },
    });

    if (!scan) {
      return NextResponse.json({ error: "Scan task not found" }, { status: 404 });
    }

    return NextResponse.json({ scan });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve scan" }, { status: 500 });
  }
}
