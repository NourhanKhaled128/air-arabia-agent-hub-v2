import "dotenv/config";
import { prisma } from "../lib/prisma";
import * as fs from "fs";

async function main() {
  const airports = await prisma.airport.findMany({ orderBy: [{ country: "asc" }, { airport: "asc" }] });
  let out = "";
  for (const a of airports) out += `${a.code} | ${a.city} | ${a.airport} | ${a.country} | ${a.terminal ?? "-"}\n`;
  fs.writeFileSync(process.argv[2], out, "utf-8");
  console.log(`Wrote ${airports.length} airports to ${process.argv[2]}`);
}
main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
