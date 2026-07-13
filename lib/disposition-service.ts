import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export interface DispositionCodeRow {
  code: string;
  label: string;
  description?: string;
  category?: string;
  active: boolean;
}

export async function getDispositionCodes() {
  return prisma.dispositionCode.findMany({
    orderBy: [{ category: "asc" }, { code: "asc" }],
  });
}

export async function getActiveDispositionCodes() {
  return prisma.dispositionCode.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { code: "asc" }],
  });
}

export async function getDispositionCategories() {
  const rows = await prisma.dispositionCode.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((row) => row.category as string);
}

export async function getDispositionCodeById(id: number) {
  return prisma.dispositionCode.findUnique({
    where: { id },
  });
}

export async function createDispositionCode(data: {
  code: string;
  label: string;
  description?: string;
  category?: string;
  active: boolean;
}) {
  return prisma.dispositionCode.create({ data });
}

export async function updateDispositionCode(
  id: number,
  data: Partial<{
    code: string;
    label: string;
    description: string;
    category: string;
    active: boolean;
  }>
) {
  return prisma.dispositionCode.update({
    where: { id },
    data,
  });
}

export async function deleteDispositionCode(id: number) {
  return prisma.dispositionCode.delete({
    where: { id },
  });
}

export async function replaceDispositionCodesFromRows(rows: DispositionCodeRow[]) {
  if (rows.length === 0) {
    throw new Error("No disposition code rows found in the uploaded sheet.");
  }

  return prisma.$transaction([
    prisma.dispositionCode.deleteMany({}),
    prisma.dispositionCode.createMany({ data: rows }),
  ]);
}

const REQUIRED_COLUMNS = ["code", "label"] as const;

const COLUMN_ALIASES: Record<string, string[]> = {
  category: ["category", "type"],
  code: ["code", "subtype"],
  label: ["label", "subtype", "name"],
  description: ["description", "call scenario", "scenario"],
  active: ["active", "status"],
};

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function parseActive(value: unknown): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return true;
  return !["false", "inactive", "no", "0"].includes(normalized);
}

function findColumnIndex(row: ExcelJS.Row): Record<string, number> {
  const columnIndex: Record<string, number> = {};

  row.eachCell((cell, colNumber) => {
    const header = normalizeHeader(cell.value);

    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (key in columnIndex) continue;
      if (aliases.includes(header)) {
        columnIndex[key] = colNumber;
      }
    }
  });

  return columnIndex;
}

const MAX_HEADER_SEARCH_ROWS = 5;

export async function parseDispositionCodesWorkbook(buffer: ArrayBuffer): Promise<DispositionCodeRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("The uploaded file has no worksheets.");
  }

  let columnIndex: Record<string, number> = {};
  let headerRowNumber = 1;

  for (let rowNumber = 1; rowNumber <= MAX_HEADER_SEARCH_ROWS; rowNumber++) {
    const candidate = findColumnIndex(worksheet.getRow(rowNumber));
    if (REQUIRED_COLUMNS.every((col) => col in candidate)) {
      columnIndex = candidate;
      headerRowNumber = rowNumber;
      break;
    }
  }

  const missing = REQUIRED_COLUMNS.filter((col) => !(col in columnIndex));
  if (missing.length > 0) {
    throw new Error(
      `Could not find a header row with the required column(s): ${missing.join(", ")}. Expected a header row (within the first ${MAX_HEADER_SEARCH_ROWS} rows) with: code (or Subtype), label (or Subtype/Name) — category/type, description/call scenario, and active are optional.`
    );
  }

  const rows: DispositionCodeRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowNumber) return;

    const code = String(row.getCell(columnIndex.code).value ?? "").trim();
    const label = String(row.getCell(columnIndex.label).value ?? "").trim();
    const category = columnIndex.category
      ? String(row.getCell(columnIndex.category).value ?? "").trim()
      : "";
    const description = columnIndex.description
      ? String(row.getCell(columnIndex.description).value ?? "").trim()
      : "";
    const active = columnIndex.active
      ? parseActive(row.getCell(columnIndex.active).value)
      : true;

    if (!code && !label && !category && !description) return;

    rows.push({
      code,
      label,
      category: category || undefined,
      description: description || undefined,
      active,
    });
  });

  return rows;
}
