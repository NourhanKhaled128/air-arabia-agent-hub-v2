import { NextResponse } from "next/server";
import { createDecisionTree, type DecisionTreeInput } from "@/lib/decision-tree-service";
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
    const body = (await request.json()) as DecisionTreeInput;
    const user = await getCurrentAdminUser();
    const userName = user?.name ?? "System";

    const tree = await createDecisionTree({
      ...body,
      slug: `${slugify(body.title)}-${Date.now()}`,
      author: body.author || userName,
    });

    await logAction("Created", "DecisionTree", tree.id, userName);

    return NextResponse.json(tree);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create decision tree" },
      { status: 500 }
    );
  }
}
