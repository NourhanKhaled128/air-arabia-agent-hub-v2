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

async function seedNotifications() {
  const count = await prisma.notification.count();
  if (count > 0) return;

  await prisma.notification.createMany({
    data: [
      {
        title: "Refund Policy Updated",
        message: "The refund procedure has been updated. Review the Refunds knowledge base for details.",
        audience: "All Agents",
        sent: true,
      },
      {
        title: "System Maintenance",
        message: "Scheduled maintenance window tonight between 22:00 - 04:00.",
        audience: "All Agents",
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
  await seedQuickActions();
  await seedDisruptions();
  await seedNotifications();
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
