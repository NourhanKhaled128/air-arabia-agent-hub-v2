export interface TreeOptionSpec {
  label: string;
  targetClientKey: number;
}

export interface TreeNodeSpec {
  clientKey: number;
  type: "question" | "outcome";
  text: string;
  options?: TreeOptionSpec[];
}

export interface DecisionTreeSpec {
  title: string;
  description: string;
  topic: string;
  sourceArticleSlug: string;
  nodes: TreeNodeSpec[];
}
