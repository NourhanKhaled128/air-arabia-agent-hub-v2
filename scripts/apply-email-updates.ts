import { prisma } from "../lib/prisma";
import { buildArticleSectionsCreateData } from "../lib/article-service";

const AUTHOR = "Nourhan Khaled";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function updateHandlingComplaints() {
  const article = await prisma.article.findFirst({ where: { title: "Handling Complaints – All Hubs" } });
  if (!article) {
    console.warn("Handling Complaints article not found — skipping update.");
    return;
  }

  await prisma.article.update({
    where: { id: article.id },
    data: {
      procedures: {
        create: [
          {
            stepNo: 3,
            title: "contactus@ email inquiries",
            content:
              'contactus@airarabia.com and contactus@flyjinnah.com no longer accept new customer emails. New messages to these addresses receive an automated reply directing the customer to the Feedback/Complaint form on the website or app. Always create a Sprinklr case where applicable. Customers already in an ongoing email thread may continue that conversation as normal.',
          },
        ],
      },
      scenarios: {
        create: [
          {
            situation: "A customer says they emailed contactus@airarabia.com and got no reply.",
            response:
              "That inbox no longer accepts new emails — it now auto-replies directing them to the Feedback/Complaint form on our website or app. If it's a genuine new complaint, raise a Sprinklr case for them now.",
          },
        ],
      },
      keywords: { create: [{ value: "contactus email" }] },
      chatTemplates: {
        create: [
          {
            title: "Contactus email no longer monitored (English)",
            content:
              "I'm sorry for the trouble — that inbox no longer accepts new emails, so it wouldn't have reached anyone. Let me raise this as a proper case for you right now instead.",
          },
          {
            title: "البريد الإلكتروني للتواصل لم يعد نشطًا (Arabic)",
            content:
              "أعتذر عن هذا الإزعاج - هذا البريد الإلكتروني لم يعد يستقبل رسائل جديدة، لذا لم تصل رسالتكم لأحد. دعوني أفتح لكم حالة رسمية الآن بدلاً من ذلك.",
          },
        ],
      },
      emailTemplates: {
        create: [
          {
            title: "Contactus email no longer monitored (English)",
            subject: "Contactus email no longer monitored",
            body: "Dear [Customer Name],\n\nThank you for reaching out, and we're sorry your email to contactus@airarabia.com didn't receive a reply — that inbox no longer accepts new customer emails and now sends an automated response directing you to our Feedback/Complaint form.\n\nWe've logged your concern as a case with our team directly, so no further action is needed on your end for this.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
          },
          {
            title: "البريد الإلكتروني للتواصل لم يعد نشطًا (Arabic)",
            subject: "البريد الإلكتروني للتواصل لم يعد نشطًا",
            body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لتواصلكم، ونعتذر عن عدم استلام رد على رسالتكم إلى contactus@airarabia.com - هذا البريد الإلكتروني لم يعد يستقبل رسائل جديدة من العملاء ويقوم الآن بإرسال رد تلقائي يوجهكم إلى نموذج الملاحظات/الشكاوى لدينا.\n\nلقد قمنا بتسجيل استفساركم كحالة مباشرة مع فريقنا، لذا لا حاجة لأي إجراء إضافي من جانبكم بخصوص هذا الأمر.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
          },
        ],
      },
    },
  });

  console.log(`Updated: ${article.title}`);
}

async function updateKwiTerminal() {
  const result = await prisma.airport.updateMany({
    where: { code: "KWI" },
    data: { terminal: "Terminal 4" },
  });
  console.log(`Updated KWI airport terminal (${result.count} row(s) -> Terminal 4).`);
}

interface NewArticleSpec {
  title: string;
  categoryId: number;
  folderId?: number;
  description: string;
  overview: string;
  procedures?: { title?: string; content: string }[];
  scenarios?: { situation: string; response: string }[];
  notes?: { type?: string; content: string }[];
  keywords?: string[];
  chatTemplates: { title: string; content: string }[];
  emailTemplates: { title: string; subject: string; body: string }[];
}

async function ensurePromotionsFolder(generalInfoCategoryId: number) {
  const existing = await prisma.categoryFolder.findFirst({
    where: { categoryId: generalInfoCategoryId, name: "Promotions" },
  });
  if (existing) return existing.id;

  const maxOrder = await prisma.categoryFolder.aggregate({
    where: { categoryId: generalInfoCategoryId },
    _max: { order: true },
  });

  const created = await prisma.categoryFolder.create({
    data: {
      categoryId: generalInfoCategoryId,
      name: "Promotions",
      order: (maxOrder._max.order ?? -1) + 1,
      visible: true,
    },
  });
  console.log(`Created folder "Promotions" (#${created.id}) under General Information`);
  return created.id;
}

async function main() {
  await updateHandlingComplaints();
  await updateKwiTerminal();

  const GENERAL_INFO_ID = 11;
  const PAYMENTS_FOLDER_ID = 41;
  const RESERVATIONS_FOLDER_ID = 42;
  const NINE_P_CATEGORY_ID = 16;
  const NINE_P_OTHER_FOLDER_ID = 30;

  const promotionsFolderId = await ensurePromotionsFolder(GENERAL_INFO_ID);

  const NEW_ARTICLES: NewArticleSpec[] = [
    {
      title: "RAK Bank Tickets — No Modification or Cancellation – All Hubs",
      categoryId: GENERAL_INFO_ID,
      folderId: PAYMENTS_FOLDER_ID,
      description:
        "RAK Bank-issued tickets cannot be modified or cancelled once issued, under any circumstances — including in person at an office.",
      overview:
        "Tickets issued under the RAK Bank arrangement cannot be modified or cancelled once issued — this applies across every channel, including visiting an Air Arabia office in person. If a passenger requests a modification or cancellation on a RAK Bank ticket, apologize and inform them the ticket cannot be changed.",
      procedures: [
        {
          title: "Confirm the ticket type",
          content:
            "Confirm the booking is a RAK Bank ticket before quoting any modification/cancellation policy — if so, no change is possible through any channel.",
        },
      ],
      scenarios: [
        {
          situation: "A passenger with a RAK Bank ticket calls asking to change their travel date.",
          response:
            "Apologize and explain that RAK Bank tickets cannot be modified once issued, through any channel including in person at an office.",
        },
        {
          situation: "A passenger insists on visiting an Air Arabia office to cancel their RAK Bank ticket in person.",
          response:
            "Even an in-person office visit cannot process a modification or cancellation on a RAK Bank ticket — this restriction applies across every channel.",
        },
      ],
      notes: [
        { type: "Warning", content: "This is a strict restriction with no exceptions — do not offer alternative workarounds." },
      ],
      keywords: ["RAK Bank", "no modification", "no cancellation"],
      chatTemplates: [
        {
          title: "RAK Bank ticket — no changes possible (English)",
          content:
            "I'm sorry, but tickets issued under the RAK Bank arrangement can't be modified or cancelled once issued — this applies across every channel, including in person at an office.",
        },
        {
          title: "تذكرة راك بنك - لا يمكن إجراء تعديلات (Arabic)",
          content:
            "نأسف، لا يمكن تعديل أو إلغاء التذاكر الصادرة ضمن ترتيب راك بنك بعد إصدارها - وينطبق ذلك على جميع القنوات، بما في ذلك الزيارة الشخصية لأحد المكاتب.",
        },
      ],
      emailTemplates: [
        {
          title: "RAK Bank ticket — no changes possible (English)",
          subject: "RAK Bank ticket — modification/cancellation not available",
          body: "Dear [Customer Name],\n\nThank you for reaching out regarding your RAK Bank ticket.\n\nTickets issued under the RAK Bank arrangement cannot be modified or cancelled once issued, through any channel — including visiting an Air Arabia office in person. We're sorry for any inconvenience this causes.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "تذكرة راك بنك - لا يمكن إجراء تعديلات (Arabic)",
          subject: "تذكرة راك بنك - التعديل أو الإلغاء غير متاح",
          body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لتواصلكم بخصوص تذكرة راك بنك الخاصة بكم.\n\nلا يمكن تعديل أو إلغاء التذاكر الصادرة ضمن ترتيب راك بنك بعد إصدارها، عبر أي قناة - بما في ذلك زيارة أحد مكاتب العربية للطيران شخصياً. نعتذر عن أي إزعاج قد يسببه ذلك.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
        },
      ],
    },
    {
      title: "Travel Fusion Bookings – All Hubs",
      categoryId: GENERAL_INFO_ID,
      folderId: RESERVATIONS_FOLDER_ID,
      description:
        "Bookings created through the Travel Fusion third-party channel are on hold — no modifications, cancellations, name changes or credit transfers from the Call Center, with one exception for disruption-related flight transfers.",
      overview:
        "Hold all actions on any PNR created through Travel Fusion until further notice. Do not process credit transfers, name changes, modifications, or cancellations for Travel Fusion bookings through any channel — calls or chat. Direct the caller to contact Travel Fusion directly for assistance.\n\nException: if the passenger requests a flight transfer specifically due to a disruption alert, the transfer can be processed. If they instead request a cancellation or refund due to the alert, direct them to Travel Fusion.",
      procedures: [
        {
          title: "Identify a Travel Fusion booking",
          content: "Check the booking source/channel on the PNR — if it was created through Travel Fusion, hold all standard actions.",
        },
      ],
      scenarios: [
        {
          situation: "A Travel Fusion passenger calls asking to change the name on their ticket.",
          response: "Not possible from the Call Center — direct them to contact Travel Fusion directly for any assistance with their booking.",
        },
        {
          situation: "A Travel Fusion passenger's flight was disrupted and they want to transfer to a new flight.",
          response: "This is the one exception — process the flight transfer. If they ask for a cancellation or refund instead, direct them to Travel Fusion.",
        },
        {
          situation: "A Travel Fusion passenger wants to use a credit voucher toward a new booking.",
          response: "Not possible — hold all credit transfers on Travel Fusion bookings and direct them to Travel Fusion.",
        },
      ],
      notes: [
        { type: "Warning", content: "This hold applies until further notice — check for an updated instruction before assuming it has lifted." },
      ],
      keywords: ["travel fusion", "third-party booking", "hold"],
      chatTemplates: [
        {
          title: "Travel Fusion booking on hold (English)",
          content:
            "I'm sorry, but bookings made through Travel Fusion are on hold for changes right now — I'd recommend contacting Travel Fusion directly for help with this. The one exception is a flight transfer due to a disruption alert, which we can process here.",
        },
        {
          title: "حجز Travel Fusion معلّق (Arabic)",
          content:
            "نأسف، الحجوزات التي تمت عبر Travel Fusion معلّقة حالياً من ناحية التعديلات - أنصح بالتواصل مباشرة مع Travel Fusion للمساعدة. الاستثناء الوحيد هو نقل الرحلة بسبب تنبيه اضطراب، والذي يمكننا معالجته هنا.",
        },
      ],
      emailTemplates: [
        {
          title: "Travel Fusion booking on hold (English)",
          subject: "Travel Fusion booking — action needed from Travel Fusion",
          body: "Dear [Customer Name],\n\nThank you for reaching out about your Travel Fusion booking.\n\nBookings made through Travel Fusion are currently on hold for modifications, cancellations, name changes and credit transfers through our Call Center. Please contact Travel Fusion directly for assistance. The one exception is a flight transfer requested due to a disruption alert, which we're able to process here.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "حجز Travel Fusion معلّق (Arabic)",
          subject: "حجز Travel Fusion - يلزم التواصل مع Travel Fusion",
          body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لتواصلكم بخصوص حجزكم عبر Travel Fusion.\n\nالحجوزات التي تمت عبر Travel Fusion معلّقة حالياً من ناحية التعديل والإلغاء وتغيير الاسم ونقل الرصيد عبر مركز الاتصال لدينا. يرجى التواصل مباشرة مع Travel Fusion للمساعدة. الاستثناء الوحيد هو طلب نقل الرحلة بسبب تنبيه اضطراب، والذي يمكننا معالجته هنا.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
        },
      ],
    },
    {
      title: "Emirates Islamic Visa Card Promotion — 10%/20% Off",
      categoryId: GENERAL_INFO_ID,
      folderId: promotionsFolderId,
      description:
        "Active promotion: 10% off Value fares and 20% off Ultimate fares for flights from the UAE, using an eligible Emirates Islamic Visa card.",
      overview:
        "Active booking window: 8 July – 6 August 2026. Travel window: 8 July – 30 September 2026. Applicable only to flights originating from the UAE.\n\nDiscount: 10% on Value fares, 20% on Ultimate fares — applies to fare and surcharge only; all taxes are excluded.\n\nProcedure: passenger adds promo code EIB at the search page, then pays at the final stage using an eligible Emirates Islamic bank card.\n\nIf the promotion doesn't apply at the final stage, it may be due to blackout dates or seat availability.",
      scenarios: [
        {
          situation: "A passenger asks how to redeem the Emirates Islamic Visa Card discount.",
          response: "Add promo code EIB at the search page, then pay at checkout with an eligible Emirates Islamic bank card — 10% off Value fares or 20% off Ultimate fares, fare and surcharge only.",
        },
        {
          situation: "A passenger says the discount didn't apply at checkout.",
          response: "This can happen due to blackout dates or seat availability — double-check both before escalating.",
        },
        {
          situation: "A passenger asks if the discount applies to a flight departing from Cairo.",
          response: "No — this promotion applies only to flights originating from the UAE.",
        },
      ],
      notes: [
        { type: "Warning", content: "Booking window: 8 July – 6 August 2026. Travel window: 8 July – 30 September 2026. Confirm this promotion is still active before quoting it." },
      ],
      keywords: ["emirates islamic", "visa card", "promo code EIB", "promotion"],
      chatTemplates: [
        {
          title: "Emirates Islamic Visa Card promotion (English)",
          content:
            "Yes, that promo is active right now! Add code EIB at search, then pay with an eligible Emirates Islamic card — 10% off Value or 20% off Ultimate fares, valid on UAE-departing flights for travel up to 30 September.",
        },
        {
          title: "عرض بطاقة الإمارات الإسلامي فيزا (Arabic)",
          content:
            "نعم، هذا العرض ساري حالياً! أضيفوا الرمز EIB عند البحث، ثم ادفعوا ببطاقة الإمارات الإسلامي المؤهلة - خصم 10% على باقة Value أو 20% على Ultimate، ساري على الرحلات المغادرة من الإمارات للسفر حتى نهاية سبتمبر.",
        },
      ],
      emailTemplates: [
        {
          title: "Emirates Islamic Visa Card promotion (English)",
          subject: "Emirates Islamic Visa Card promotion",
          body: "Dear [Customer Name],\n\nThank you for asking about the Emirates Islamic Visa Card promotion.\n\nThis promotion is active for bookings made 8 July – 6 August 2026, for travel 8 July – 30 September 2026, on flights originating from the UAE. Add promo code EIB at the search page, then pay using an eligible Emirates Islamic bank card — 10% off Value fares or 20% off Ultimate fares (fare and surcharge only, taxes excluded). If the discount doesn't apply at checkout, it may be due to blackout dates or seat availability.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "عرض بطاقة الإمارات الإسلامي فيزا (Arabic)",
          subject: "عرض بطاقة الإمارات الإسلامي فيزا",
          body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن عرض بطاقة الإمارات الإسلامي فيزا.\n\nهذا العرض ساري لحجوزات تتم بين 8 يوليو و6 أغسطس 2026، للسفر بين 8 يوليو و30 سبتمبر 2026، على الرحلات المغادرة من الإمارات. أضيفوا الرمز الترويجي EIB عند البحث، ثم ادفعوا ببطاقة الإمارات الإسلامي المؤهلة - خصم 10% على باقة Value أو 20% على Ultimate (على الأجرة والرسوم الإضافية فقط، باستثناء الضرائب). إذا لم يُطبَّق الخصم عند الدفع، فقد يكون ذلك بسبب تواريخ محظورة أو توفر المقاعد.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
        },
      ],
    },
    {
      title: "Promotion — Flights to Abu Dhabi (AUH)",
      categoryId: GENERAL_INFO_ID,
      folderId: promotionsFolderId,
      description: "Active promotion: discounted starting fares to Abu Dhabi (AUH) from select Middle East origins.",
      overview:
        "Booking window: 1–15 July 2026. Travel window: 1 July – 31 October 2026.\n\nStarting prices to AUH:\n- Amman (AMM) — JOD 115\n- Aqaba (ADJ) — JOD 106\n- Beirut (BEY) — USD 158\n- Damascus (DAM) — USD 158\n- Aleppo (ALP) — USD 158\n- Bahrain (BAH) — BHD 36\n- Kuwait (KWI) — KWD 29",
      scenarios: [
        {
          situation: "A passenger in Amman asks about the cheapest fare to Abu Dhabi.",
          response: "The current promotion starts at JOD 115 to AUH, bookable through 15 July for travel up to 31 October 2026.",
        },
        {
          situation: "A passenger asks if this AUH promotion is still bookable.",
          response: "Confirm today's date is within the booking window (1–15 July 2026) before quoting — if it's outside that window, this promotion is no longer available.",
        },
      ],
      notes: [
        { type: "Warning", content: "Booking window: 1–15 July 2026. Confirm this promotion is still active before quoting it." },
      ],
      keywords: ["AUH promotion", "Abu Dhabi", "starting fares"],
      chatTemplates: [
        {
          title: "AUH flights promotion (English)",
          content:
            "There's a current promotion to Abu Dhabi with starting fares as low as JOD 115 depending on your origin — bookable through 15 July for travel up to the end of October. Where are you flying from?",
        },
        {
          title: "عرض ترويجي لرحلات أبوظبي (Arabic)",
          content:
            "يوجد حالياً عرض ترويجي للرحلات إلى أبوظبي بأسعار تبدأ من 115 دينارًا أردنيًا حسب نقطة الانطلاق - قابل للحجز حتى 15 يوليو للسفر حتى نهاية أكتوبر. من أين ستكون رحلتكم؟",
        },
      ],
      emailTemplates: [
        {
          title: "AUH flights promotion (English)",
          subject: "Promotion — flights to Abu Dhabi (AUH)",
          body: "Dear [Customer Name],\n\nThank you for asking about fares to Abu Dhabi.\n\nWe currently have a promotion running on flights to AUH, bookable 1–15 July 2026 for travel between 1 July and 31 October 2026. Starting fares include: Amman JOD 115, Aqaba JOD 106, Beirut USD 158, Damascus USD 158, Aleppo USD 158, Bahrain BHD 36, Kuwait KWD 29.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "عرض ترويجي لرحلات أبوظبي (Arabic)",
          subject: "عرض ترويجي - رحلات إلى أبوظبي",
          body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن أسعار الرحلات إلى أبوظبي.\n\nيوجد لدينا حالياً عرض ترويجي على الرحلات إلى أبوظبي، قابل للحجز بين 1 و15 يوليو 2026 للسفر بين 1 يوليو و31 أكتوبر 2026. تشمل الأسعار الابتدائية: عمّان 115 دينارًا أردنيًا، العقبة 106 دنانير أردنية، بيروت 158 دولارًا أمريكيًا، دمشق 158 دولارًا أمريكيًا، حلب 158 دولارًا أمريكيًا، البحرين 36 دينارًا بحرينيًا، الكويت 29 دينارًا كويتيًا.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
        },
      ],
    },
    {
      title: "Islamabad Sales Office – New Address (9P & G9)",
      categoryId: NINE_P_CATEGORY_ID,
      folderId: NINE_P_OTHER_FOLDER_ID,
      description: "The Fly Jinnah (9P) and Air Arabia (G9) Islamabad Sales Office relocated effective 13 July 2026.",
      overview:
        "Effective Monday 13 July 2026, the Fly Jinnah (9P) and Air Arabia (G9) Islamabad Sales Office relocated to:\n\nOffice No. 301, 3rd Floor, PakLand Tower 2, Jinnah Avenue, New Blue Area, Islamabad",
      scenarios: [
        {
          situation: "A passenger asks for the Islamabad sales office address.",
          response: "Office No. 301, 3rd Floor, PakLand Tower 2, Jinnah Avenue, New Blue Area, Islamabad — effective 13 July 2026, this serves both Fly Jinnah (9P) and Air Arabia (G9).",
        },
      ],
      keywords: ["Islamabad", "sales office", "office address"],
      chatTemplates: [
        {
          title: "Islamabad Sales Office address (English)",
          content:
            "Our Islamabad Sales Office (for both Fly Jinnah and Air Arabia) is at Office No. 301, 3rd Floor, PakLand Tower 2, Jinnah Avenue, New Blue Area, Islamabad.",
        },
        {
          title: "عنوان مكتب مبيعات إسلام آباد (Arabic)",
          content:
            "يقع مكتب مبيعات إسلام آباد لدينا (لكل من Fly Jinnah والعربية للطيران) في: مكتب رقم 301، الطابق الثالث، برج باكلاند 2، شارع جناح، المنطقة الزرقاء الجديدة، إسلام آباد.",
        },
      ],
      emailTemplates: [
        {
          title: "Islamabad Sales Office address (English)",
          subject: "Islamabad Sales Office — new address",
          body: "Dear [Customer Name],\n\nThank you for asking for our Islamabad Sales Office address.\n\nEffective 13 July 2026, our Islamabad Sales Office (serving both Fly Jinnah/9P and Air Arabia/G9) is located at: Office No. 301, 3rd Floor, PakLand Tower 2, Jinnah Avenue, New Blue Area, Islamabad.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support",
        },
        {
          title: "عنوان مكتب مبيعات إسلام آباد (Arabic)",
          subject: "مكتب مبيعات إسلام آباد - العنوان الجديد",
          body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لاستفساركم عن عنوان مكتب مبيعات إسلام آباد لدينا.\n\nاعتباراً من 13 يوليو 2026، يقع مكتب مبيعات إسلام آباد (ويخدم كلاً من Fly Jinnah/9P والعربية للطيران/G9) في: مكتب رقم 301، الطابق الثالث، برج باكلاند 2، شارع جناح، المنطقة الزرقاء الجديدة، إسلام آباد.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران",
        },
      ],
    },
  ];

  for (const spec of NEW_ARTICLES) {
    const existing = await prisma.article.findFirst({ where: { title: spec.title } });
    if (existing) {
      console.log(`Skip (already exists): ${spec.title}`);
      continue;
    }

    const article = await prisma.article.create({
      data: {
        title: spec.title,
        slug: `${slugify(spec.title)}-${Date.now()}`,
        categoryId: spec.categoryId,
        folderId: spec.folderId ?? null,
        description: spec.description,
        overview: spec.overview,
        author: AUTHOR,
        status: "Published",
        ...buildArticleSectionsCreateData({
          procedures: spec.procedures,
          scenarios: spec.scenarios,
          notes: spec.notes,
          keywords: spec.keywords,
          chatTemplates: spec.chatTemplates,
          emailTemplates: spec.emailTemplates,
        }),
      },
    });
    console.log(`Created article: ${spec.title} (#${article.id})`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
