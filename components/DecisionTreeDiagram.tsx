interface Option {
  id: number;
  label: string;
  targetNodeId: number | null;
}

interface Node {
  id: number;
  type: string;
  text: string;
  options: Option[];
}

interface Props {
  nodes: Node[];
}

function renderNode(nodeId: number | null, nodesById: Map<number, Node>, visited: Set<number>) {
  if (nodeId === null) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-border-subtle px-3 py-2 text-sm text-gray-400 dark:text-slate-500">
        (end of this path)
      </div>
    );
  }

  const node = nodesById.get(nodeId);
  if (!node || visited.has(nodeId)) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-border-subtle px-3 py-2 text-sm text-gray-400 dark:text-slate-500">
        (end of this path)
      </div>
    );
  }

  const nextVisited = new Set(visited).add(nodeId);

  if (node.type === "outcome") {
    return (
      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-gray-800 dark:text-slate-100">
        {node.text}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-border-subtle p-4">
      <p className="font-semibold text-gray-900 dark:text-slate-100">{node.text}</p>

      <div className="mt-3 space-y-3 border-l-2 border-gray-100 dark:border-border-subtle pl-4">
        {node.options.map((option) => (
          <div key={option.id}>
            <span className="mb-1.5 inline-block rounded-full bg-red-100 dark:bg-brand/10 px-3 py-1 text-xs font-semibold text-red-700 dark:text-brand">
              {option.label}
            </span>
            {renderNode(option.targetNodeId, nodesById, nextVisited)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DecisionTreeDiagram({ nodes }: Props) {
  const nodesById = new Map(nodes.map((n) => [n.id, n]));
  const rootId = nodes[0]?.id ?? null;

  return <div>{renderNode(rootId, nodesById, new Set())}</div>;
}
