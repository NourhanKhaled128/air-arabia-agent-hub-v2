import "dotenv/config";
import { prisma } from "../lib/prisma";
import * as fs from "fs";

async function main() {
  const articles = await prisma.article.findMany({
    where: { category: { group: "Knowledge Base" }, NOT: { category: { name: "Training" } } },
    include: {
      category: true,
      folder: true,
      procedures: true,
      dispositions: true,
      escalations: true,
      keywords: true,
      notes: true,
      references: true,
      scenarios: true,
      chatTemplates: true,
      emailTemplates: true,
    },
    orderBy: { id: "asc" },
  });

  let out = "";
  for (const a of articles) {
    if (a.category?.name === "Training") continue;
    out += `\n\n================ ARTICLE [${a.id}] ${a.title} ================\n`;
    out += `Category: ${a.category?.name} / Folder: ${a.folder?.name ?? "-"}\n`;
    out += `Description: ${a.description}\n`;
    out += `Overview:\n${a.overview}\n`;
    if (a.procedures.length) {
      out += `\n-- Procedures --\n`;
      for (const p of a.procedures) out += `${p.stepNo}. ${p.title ?? ""}: ${p.content}\n`;
    }
    if (a.scenarios.length) {
      out += `\n-- Scenarios --\n`;
      for (const s of a.scenarios) out += `Q: ${s.situation}\nA: ${s.response}\n`;
    }
    if (a.notes.length) {
      out += `\n-- Notes --\n`;
      for (const n of a.notes) out += `[${n.type}] ${n.content}\n`;
    }
    if (a.dispositions.length) {
      out += `\n-- Dispositions --\n`;
      for (const d of a.dispositions) out += `${d.code ?? ""} ${d.category ?? ""}: ${d.content}\n`;
    }
    if (a.escalations.length) {
      out += `\n-- Escalations --\n`;
      for (const e of a.escalations) out += `${e.department ?? ""} (${e.condition ?? ""}): ${e.content}\n`;
    }
    if (a.references.length) {
      out += `\n-- References --\n`;
      for (const r of a.references) out += `${r.title} (${r.type}): ${r.link ?? ""}\n`;
    }
    if (a.keywords.length) {
      out += `\nKeywords: ${a.keywords.map((k) => k.value).join(", ")}\n`;
    }
  }

  fs.writeFileSync(process.argv[2], out, "utf-8");
  console.log(`Wrote ${out.length} chars for ${articles.length} articles to ${process.argv[2]}`);

  const trees = await prisma.decisionTree.findMany({
    include: { nodes: { include: { options: { include: { targetTree: { select: { title: true } } } } }, orderBy: { order: "asc" } } },
    orderBy: { id: "asc" },
  });

  let tOut = "";
  for (const t of trees) {
    tOut += `\n\n================ TREE [${t.id}] ${t.title} (topic: ${t.topic}) ================\n`;
    tOut += `Description: ${t.description ?? ""}\n`;
    for (const n of t.nodes) {
      tOut += `  Node[${n.id}] (${n.type}, order ${n.order}): ${n.text}\n`;
      for (const o of n.options) {
        tOut += `    -> "${o.label}" => ${o.targetNodeId ? `node ${o.targetNodeId}` : o.targetTree ? `TREE: ${o.targetTree.title}` : "?"}\n`;
      }
    }
  }
  fs.writeFileSync(process.argv[3], tOut, "utf-8");
  console.log(`Wrote ${tOut.length} chars for ${trees.length} trees to ${process.argv[3]}`);
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
