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
    const user = await getCurrentAdminUser();
    const userName = user?.name ?? "System";

    const article = await prisma.article.create({
      data: {
        title: body.title,
        slug: `${slugify(body.title)}-${Date.now()}`,
        categoryId: body.categoryId ?? null,
        folderId: body.folderId ?? null,
        description: body.description ?? "",
        overview: body.overview ?? "",
        coverImage: body.coverImage ?? null,
        author: body.author ?? "Unknown",
        status: body.status ?? "Draft",
        ...buildArticleSectionsCreateData({
          ...body,
          updates: (body.updates ?? []).map((item: { title: string; content: string }) => ({
            ...item,
            userName,
          })),
        }),
      },
    });

    await logAction("Created", "Article", article.id, userName);

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