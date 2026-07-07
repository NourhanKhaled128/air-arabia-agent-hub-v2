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
    const header = String(cell.value ?? "").trim().toLowerCase();
    if ((REQUIRED_COLUMNS as readonly string[]).includes(header)) {
      columnIndex[header] = colNumber;
    }
  });

  const missing = REQUIRED_COLUMNS.filter((col) => !(col in columnIndex));
  if (missing.length > 0) {
    throw new Error(
      `The uploaded sheet is missing required column(s): ${missing.join(", ")}. Expected header row with: code, city, airport, country.`
    );
  }

  const rows: AirportRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const code = String(row.getCell(columnIndex.code).value ?? "").trim();
    const city = String(row.getCell(columnIndex.city).value ?? "").trim();
    const airport = String(row.getCell(columnIndex.airport).value ?? "").trim();
    const country = String(row.getCell(columnIndex.country).value ?? "").trim();

    if (!code && !city && !airport && !country) return;

    rows.push({ code, city, airport, country });
  });

  return rows;
}
