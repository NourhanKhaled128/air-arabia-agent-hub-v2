import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";
import { PERMISSION_KEYS } from "../lib/role-service";

const prisma = new PrismaClient();

async function seedSidebarLinks() {
  const count = await prisma.sidebarLink.count();
  if (count > 0) return;

  await prisma.sidebarLink.createMany({
    data: [
      { label: "Reservations", href: "/Reservations", icon: "Plane", section: "pinned", order: 0 },
      { label: "Knowledge", href: "/Knowledge", icon: "BookOpen", section: "pinned", order: 1 },
      { label: "Flight Disruptions", href: "/disruptions", icon: "AlertTriangle", section: "pinned", order: 2 },
      { label: "Time Converter", href: "/time-converter", icon: "Clock3", section: "tools", order: 0 },
      { label: "Airport Codes", href: "/airport-codes", icon: "Globe", section: "tools", order: 1 },
      { label: "Currency Converter", href: "/currency-converter", icon: "DollarSign", section: "tools", order: 2 },
      { label: "Weight Converter", href: "/weight-converter", icon: "Scale", section: "tools", order: 3 },
      { label: "Flight Duration", href: "/flight-duration", icon: "Timer", section: "tools", order: 4 },
      { label: "Layover Calculator", href: "/layover-calculator", icon: "Timer", section: "tools", order: 5 },
    ],
  });

  console.log("Seeded default sidebar links.");
}

async function seedReferenceToolLinks() {
  const existing = await prisma.sidebarLink.findMany({
    where: { href: { in: ["/disposition-codes", "/escalation"] } },
  });
  const existingHrefs = new Set(existing.map((link) => link.href));

  const toCreate = [
    { label: "Disposition Codes", href: "/disposition-codes", icon: "ClipboardList", section: "tools", order: 6 },
    { label: "Escalation Contacts", href: "/escalation", icon: "PhoneCall", section: "tools", order: 7 },
  ].filter((link) => !existingHrefs.has(link.href));

  if (toCreate.length === 0) return;

  await prisma.sidebarLink.createMany({ data: toCreate });

  console.log("Seeded disposition/escalation sidebar links.");
}

async function seedCustomerSupportLink() {
  const existing = await prisma.sidebarLink.findFirst({
    where: { href: "/CustomerSupport" },
  });
  if (existing) return;

  await prisma.sidebarLink.create({
    data: {
      label: "Customer Support",
      href: "/CustomerSupport",
      icon: "MessageSquare",
      section: "pinned",
      order: 3,
    },
  });

  console.log("Seeded Customer Support sidebar link.");
}

async function seedQuickActions() {
  const count = await prisma.sidebarLink.count({
    where: { section: "quickActions" },
  });
  if (count > 0) return;

  await prisma.sidebarLink.createMany({
    data: [
      { label: "Reservations", href: "/Reservations", icon: "Plane", section: "quickActions", order: 0 },
      { label: "Airport Codes", href: "/airport-codes", icon: "Globe", section: "quickActions", order: 1 },
      { label: "Currency", href: "/currency-converter", icon: "DollarSign", section: "quickActions", order: 2 },
      { label: "Time", href: "/time-converter", icon: "Clock3", section: "quickActions", order: 3 },
      { label: "Weight", href: "/weight-converter", icon: "Scale", section: "quickActions", order: 4 },
      { label: "Duration", href: "/flight-duration", icon: "Timer", section: "quickActions", order: 5 },
    ],
  });

  console.log("Seeded default quick actions.");
}

async function seedDisruptions() {
  const count = await prisma.disruption.count();
  if (count > 0) return;

  await prisma.disruption.createMany({
    data: [
      { airportCode: "SHJ", message: "Runway maintenance between 22:00 - 04:00", level: "High" },
      { airportCode: "CAI", message: "Heavy traffic expected today", level: "Medium" },
      { airportCode: "DAC", message: "Check-in counters relocated", level: "Low" },
    ],
  });

  console.log("Seeded default flight disruption alerts.");
}

async function seedAirports() {
  const count = await prisma.airport.count();
  if (count > 0) return;

  await prisma.airport.createMany({
    data: [
      { code: "SHJ", city: "Sharjah", airport: "Sharjah International Airport", country: "United Arab Emirates", terminal: "Terminal 1" },
      { code: "DXB", city: "Dubai", airport: "Dubai International Airport", country: "United Arab Emirates", terminal: "Terminal 1, 2, 3" },
      { code: "AUH", city: "Abu Dhabi", airport: "Zayed International Airport", country: "United Arab Emirates", terminal: "Terminal A" },
      { code: "CAI", city: "Cairo", airport: "Cairo International Airport", country: "Egypt", terminal: "Terminal 1, 2, 3" },
      { code: "AMM", city: "Amman", airport: "Queen Alia International Airport", country: "Jordan", terminal: "Terminal 1" },
      { code: "DOH", city: "Doha", airport: "Hamad International Airport", country: "Qatar", terminal: "Terminal 1" },
      { code: "RUH", city: "Riyadh", airport: "King Khalid International Airport", country: "Saudi Arabia", terminal: "Terminal 1, 2" },
      { code: "JED", city: "Jeddah", airport: "King Abdulaziz International Airport", country: "Saudi Arabia", terminal: "Terminal 1" },
      { code: "MCT", city: "Muscat", airport: "Muscat International Airport", country: "Oman", terminal: "Terminal 1" },
      { code: "KWI", city: "Kuwait City", airport: "Kuwait International Airport", country: "Kuwait", terminal: "Terminal 4" },
    ],
  });

  console.log("Seeded default airport codes.");
}

async function seedDispositionCodes() {
  const count = await prisma.dispositionCode.count();
  if (count > 0) return;

  await prisma.dispositionCode.createMany({
    data: [
      { code: "RSLVD", label: "Resolved", description: "Issue fully resolved on the call." },
      { code: "CALLBACK", label: "Callback Required", description: "Agent must call the customer back." },
      { code: "ESC", label: "Escalated", description: "Sent to the next support tier." },
      { code: "NOANS", label: "No Answer", description: "Customer could not be reached." },
    ],
  });

  console.log("Seeded default disposition codes.");
}

async function seedEscalationContacts() {
  const count = await prisma.escalationContact.count();
  if (count > 0) return;

  await prisma.escalationContact.createMany({
    data: [
      { issueType: "Payments", escalateTo: "Tier 2 Finance", contactInfo: "ext. 4521" },
      { issueType: "Technical", escalateTo: "IT Support", contactInfo: "ext. 3010" },
      { issueType: "Reservations", escalateTo: "Tier 2 Reservations", contactInfo: "ext. 4110" },
    ],
  });

  console.log("Seeded default escalation contacts.");
}

async function seedNotifications() {
  const count = await prisma.notification.count();
  if (count > 0) return;

  await prisma.notification.createMany({
    data: [
      {
        title: "Refund Policy Updated",
        message: "The refund procedure has been updated. Review the Refunds knowledge base for details.",
        audience: "All Agents",
        status: "Sent",
        sent: true,
      },
      {
        title: "System Maintenance",
        message: "Scheduled maintenance window tonight between 22:00 - 04:00.",
        audience: "All Agents",
        status: "Sent",
        sent: true,
      },
    ],
  });

  console.log("Seeded default notifications.");
}

async function seedRolesAndAdmin() {
  const userCount = await prisma.user.count();
  if (userCount > 0) return;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn(
      "Skipping admin user seed: ADMIN_EMAIL/ADMIN_PASSWORD not set."
    );
    return;
  }

  const adminRole = await prisma.role.upsert({
    where: { name: "Administrator" },
    create: {
      name: "Administrator",
      color: "bg-red-100 text-red-700",
      permissions: PERMISSION_KEYS,
    },
    update: {},
  });

  await prisma.role.upsert({
    where: { name: "Supervisor" },
    create: {
      name: "Supervisor",
      color: "bg-blue-100 text-blue-700",
      permissions: ["manage_articles", "manage_categories", "manage_announcements", "view_analytics"],
    },
    update: {},
  });

  await prisma.role.upsert({
    where: { name: "Agent" },
    create: {
      name: "Agent",
      color: "bg-emerald-100 text-emerald-700",
      permissions: ["view_analytics"],
    },
    update: {},
  });

  await prisma.user.create({
    data: {
      name: "Administrator",
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      status: "Active",
      roleId: adminRole.id,
    },
  });

  console.log(`Seeded roles and initial admin user (${adminEmail}).`);
}

async function main() {
  await seedSidebarLinks();
  await seedReferenceToolLinks();
  await seedCustomerSupportLink();
  await seedQuickActions();
  await seedDisruptions();
  await seedNotifications();
  await seedAirports();
  await seedDispositionCodes();
  await seedEscalationContacts();
  await seedRolesAndAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
