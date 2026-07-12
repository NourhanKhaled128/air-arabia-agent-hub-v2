import { NextResponse } from "next/server";
import { updateDecisionTree, deleteDecisionTree, type DecisionTreeInput } from "@/lib/decision-tree-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const treeId = Number(id);

    if (!Number.isInteger(treeId)) {
      return NextResponse.json({ error: "Invalid decision tree id" }, { status: 400 });
    }

    const body = (await request.json()) as DecisionTreeInput;
    const user = await getCurrentAdminUser();
    const userName = user?.name ?? "System";

    const tree = await updateDecisionTree(treeId, {
      ...body,
      author: body.author || userName,
    });

    await logAction("Updated", "DecisionTree", tree.id, userName);

    return NextResponse.json(tree);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to update decision tree" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const treeId = Number(id);

    if (!Number.isInteger(treeId)) {
      return NextResponse.json({ error: "Invalid decision tree id" }, { status: 400 });
    }

    const user = await getCurrentAdminUser();
    const userName = user?.name ?? "System";

    await deleteDecisionTree(treeId);
    await logAction("Deleted", "DecisionTree", treeId, userName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to delete decision tree" }, { status: 500 });
  }
}
