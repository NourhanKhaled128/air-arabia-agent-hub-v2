"use client";

import { useState } from "react";

import ArticleInfo from "./ArticleInfo";
import OverviewSection from "./OverviewSection";
import PublishSection from "./PublishSection";

export default function ArticleForm() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    overview: "",
    author: "Nourhan Khaled",
  });

  function updateField(name: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

const text = await response.text();

console.log(text);

const result = JSON.parse(text);
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to save article.");
      }

      alert("Article saved successfully!");

      setFormData({
        title: "",
        category: "",
        description: "",
        overview: "",
        author: "Nourhan Khaled",
      });

    } catch (error) {

      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unknown error"
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <ArticleInfo
        data={formData}
        updateField={updateField}
      />

      <OverviewSection
        data={formData}
        updateField={updateField}
      />

      <PublishSection
        loading={loading}
      />
    </form>
  );
}