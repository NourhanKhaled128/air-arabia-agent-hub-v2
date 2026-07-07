import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export async function getAirports() {
  return prisma.airport.findMany({
    orderBy: { code: "asc" },
  });
}

export interface AirportRow {
  code: string;
  city: string;
  airport: string;
  country: string;
  terminal?: string;
}

export async function replaceAirportsFromRows(rows: AirportRow[]) {
  if (rows.length === 0) {
    throw new Error("No airport rows found in the uploaded sheet.");
  }

  return prisma.$transaction([
    prisma.airport.deleteMany({}),
    prisma.airport.createMany({ data: rows }),
  ]);
}

const REQUIRED_COLUMNS = ["code", "city", "airport", "country"] as const;

const COLUMN_ALIASES: Record<string, string[]> = {
  code: ["code", "airport code", "iata", "iata code", "airportcode"],
  city: ["city"],
  airport: ["airport", "airport name", "airportname", "name"],
  country: ["country"],
  terminal: ["terminal", "terminals", "terminal(s)"],
};

function normalizeHeader(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export async function parseAirportsWorkbook(buffer: ArrayBuffer): Promise<AirportRow[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("The uploaded file has no worksheets.");
  }

  const headerRow = worksheet.getRow(1);
  const columnIndex: Record<string, number> = {};

  headerRow.eachCell((cell, colNumber) => {
    const header = normalizeHeader(cell.value);

    for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (key in columnIndex) continue;
      if (aliases.includes(header)) {
        columnIndex[key] = colNumber;
      }
    }
  });

  const missing = REQUIRED_COLUMNS.filter((col) => !(col in columnIndex));
  if (missing.length > 0) {
    throw new Error(
      `The uploaded sheet is missing required column(s): ${missing.join(", ")}. Expected header row with: code, city, airport, country (terminal is optional).`
    );
  }

  const rows: AirportRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const code = String(row.getCell(columnIndex.code).value ?? "").trim();
    const city = String(row.getCell(columnIndex.city).value ?? "").trim();
    const airport = String(row.getCell(columnIndex.airport).value ?? "").trim();
    const country = String(row.getCell(columnIndex.country).value ?? "").trim();
    const terminal = columnIndex.terminal
      ? String(row.getCell(columnIndex.terminal).value ?? "").trim()
      : "";

    if (!code && !city && !airport && !country && !terminal) return;

    rows.push({ code, city, airport, country, terminal: terminal || undefined });
  });

  return rows;
}
