import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildArticleSectionsReplaceData } from "@/lib/article-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const articleId = Number(id);

    if (!Number.isInteger(articleId)) {
      return NextResponse.json(
        {
          error: "Invalid article id",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();
    const user = await getCurrentAdminUser();
    const userName = user?.name ?? "System";

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        title: body.title,
        categoryId: body.categoryId ?? null,
        folderId: body.folderId ?? null,
        description: body.description,
        overview: body.overview,
        author: body.author,
        status: body.status,
        coverImage: body.coverImage ?? null,
        ...buildArticleSectionsReplaceData({
          ...body,
          updates: (body.updates ?? []).map((item: { title: string; content: string }) => ({
            ...item,
            userName,
          })),
        }),
      },
    });

    await logAction("Updated", "Article", article.id, userName);

    return NextResponse.json(article);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update article",
      },
      {
        status: 500,
      }
    );

  }
}