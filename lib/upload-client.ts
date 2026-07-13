"use client";

export async function uploadFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  return response.ok ? result.url : null;
}

/** Extracts a pasted image file from a clipboard paste event, if any. */
export function pastedImageFile(e: React.ClipboardEvent): File | null {
  for (const item of e.clipboardData.items) {
    if (item.type.startsWith("image/")) {
      return item.getAsFile();
    }
  }
  return null;
}
