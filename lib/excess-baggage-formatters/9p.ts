import type { ExcessBaggageRow } from "@/lib/excess-baggage-service";
import {
  findRate,
  updateArticleOverview,
  updateChatTemplateByTitle,
  updateEmailTemplateByTitle,
  updateDecisionTreeNode,
} from "./shared";

const ARTICLE_SLUG = "9p-excess-baggage-rates-9p";
const TREE_TITLE = "9P Excess Baggage — Which Sector?";

const DOMESTIC = "Domestic Sectors";
const DEPARTING = "International Sectors Departing from Pakistan";
const ARRIVING = "International Sectors Coming to Pakistan";

function block(rows: ExcessBaggageRow[], section: string) {
  const get = (destination: string) => findRate(rows, { section, destination }) ?? "N/A";
  return {
    oversize: get("Oversize Baggage (Max 305cm)"),
    cartonBox: get("Carton Box"),
    tvUnit: get("TV Unit"),
    firstPiece: get("1ST PIECE (23 KG)"),
    excessRate: get("Excess Baggage Rate"),
    excessRateDirect: get("Excess Baggage Rate Direct Flight"),
    excessRateConnection: get("Excess Baggage Rate Connection Flight"),
    additionalPiece: get("Additional Piece"),
  };
}

export async function regenerate9P(rows: ExcessBaggageRow[]) {
  const domestic = block(rows, DOMESTIC);
  const departing = block(rows, DEPARTING);
  const arriving = block(rows, ARRIVING);

  const overview = [
    "International Sectors Coming to Pakistan",
    `- Oversize Baggage (Max 305cm) — ${arriving.oversize}`,
    `- Carton Box — ${arriving.cartonBox}`,
    `- TV Unit — ${arriving.tvUnit}`,
    `- 1st Piece (23kg) — ${arriving.firstPiece}`,
    `- Excess Baggage Rate, Direct Flight — ${arriving.excessRateDirect}`,
    `- Excess Baggage Rate, Connection Flight — ${arriving.excessRateConnection}`,
    `- Additional Piece — ${arriving.additionalPiece}`,
    "",
    "Domestic Sectors",
    `- Oversize Baggage (Max 305cm) — ${domestic.oversize}`,
    `- Carton Box — ${domestic.cartonBox}`,
    `- TV Unit — ${domestic.tvUnit}`,
    `- 1st Piece (23kg) — ${domestic.firstPiece}`,
    `- Excess Baggage Rate — ${domestic.excessRate}`,
    `- Additional Piece — ${domestic.additionalPiece}`,
    "",
    "International Sectors Departing from Pakistan",
    `- Oversize Baggage (Max 305cm) — ${departing.oversize}`,
    `- Carton Box — ${departing.cartonBox}`,
    `- TV Unit — ${departing.tvUnit}`,
    `- 1st Piece (23kg) — ${departing.firstPiece}`,
    `- Excess Baggage Rate — ${departing.excessRate}`,
    `- Additional Piece — ${departing.additionalPiece}`,
  ].join("\n");

  await updateArticleOverview(ARTICLE_SLUG, overview);

  // Scenario 1 — oversize item (domestic), email only (chat doesn't cite the number).
  await updateEmailTemplateByTitle(
    ARTICLE_SLUG,
    "Oversized item exceeds our limit (English)",
    `Dear [Customer Name],\n\nThank you for checking in about your 320cm oversized item on your domestic 9P flight.\n\nOur oversize baggage rate of ${domestic.oversize} applies up to 305cm; your item at 320cm exceeds this maximum. We're escalating this to confirm whether it can be accepted before quoting a rate.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
  );
  await updateEmailTemplateByTitle(
    ARTICLE_SLUG,
    "الغرض يتجاوز الحد المسموح للحجم (Arabic)",
    `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لتواصلكم بخصوص غرضكم كبير الحجم 320 سم على رحلتكم الداخلية على 9P.\n\nتنطبق رسوم الأحجام الكبيرة البالغة ${domestic.oversize} حتى 305 سم؛ وغرضكم بحجم 320 سم يتجاوز هذا الحد. نقوم بتصعيد الطلب للتحقق من إمكانية قبوله قبل تحديد أي رسوم.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
  );

  // Scenario 2 — arrival into Pakistan, direct vs connecting.
  await updateChatTemplateByTitle(
    ARTICLE_SLUG,
    "Excess baggage rate for your arrival to Pakistan (English)",
    `For a direct international flight into Pakistan, the excess baggage rate is ${arriving.excessRateDirect} per kg — it would be ${arriving.excessRateConnection} per kg if it were a connecting flight instead.`
  );
  await updateChatTemplateByTitle(
    ARTICLE_SLUG,
    "رسوم الوزن الزائد لرحلتكم إلى باكستان (Arabic)",
    `بالنسبة لرحلة دولية مباشرة إلى باكستان، تبلغ رسوم الوزن الزائد ${arriving.excessRateDirect} لكل كيلوغرام - وتصبح ${arriving.excessRateConnection} لكل كيلوغرام في حال كانت الرحلة عبر محطة وصل.`
  );
  await updateEmailTemplateByTitle(
    ARTICLE_SLUG,
    "Excess baggage rate for your arrival to Pakistan (English)",
    `Dear [Customer Name],\n\nThank you for asking about the excess baggage rate for your direct international flight into Pakistan.\n\nFor international sectors arriving in Pakistan on a direct flight, the excess baggage rate is ${arriving.excessRateDirect} per kg (${arriving.excessRateConnection} per kg for a connecting flight).\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
  );
  await updateEmailTemplateByTitle(
    ARTICLE_SLUG,
    "رسوم الوزن الزائد لرحلتكم إلى باكستان (Arabic)",
    `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن رسوم الوزن الزائد لرحلتكم الدولية المباشرة إلى باكستان.\n\nبالنسبة للقطاعات الدولية الواصلة إلى باكستان في رحلة مباشرة، تبلغ رسوم الوزن الزائد ${arriving.excessRateDirect} لكل كيلوغرام (${arriving.excessRateConnection} لكل كيلوغرام للرحلات عبر محطة وصل).\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
  );

  // Scenario 3 — carton box departing Pakistan.
  await updateChatTemplateByTitle(
    ARTICLE_SLUG,
    "Carton box accepted on this route (English)",
    `Good news — a carton box is accepted on this route at ${departing.cartonBox}, unlike flights arriving into Pakistan where carton boxes aren't accepted at all.`
  );
  await updateChatTemplateByTitle(
    ARTICLE_SLUG,
    "قبول صندوق الكرتون على هذا المسار (Arabic)",
    `خبر سار - يُقبل صندوق الكرتون على هذا المسار مقابل ${departing.cartonBox}، على عكس الرحلات الواصلة إلى باكستان حيث لا تُقبل صناديق الكرتون إطلاقًا.`
  );
  await updateEmailTemplateByTitle(
    ARTICLE_SLUG,
    "Carton box accepted on this route (English)",
    `Dear [Customer Name],\n\nThank you for checking whether a carton box can be checked in on your international departure from Pakistan.\n\nA carton box is accepted on this route at ${departing.cartonBox} — this differs from sectors arriving into Pakistan, where carton boxes are not accepted at all (N/A).\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
  );
  await updateEmailTemplateByTitle(
    ARTICLE_SLUG,
    "قبول صندوق الكرتون على هذا المسار (Arabic)",
    `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن إمكانية تسجيل صندوق كرتون على رحلتكم الدولية المغادرة من باكستان.\n\nيُقبل صندوق الكرتون على هذا المسار مقابل ${departing.cartonBox} - ويختلف ذلك عن القطاعات الواصلة إلى باكستان حيث لا تُقبل صناديق الكرتون إطلاقًا (غير متاح).\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
  );

  // Decision tree outcome nodes.
  await updateDecisionTreeNode(
    TREE_TITLE,
    2,
    `${domestic.excessRate}/kg excess, ${domestic.firstPiece} first piece (23kg), oversize (max 305cm) ${domestic.oversize}, carton box ${domestic.cartonBox}.`
  );
  await updateDecisionTreeNode(
    TREE_TITLE,
    3,
    `${departing.excessRate}/kg excess, ${departing.firstPiece} first piece, oversize ${departing.oversize}, carton box ${departing.cartonBox}.`
  );
  await updateDecisionTreeNode(
    TREE_TITLE,
    5,
    `${arriving.excessRateDirect}/kg excess, ${arriving.firstPiece} first piece (23kg), oversize ${arriving.oversize}, carton box not accepted (${arriving.cartonBox}).`
  );
  await updateDecisionTreeNode(
    TREE_TITLE,
    6,
    `${arriving.excessRateConnection}/kg excess, ${arriving.firstPiece} first piece, oversize ${arriving.oversize}, carton box not accepted (${arriving.cartonBox}).`
  );
}
