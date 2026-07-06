import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: slugify(body.title),
        category: body.category ?? "",
        description: body.description ?? "",
        overview: body.overview ?? "",
        author: body.author ?? "Unknown",
        status: "Draft",
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("===== API ERROR =====");
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}