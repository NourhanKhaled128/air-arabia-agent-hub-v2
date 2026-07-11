"use client";

import { useEffect } from "react";
import { incrementArticleViewAction } from "@/app/actions/article";

interface Props {
  articleId: number;
}

export default function ArticleViewTracker({ articleId }: Props) {
  useEffect(() => {
    incrementArticleViewAction(articleId).catch(() => {});
  }, [articleId]);

  return null;
}
