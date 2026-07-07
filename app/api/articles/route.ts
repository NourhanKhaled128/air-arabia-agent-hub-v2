import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildArticleSectionsCreateData } from "@/lib/article-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

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
        slug: `${slugify(body.title)}-${Date.now()}`,
        category: body.category ?? "",
        description: body.description ?? "",
        overview: body.overview ?? "",
        coverImage: body.coverImage ?? null,
        author: body.author ?? "Unknown",
        status: body.status ?? "Draft",
        ...buildArticleSectionsCreateData(body),
      },
    });

    const user = await getCurrentAdminUser();
    await logAction("Created", "Article", article.id, user?.name ?? "System");

    return NextResponse.json(article);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create article",
      },
      {
        status: 500,
      }
    );
  }
}