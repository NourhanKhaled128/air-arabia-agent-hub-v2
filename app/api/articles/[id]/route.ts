import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildArticleSectionsReplaceData } from "@/lib/article-service";

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

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        overview: body.overview,
        author: body.author,
        status: body.status,
        coverImage: body.coverImage ?? null,
        ...buildArticleSectionsReplaceData(body),
      },
    });

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