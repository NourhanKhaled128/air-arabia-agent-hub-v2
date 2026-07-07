import { prisma } from "@/lib/prisma";

export async function getEscalationContacts() {
  return prisma.escalationContact.findMany({
    orderBy: { issueType: "asc" },
  });
}

export async function getActiveEscalationContacts() {
  return prisma.escalationContact.findMany({
    where: { active: true },
    orderBy: { issueType: "asc" },
  });
}

export async function getEscalationContactById(id: number) {
  return prisma.escalationContact.findUnique({
    where: { id },
  });
}

export async function createEscalationContact(data: {
  issueType: string;
  escalateTo: string;
  contactInfo: string;
  notes?: string;
  active: boolean;
}) {
  return prisma.escalationContact.create({ data });
}

export async function updateEscalationContact(
  id: number,
  data: Partial<{
    issueType: string;
    escalateTo: string;
    contactInfo: string;
    notes: string;
    active: boolean;
  }>
) {
  return prisma.escalationContact.update({
    where: { id },
    data,
  });
}

export async function deleteEscalationContact(id: number) {
  return prisma.escalationContact.delete({
    where: { id },
  });
}
