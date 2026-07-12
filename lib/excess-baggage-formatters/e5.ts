import type { ExcessBaggageRow } from "@/lib/excess-baggage-service";
import {
  formatByRate,
  findRate,
  minMaxRange,
  simpleRate,
  formatNumber,
  currencyAr,
  updateArticleOverview,
  updateChatTemplateByTitle,
  updateEmailTemplateByTitle,
  updateDecisionTreeNode,
} from "./shared";

const ARTICLE_SLUG = "e5-excess-baggage-rates-e5";
const TREE_TITLE = "E5 Excess Baggage — From Egypt or To Egypt?";

function cite(rate: string): string {
  const parsed = simpleRate(rate);
  return parsed ? `${parsed.currency} ${formatNumber(parsed.value)}` : rate;
}

function citeAr(rate: string): string {
  const parsed = simpleRate(rate);
  return parsed ? `${formatNumber(parsed.value)} ${currencyAr(parsed.currency)}` : rate;
}

export async function regenerateE5(rows: ExcessBaggageRow[]) {
  const fromEgypt = rows.filter((r) => r.section === "From Egypt");
  const toEgypt = rows.filter((r) => r.section === "To Egypt");
  const noBagFrom = rows.filter((r) => r.section === "No baggage customers — From Egypt");
  const noBagTo = rows.filter((r) => r.section === "No baggage customers — To Egypt");
  const extraPiece = rows.filter((r) => r.section === "Extra piece");

  const extraPieceRate = findRate(extraPiece, { destination: "Extra piece" }) ?? "AED 50";

  const overview = [
    "From Egypt (excess rate per kg):",
    formatByRate(fromEgypt),
    "",
    "To Egypt (rate per kg):",
    formatByRate(toEgypt),
    "",
    "No-baggage-fare customers (first 20kg):",
    "From Egypt —",
    formatByRate(noBagFrom),
    "To Egypt —",
    formatByRate(noBagTo),
    "",
    `Extra piece: ${extraPieceRate}.`,
  ].join("\n");

  await updateArticleOverview(ARTICLE_SLUG, overview);

  // Scenario 1 — Sharjah from Egypt.
  const shjFrom = findRate(fromEgypt, { destination: "SHJ" });
  if (shjFrom) {
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "Excess baggage rate to Sharjah (English)",
      `From Egypt to Sharjah, the excess baggage rate is ${cite(shjFrom)} per kilo — that's actually the highest of our 'from Egypt' rates, so let me know if you'd like to pre-purchase weight to save.`
    );
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد إلى الشارقة (Arabic)",
      `من مصر إلى الشارقة، تبلغ رسوم الوزن الزائد ${citeAr(shjFrom)} لكل كيلوغرام - وهي أعلى رسوم ضمن مسارات 'من مصر'، فأخبروني إذا رغبتم بشراء وزن مسبق للتوفير.`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "Excess baggage rate to Sharjah (English)",
      `Dear [Customer Name],\n\nThank you for asking about the excess baggage rate from Cairo to Sharjah.\n\nFrom Egypt to Sharjah, the rate is ${cite(shjFrom)} per kg — the highest of our 'from Egypt' rates. Pre-purchasing extra weight in advance is often more economical; let us know if you'd like to add it now.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد إلى الشارقة (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن رسوم الوزن الزائد من القاهرة إلى الشارقة.\n\nمن مصر إلى الشارقة، تبلغ الرسوم ${citeAr(shjFrom)} لكل كيلوغرام - وهي الأعلى ضمن مسارات 'من مصر'. غالبًا ما يكون شراء الوزن الإضافي مسبقًا أكثر اقتصادًا؛ يرجى إخبارنا إذا رغبتم بإضافته الآن.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );
  }

  // Scenario 2 — Kuwait/all-other-destinations first-20kg to Egypt.
  const allOtherRate = findRate(noBagTo, { destination: "1st 20Kg to all other destination" });
  if (allOtherRate) {
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "First-20kg rate from Kuwait to Cairo (English)",
      `Kuwait isn't listed separately for 'to Egypt' no-baggage pricing, so we'd use the 'all other destinations' rate of ${cite(allOtherRate)} for your first 20kg.`
    );
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم أول 20 كجم من الكويت إلى القاهرة (Arabic)",
      `الكويت غير مدرجة بشكل منفصل ضمن تسعير 'إلى مصر' بدون باقة أمتعة، لذا سنستخدم رسوم 'باقي الوجهات' البالغة ${citeAr(allOtherRate)} لأول 20 كجم.`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "First-20kg rate from Kuwait to Cairo (English)",
      `Dear [Customer Name],\n\nThank you for asking about the first-20kg rate for your no-baggage-fare flight into Cairo from Kuwait.\n\nKuwait isn't listed separately for 'to Egypt' no-baggage pricing, so the 'all other destinations' rate of ${cite(allOtherRate)} applies for your first 20kg.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم أول 20 كجم من الكويت إلى القاهرة (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن رسوم أول 20 كجم لرحلتكم بدون باقة أمتعة إلى القاهرة من الكويت.\n\nالكويت غير مدرجة بشكل منفصل ضمن تسعير 'إلى مصر' بدون باقة أمتعة، لذا تُطبَّق رسوم 'باقي الوجهات' البالغة ${citeAr(allOtherRate)} لأول 20 كجم.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );
  }

  // Scenario 3 — Amman to Egypt.
  const ammToEgypt = findRate(toEgypt, { destination: "AMM" });
  if (ammToEgypt) {
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "Excess baggage rate from Amman (English)",
      `From Amman to Cairo, the excess baggage rate is ${cite(ammToEgypt)} per kilo — happy to add the extra weight to your booking now if that's helpful.`
    );
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد من عمّان (Arabic)",
      `من عمّان إلى القاهرة، تبلغ رسوم الوزن الزائد ${citeAr(ammToEgypt)} لكل كيلوغرام - يسعدني إضافة الوزن الزائد إلى حجزكم الآن إذا كان ذلك مفيدًا لكم.`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "Excess baggage rate from Amman (English)",
      `Dear [Customer Name],\n\nThank you for asking about the excess baggage rate from Amman to Cairo.\n\nThe 'to Egypt' rate from Amman is ${cite(ammToEgypt)} per kg. Let us know if you'd like this added to your booking in advance.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد من عمّان (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن رسوم الوزن الزائد من عمّان إلى القاهرة.\n\nتبلغ رسوم 'إلى مصر' من عمّان ${citeAr(ammToEgypt)} لكل كيلوغرام. يرجى إخبارنا إذا رغبتم بإضافة ذلك إلى حجزكم مسبقًا.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );
  }

  // Decision tree outcome nodes.
  const fromRange = minMaxRange(fromEgypt);
  const noBagFromRange = minMaxRange(noBagFrom);
  if (fromRange && shjFrom && noBagFromRange) {
    await updateDecisionTreeNode(
      TREE_TITLE,
      2,
      `${fromRange.currency} ${fromRange.min}–${fromRange.max}/kg depending on destination (e.g. SHJ is ${cite(shjFrom)}, the highest). No-baggage-fare first 20kg: ${noBagFromRange.currency} ${noBagFromRange.min}–${noBagFromRange.max}.`
    );
  }

  const ksaExceptDmm = findRate(toEgypt, { destination: "KSA (Except DMM)" }) ?? findRate(toEgypt, { destination: "KSA ( Except DMM )" });
  const ksaDmm = findRate(toEgypt, { destination: "KSA (DMM)" }) ?? findRate(toEgypt, { destination: "KSA ( DMM )" });
  if (ammToEgypt && shjFrom) {
    const ksaRange = minMaxRange([
      ...(ksaExceptDmm ? [{ rate: ksaExceptDmm }] : []),
      ...(ksaDmm ? [{ rate: ksaDmm }] : []),
    ]);
    const shjToEgypt = findRate(toEgypt, { destination: "SHJ" }) ?? shjFrom;

    await updateDecisionTreeNode(
      TREE_TITLE,
      3,
      `Rate depends on origin — e.g. ${cite(ammToEgypt)}/kg from Amman, ${cite(shjToEgypt)}/kg from Sharjah${
        ksaRange ? `, ${ksaRange.currency} ${ksaRange.min}–${ksaRange.max}/kg from KSA` : ""
      }.`
    );
  }
}
