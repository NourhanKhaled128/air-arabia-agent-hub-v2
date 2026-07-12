import type { ExcessBaggageRow } from "@/lib/excess-baggage-service";
import {
  formatRegionRateList,
  minMaxRange,
  findRate,
  currencyAr,
  updateArticleOverview,
  updateChatTemplateByTitle,
  updateEmailTemplateByTitle,
  updateDecisionTreeNode,
} from "./shared";

const ARTICLE_SLUG = "g9-excess-baggage-rates-g9";
const TREE_TITLE = "G9 Excess Baggage — Point-to-Point or Connecting?";

export async function regenerateG9(rows: ExcessBaggageRow[]) {
  const p2p = rows.filter((r) => r.section === "Point to Point");
  const gcc = rows.filter((r) => r.section === "Connecting to GCC");
  const others = rows.filter((r) => r.section === "Connecting to Others");
  const noBaggage = rows.filter((r) => r.section === "No baggage customers");
  const extraPiece = rows.filter((r) => r.section === "Extra piece");

  const first20kg = findRate(noBaggage, { destination: "First 20kg" }) ?? "AED 100";
  const extraPieceRate =
    findRate(extraPiece, { destination: "Extra piece" }) ??
    findRate(noBaggage, { destination: "Extra piece" }) ??
    "AED 50";

  const overview = [
    "Point-to-point rate applies to/from UAE; connection rates apply when connecting via UAE to GCC or other regions. All rates are excess-weight-per-kg charges; airport handling fees apply in addition.",
    "",
    "Point to Point (To / From UAE) — rate per kg",
    formatRegionRateList(p2p),
    "",
    "Connecting to GCC — rate per kg",
    formatRegionRateList(gcc),
    "",
    "Connecting to Others — rate per kg",
    formatRegionRateList(others),
    "",
    "No-baggage customers",
    `- First 20 kg baggage allowance: ${first20kg}.`,
    "- Excess weight above 20 kg, or above the pre-booked baggage allowance, follows the point-to-point/connection rate table above.",
    `- Extra piece: ${extraPieceRate}.`,
  ].join("\n");

  await updateArticleOverview(ARTICLE_SLUG, overview);

  // Scenario 1 — point-to-point range (email only; the chat variant doesn't cite a number).
  const p2pRange = minMaxRange(p2p);
  if (p2pRange) {
    const { min, max, currency } = p2pRange;

    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "Your Air Arabia excess baggage query (English)",
      `Dear [Customer Name],\n\nThank you for reaching out about the excess baggage rate for your G9 flight.\n\nExcess baggage on G9 is charged per kilogram based on your destination and whether you're travelling point-to-point or connecting (rates range roughly from ${currency} ${min} to ${currency} ${max}+ per kg depending on region), with airport handling fees applying on top. You're welcome to add the extra weight to your booking in advance or pay the excess at the airport.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );

    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "استفساركم بخصوص الوزن الزائد (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لتواصلكم بخصوص رسوم الوزن الزائد لرحلتكم على G9.\n\nتُحتسب رسوم الوزن الزائد على رحلات G9 لكل كيلوغرام حسب الوجهة وما إذا كانت الرحلة مباشرة أو عبر محطة وصل (تتراوح الرسوم تقريبًا بين ${min} و${max}+ ${currencyAr(currency)} لكل كيلوغرام حسب المنطقة)، مع تطبيق رسوم مناولة المطار إضافةً لذلك. يمكنكم إضافة الوزن الإضافي مسبقًا أو دفع الوزن الزائد في المطار.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );

    await updateDecisionTreeNode(
      TREE_TITLE,
      2,
      `Rate depends on destination region (roughly ${currency} ${min}–${max}/kg) — check the point-to-point table in Excess Baggage Rates – G9 for the exact figure.`
    );
  }

  // Scenario 2 — GCC/KSA connecting-to-others rate.
  const gccOthersRate = findRate(others, { region: "GCC/KSA" });
  if (gccOthersRate) {
    const parsedOthers = minMaxRange(gcc.concat(others));

    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "Connecting flight excess baggage rate (English)",
      `For a connection through Sharjah onward to a GCC country, that specific combination is marked N/A — but the connecting-to-others rate of ${gccOthersRate}/kg would apply. Could you confirm your exact routing so I quote the right one?`
    );
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد للرحلة عبر محطة وصل (Arabic)",
      `بالنسبة لرحلة عبر الشارقة إلى إحدى دول الخليج، هذا المسار تحديدًا غير متاح (N/A) - لكن ستُطبَّق رسوم الاتصال بوجهات أخرى البالغة ${gccOthersRate.replace(/[A-Za-z]+/, "").trim()} ${currencyAr(gccOthersRate.match(/[A-Za-z]+/)?.[0] ?? "AED")} لكل كيلوغرام. هل يمكنكم تأكيد مسار رحلتكم بالتحديد حتى أزودكم بالرسوم الصحيحة؟`
    );

    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "Connecting flight excess baggage rate (English)",
      `Dear [Customer Name],\n\nThank you for asking about the excess baggage rate for your connecting flight through Sharjah.\n\nGCC-to-GCC connections are marked N/A in our table; the connecting-to-others rate of ${gccOthersRate} per kg would apply instead. Please confirm your exact routing so we can quote the precise rate.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد للرحلة عبر محطة وصل (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن رسوم الوزن الزائد لرحلتكم عبر محطة وصل في الشارقة.\n\nالرحلات المتصلة بين دول الخليج غير متاحة (N/A) في جدولنا؛ وستُطبَّق بدلاً من ذلك رسوم الاتصال بوجهات أخرى البالغة ${gccOthersRate} لكل كيلوغرام. يرجى تأكيد مسار رحلتكم بالتحديد حتى نزودكم بالرسوم الدقيقة.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );

    if (parsedOthers) {
      await updateDecisionTreeNode(
        TREE_TITLE,
        4,
        `Rate depends on region — check the connecting-to-GCC / connecting-to-others columns in Excess Baggage Rates – G9 (roughly ${parsedOthers.currency} ${parsedOthers.min}–${parsedOthers.max}/kg).`
      );
    }
  }
}
