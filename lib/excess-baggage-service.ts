import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export interface ExcessBaggageRow {
  hub: string;
  section: string;
  region: string | null;
  destination: string;
  rate: string;
}

function normalizeCell(raw: string): string {
  return raw
    .replace(/[ ​]/g, " ") // non-breaking space / zero-width space -> regular space
    .replace(/[^\S\n]+/g, " ") // collapse runs of non-newline whitespace to a single space
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function cellStr(worksheet: ExcelJS.Worksheet, row: number, col: number): string {
  const cell = worksheet.getRow(row).getCell(col);
  const value = cell.value;

  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "richText" in value) {
    return normalizeCell((value.richText as { text: string }[]).map((r) => r.text).join(""));
  }
  if (typeof value === "object" && "text" in value) {
    return normalizeCell(String((value as { text: unknown }).text ?? ""));
  }

  return normalizeCell(String(value));
}

function parseG9Sheet(ws: ExcelJS.Worksheet): ExcessBaggageRow[] {
  const rows: ExcessBaggageRow[] = [];
  const hub = "G9";

  let r = 5;
  for (; r <= ws.rowCount; r++) {
    const regionA = cellStr(ws, r, 1);

    if (regionA.toLowerCase().startsWith("first 20 kgs")) break;

    const countryB = cellStr(ws, r, 2);
    const rateC = cellStr(ws, r, 3);
    if (regionA && countryB && rateC) {
      rows.push({ hub, section: "Point to Point", region: regionA, destination: countryB, rate: rateC });
    }

    const regionF = cellStr(ws, r, 6);
    const countryG = cellStr(ws, r, 7);
    const rateGcc = cellStr(ws, r, 8);
    const rateOthers = cellStr(ws, r, 9);
    if (regionF && countryG && rateGcc) {
      rows.push({ hub, section: "Connecting to GCC", region: regionF, destination: countryG, rate: rateGcc });
    }
    if (regionF && countryG && rateOthers) {
      rows.push({ hub, section: "Connecting to Others", region: regionF, destination: countryG, rate: rateOthers });
    }
  }

  // Trailing "First 20 Kgs" / "Extra piece" block.
  for (; r <= ws.rowCount; r++) {
    const a = cellStr(ws, r, 1);
    const b = cellStr(ws, r, 2);

    if (a.toLowerCase().startsWith("first 20 kgs")) {
      const match = a.match(/AED\s*\d+/i);
      rows.push({ hub, section: "No baggage customers", region: null, destination: "First 20kg", rate: match?.[0] ?? a });
    } else if (a.toLowerCase() === "extra piece" && b) {
      rows.push({ hub, section: "No baggage customers", region: null, destination: "Extra piece", rate: b });
    } else if (a.toLowerCase().includes("tv handling")) {
      break;
    }
  }

  return rows;
}

function parseE5Sheet(ws: ExcelJS.Worksheet): ExcessBaggageRow[] {
  const rows: ExcessBaggageRow[] = [];
  const hub = "E5";
  let section = "";

  for (let r = 1; r <= ws.rowCount; r++) {
    const a = cellStr(ws, r, 1);
    const b = cellStr(ws, r, 2);
    const aLower = a.toLowerCase();

    if (!a) continue;
    if (aLower.includes("tv handling")) break;

    if (aLower === "from egypt" || aLower === "to egypt") {
      section = section.startsWith("No baggage") ? `No baggage customers — ${a}` : a;
      continue;
    }
    if (aLower === "no baggage customers") {
      section = "No baggage customers";
      continue;
    }
    if ((aLower === "to" || aLower === "from") && b.toLowerCase().includes("rate")) continue;
    if (aLower.includes("airport handling fees") || aLower.startsWith("effective")) continue;

    if (aLower === "extra piece" && b) {
      rows.push({ hub, section: "Extra piece", region: null, destination: a, rate: b });
      continue;
    }

    if (a && b) {
      rows.push({ hub, section, region: null, destination: a, rate: b });
    }
  }

  return rows;
}

function parse3OSheet(ws: ExcelJS.Worksheet): ExcessBaggageRow[] {
  const rows: ExcessBaggageRow[] = [];
  const hub = "3O";
  let noBaggage = false;

  for (let r = 1; r <= ws.rowCount; r++) {
    const a = cellStr(ws, r, 1);
    const b = cellStr(ws, r, 2);
    const d = cellStr(ws, r, 4);
    const e = cellStr(ws, r, 5);
    const aLower = a.toLowerCase();

    if (aLower.includes("no baggage customers")) {
      noBaggage = true;
      continue;
    }
    if (aLower.includes("no restriction")) continue;
    if (aLower === "rate per kg" || aLower === "rate from morocco" || aLower === "excess baggage rate per kg") continue;

    const fromSection = noBaggage ? "No baggage customers — From Morocco" : "From Morocco";
    const toSection = noBaggage ? "No baggage customers — To Morocco" : "To Morocco";

    if (a && b && a.toLowerCase() !== "from morocco") {
      rows.push({ hub, section: fromSection, region: null, destination: a, rate: b });
    }
    if (d && e && d.toLowerCase() !== "to morocco") {
      rows.push({ hub, section: toSection, region: null, destination: d, rate: e });
    }
  }

  return rows;
}

function parse9PSheet(ws: ExcelJS.Worksheet): ExcessBaggageRow[] {
  const rows: ExcessBaggageRow[] = [];
  const hub = "9P";
  const sectionHeaders = [
    "domestic sectors",
    "international sectors departing from pakistan",
    "international sectors coming to pakistan",
  ];
  let section = "";

  for (let r = 1; r <= ws.rowCount; r++) {
    const a = cellStr(ws, r, 1);
    const b = cellStr(ws, r, 2);
    const aLower = a.toLowerCase();

    if (!a) continue;

    if (sectionHeaders.includes(aLower)) {
      section = a;
      continue;
    }

    if (a && b && section) {
      rows.push({ hub, section, region: null, destination: a, rate: b });
    }
  }

  return rows;
}

const SHEET_PARSERS: Record<string, (ws: ExcelJS.Worksheet) => ExcessBaggageRow[]> = {
  "g9 & 3l": parseG9Sheet,
  e5: parseE5Sheet,
  "3o": parse3OSheet,
  "9p": parse9PSheet,
};

export async function parseExcessBaggageWorkbook(buffer: ArrayBuffer): Promise<ExcessBaggageRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const rows: ExcessBaggageRow[] = [];
  const foundSheets: string[] = [];

  for (const worksheet of workbook.worksheets) {
    const key = worksheet.name.trim().toLowerCase();
    const parser = SHEET_PARSERS[key];
    if (!parser) continue;

    foundSheets.push(worksheet.name);
    rows.push(...parser(worksheet));
  }

  if (foundSheets.length === 0) {
    throw new Error(
      'No recognized sheets found. Expected sheet names: "G9 & 3L", "E5", "3O", "9P".'
    );
  }

  if (rows.length === 0) {
    throw new Error("Recognized sheets were found, but no rate rows could be parsed from them.");
  }

  return rows;
}

export async function replaceExcessBaggageRatesFromRows(rows: ExcessBaggageRow[]) {
  return prisma.$transaction([
    prisma.excessBaggageRate.deleteMany({}),
    prisma.excessBaggageRate.createMany({
      data: rows.map((row, index) => ({ ...row, order: index })),
    }),
  ]);
}

export async function getExcessBaggageRatesByHub(hub: string) {
  return prisma.excessBaggageRate.findMany({
    where: { hub },
    orderBy: { order: "asc" },
  });
}

export async function getAllExcessBaggageRates() {
  return prisma.excessBaggageRate.findMany({ orderBy: [{ hub: "asc" }, { order: "asc" }] });
}

export async function applyExcessBaggageRatesToKB(rows: ExcessBaggageRow[]) {
  const { regenerateG9 } = await import("./excess-baggage-formatters/g9");
  const { regenerate3O } = await import("./excess-baggage-formatters/3o");
  const { regenerate9P } = await import("./excess-baggage-formatters/9p");
  const { regenerateE5 } = await import("./excess-baggage-formatters/e5");

  await regenerateG9(rows.filter((r) => r.hub === "G9"));
  await regenerate3O(rows.filter((r) => r.hub === "3O"));
  await regenerate9P(rows.filter((r) => r.hub === "9P"));
  await regenerateE5(rows.filter((r) => r.hub === "E5"));
}
