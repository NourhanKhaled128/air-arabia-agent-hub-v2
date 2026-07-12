import type { ExcessBaggageRow } from "@/lib/excess-baggage-service";
import {
  formatByRate,
  findRate,
  simpleRate,
  formatNumber,
  currencyAr,
  updateArticleOverview,
  updateChatTemplateByTitle,
  updateEmailTemplateByTitle,
  updateDecisionTreeNode,
} from "./shared";

const ARTICLE_SLUG = "3o-excess-baggage-rates-3o";
const TREE_TITLE = "3O Excess Baggage — From Morocco or To Morocco?";

function cite(rate: string): string {
  const parsed = simpleRate(rate);
  return parsed ? `${parsed.currency} ${formatNumber(parsed.value)}` : rate;
}

function citeAr(rate: string): string {
  const parsed = simpleRate(rate);
  return parsed ? `${formatNumber(parsed.value)} ${currencyAr(parsed.currency)}` : rate;
}

export async function regenerate3O(rows: ExcessBaggageRow[]) {
  const fromMorocco = rows.filter((r) => r.section === "From Morocco");
  const toMorocco = rows.filter((r) => r.section === "To Morocco");
  const noBagFrom = rows.filter((r) => r.section === "No baggage customers — From Morocco");
  const noBagTo = rows.filter((r) => r.section === "No baggage customers — To Morocco");

  const overview = [
    "From Morocco (rate per kg):",
    formatByRate(fromMorocco),
    "",
    "To Morocco (rate per kg):",
    formatByRate(toMorocco),
    "",
    "No-baggage-fare customers (first 20kg):",
    "From Morocco —",
    formatByRate(noBagFrom),
    "To Morocco —",
    formatByRate(noBagTo),
    "",
    "No restriction on number of pieces.",
  ].join("\n");

  await updateArticleOverview(ARTICLE_SLUG, overview);

  // Scenario 1 — no-baggage-fare rate to Turkey.
  const turkeyRate = findRate(noBagFrom, { destination: "Turkey" });
  if (turkeyRate) {
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "No-baggage-fare excess rate to Turkey (English)",
      `For a no-baggage-fare booking from Casablanca to Turkey, the first 20kg would be ${cite(turkeyRate)} — and there's no restriction on the number of pieces within that weight.`
    );
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد لحجز بدون باقة أمتعة إلى تركيا (Arabic)",
      `بالنسبة لحجز بدون باقة أمتعة من الدار البيضاء إلى تركيا، ستكون رسوم أول 20 كجم ${citeAr(turkeyRate)} - ولا يوجد قيد على عدد القطع ضمن هذا الوزن.`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "No-baggage-fare excess rate to Turkey (English)",
      `Dear [Customer Name],\n\nThank you for asking about the first-20kg rate for your no-baggage-fare booking from Casablanca to Turkey.\n\nFor a no-baggage-fare customer travelling from Morocco to Turkey, the first 20kg is priced at ${cite(turkeyRate)}, with no restriction on the number of pieces within that weight.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد لحجز بدون باقة أمتعة إلى تركيا (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن رسوم أول 20 كجم لحجزكم بدون باقة أمتعة من الدار البيضاء إلى تركيا.\n\nبالنسبة للعميل بدون باقة أمتعة المسافر من المغرب إلى تركيا، تبلغ رسوم أول 20 كجم ${citeAr(turkeyRate)}، دون قيد على عدد القطع ضمن هذا الوزن.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );
  }

  // Scenario 2 — From Morocco to UAE.
  const uaeRate = findRate(fromMorocco, { destination: "UAE" });
  if (uaeRate) {
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "Excess baggage rate to the UAE (English)",
      `From Morocco to the UAE, the excess baggage rate is ${cite(uaeRate)} per kg — that's the highest of our 'from Morocco' rates, so let me know if you'd like to pre-purchase weight to save.`
    );
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد إلى الإمارات (Arabic)",
      `من المغرب إلى الإمارات، تبلغ رسوم الوزن الزائد ${citeAr(uaeRate)} لكل كيلوغرام - وهي أعلى رسوم ضمن مسارات 'من المغرب'، فأخبروني إذا رغبتم بشراء وزن مسبق للتوفير.`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "Excess baggage rate to the UAE (English)",
      `Dear [Customer Name],\n\nThank you for asking about the excess baggage rate from Casablanca to the UAE.\n\nFrom Morocco to the UAE, the excess baggage rate is ${cite(uaeRate)} per kg — the highest of our 'from Morocco' rates. Pre-purchasing extra weight in advance is often more economical; let us know if you'd like to add it now.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد إلى الإمارات (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن رسوم الوزن الزائد من الدار البيضاء إلى الإمارات.\n\nمن المغرب إلى الإمارات، تبلغ الرسوم ${citeAr(uaeRate)} لكل كيلوغرام - وهي الأعلى ضمن مسارات 'من المغرب'. غالبًا ما يكون شراء الوزن الإضافي مسبقًا أكثر اقتصادًا؛ يرجى إخبارنا إذا رغبتم بإضافته الآن.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );

    await updateDecisionTreeNode(
      TREE_TITLE,
      2,
      `${cite(findRate(fromMorocco, { destination: "Spain" }) ?? "MAD 120")}/kg to most of Europe & Turkey, ${cite(uaeRate)}/kg to UAE. No-baggage-fare first 20kg: ${cite(findRate(noBagFrom, { destination: "Europe" }) ?? "MAD 750")}–${cite(findRate(noBagFrom, { destination: "UAE" }) ?? "MAD 1,200")} depending on destination.`
    );
  }

  // Scenario 3 — domestic.
  const domesticFrom = findRate(fromMorocco, { destination: "Domestic" });
  const domesticNoBag = findRate(noBagFrom, { destination: "Domestic" });
  if (domesticFrom && domesticNoBag) {
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "Domestic excess baggage rates (English)",
      `For domestic travel within Morocco, excess baggage is ${cite(domesticFrom)} per kg, and if you're on a no-baggage fare, the first 20kg domestic is a flat ${cite(domesticNoBag)} in either direction.`
    );
    await updateChatTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد على الرحلات الداخلية (Arabic)",
      `بالنسبة للسفر الداخلي ضمن المغرب، تبلغ رسوم الوزن الزائد ${citeAr(domesticFrom)} لكل كيلوغرام، وإذا كان حجزكم بدون باقة أمتعة، فإن رسوم أول 20 كجم داخليًا ثابتة عند ${citeAr(domesticNoBag)} في كلا الاتجاهين.`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "Domestic excess baggage rates (English)",
      `Dear [Customer Name],\n\nThank you for asking about excess baggage on your domestic Morocco flight.\n\nDomestic excess baggage is ${cite(domesticFrom)} per kg. For a no-baggage-fare customer, the first 20kg domestic is a flat ${cite(domesticNoBag)} in either direction.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support`
    );
    await updateEmailTemplateByTitle(
      ARTICLE_SLUG,
      "رسوم الوزن الزائد على الرحلات الداخلية (Arabic)",
      `عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن الوزن الزائد على رحلتكم الداخلية ضمن المغرب.\n\nرسوم الوزن الزائد الداخلي هي ${citeAr(domesticFrom)} لكل كيلوغرام. بالنسبة للعميل بدون باقة أمتعة، تبلغ رسوم أول 20 كجم داخليًا ${citeAr(domesticNoBag)} ثابتة في كلا الاتجاهين.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`
    );

    await updateDecisionTreeNode(
      TREE_TITLE,
      4,
      `${cite(domesticFrom)}/kg. No-baggage-fare first 20kg: ${cite(domesticNoBag)} in either direction.`
    );
  }
}
