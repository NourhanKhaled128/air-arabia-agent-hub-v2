import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const body = await request.json();

    const article = await prisma.article.update({
      where: {
        id: Number(id),
      },
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        overview: body.overview,
        author: body.author,
        status: body.status,
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