// Applies the 2026-07-13 baggage delay/damage complaint-handling policy update
// (Emails/Fw_ Baggage delay_damage complaint handling.eml) to:
//   - Article #146 "Baggage Claims – All Hubs"
//   - Article #145 "Handling Complaints – All Hubs"
//   - Decision Tree #54 "Baggage Claim — Still at the Airport?"
//   - Decision Tree #53 "Handling a Complaint — What Type?"
//   - Glossary: adds a "PIR" term
//
// Requires ADMIN_EMAIL / ADMIN_PASSWORD in .env. Run with:
//   npx tsx scripts/tmp-apply-baggage-policy-update.ts

import "dotenv/config";
import { chromium } from "playwright";

const SITE_URL = "https://air-arabia-agent-hub-v2.vercel.app";
const AUTHOR = "Nourhan Khaled";
const CATEGORY_ID = 17; // Customer Support

const BAGGAGE_ARTICLE_ID = 146;
const COMPLAINTS_ARTICLE_ID = 145;
const BAGGAGE_TREE_ID = 54;
const COMPLAINT_TREE_ID = 53;

const BAGGAGE_ARTICLE = {
  title: "Baggage Claims – All Hubs",
  description: "How passengers should report damaged, lost, or delayed baggage, and how to handle follow-ups, refusals and overdue escalations.",
  overview:
    "For baggage that is delayed, lost, or damaged, the passenger must go to the Baggage Claims desk at the arrival airport, at the time of arrival, to file a complaint and get a Property Irregularity Report (PIR) — this cannot be initiated after leaving the airport, and a new case should not be raised on Sprinklr for it.\n\nFollow-ups on an existing claim go directly to Lost & Found / Baggage Claim, using the contact details printed on the passenger's PIR — not through the Call Center.",
  procedures: [
    { title: "Reporting new damage, loss or delay", content: "Direct the passenger to the Baggage Claims desk at the arrival airport, at the time of arrival, to file the report and get a PIR (Property Irregularity Report). This can't be done after leaving the airport, and a new case should not be raised on Sprinklr for it." },
    { title: "Following up on an existing claim", content: "Once a PIR exists, the passenger should contact Lost & Found / Baggage Claim directly, using the contact details printed on their PIR — not the Call Center." },
    { title: "Lost & Found refused a PIR, or isn't responding", content: "If the passenger says Lost & Found refused to issue a PIR, or isn't answering their follow-up calls, raise a case under Baggage Claim in Sprinklr, clearly stating that staff refused or aren't responding." },
    { title: "Escalating an overdue claim (Baggage Category)", content: "If the passenger already has a PIR and a damaged-bag complaint exceeds 7 days, or a lost-bag complaint exceeds 21 days, raise a complaint under Baggage Category in Sprinklr." },
  ],
  scenarios: [
    { situation: "A passenger calls two days after landing to report a damaged suitcase.", response: "Baggage damage must be reported at the arrival airport at the time of arrival — a report made days later after leaving the airport cannot be processed the same way; advise them to check with the arrival airport's baggage services desk regardless." },
    { situation: "A passenger's bag didn't arrive on the same flight and they're still at the airport.", response: "Good — since they're still at the airport, they should report the delayed baggage immediately at the arrival airport's baggage services counter." },
    { situation: "A passenger asks if they can email photos of damaged luggage instead of visiting a counter.", response: "Damage, loss, and delay all need to be reported at the arrival airport at the time of arrival — this isn't something that can be substituted with an email report after the fact." },
    { situation: "A passenger calls to say Lost & Found refused to issue them a PIR.", response: "Raise a case under Baggage Claim in Sprinklr, clearly stating that Lost & Found staff refused to issue a PIR — this is not a Staff Attitude case." },
    { situation: "A passenger with an open claim says Lost & Found isn't answering their follow-up calls.", response: "Follow-ups normally go directly to Lost & Found using the contact number on the passenger's PIR — but if they're genuinely not answering, raise a case under Baggage Claim in Sprinklr, clearly stating that staff aren't responding." },
    { situation: "A passenger with a PIR says their damaged-bag claim has been open for 9 days with no resolution.", response: "Since the damaged-bag complaint has a PIR and has passed the 7-day mark, raise it as a complaint under Baggage Category in Sprinklr." },
    { situation: "A passenger with a PIR says their bag has been missing for over three weeks.", response: "Since the lost-bag complaint has a PIR and has passed the 21-day mark, raise it as a complaint under Baggage Category in Sprinklr." },
  ],
  notes: [
    { type: "Warning", content: "Baggage claims are time- and location-sensitive — always direct the passenger to report at the arrival airport immediately, not after the fact." },
    { type: "Information", content: "Do not raise a new Sprinklr case for the first report of delayed, lost, or damaged baggage — that always goes through the Baggage Claims desk at the arrival airport. Sprinklr is only used for the follow-up escalations below." },
    { type: "Warning", content: "If Lost & Found refuses to issue a PIR, or isn't answering follow-up calls, raise it under Baggage Claim (not Staff Attitude) in Sprinklr, clearly noting the refusal or non-response." },
    { type: "Information", content: "Once a PIR exists, a damaged-bag complaint that passes 7 days, or a lost-bag complaint that passes 21 days, escalates to a Baggage Category complaint in Sprinklr." },
  ],
  keywords: ["baggage claim", "damaged", "lost", "delayed", "PIR", "property irregularity report", "lost and found", "baggage category"],
  chatTemplates: [
    { title: "Reporting baggage damage after leaving the airport (English)", content: "I'm sorry to hear about your damaged suitcase. Since baggage damage needs to be reported at the arrival airport at the time of arrival, I'd recommend checking with that airport's baggage services desk directly, even now." },
    { title: "الإبلاغ عن تلف الأمتعة بعد مغادرة المطار (Arabic)", content: "يؤسفنا سماع تعرّض حقيبتكم للضرر. بما أنه يجب الإبلاغ عن تلف الأمتعة في مطار الوصول وقت الوصول، أنصح بالتواصل مباشرة مع مكتب خدمات الأمتعة في ذلك المطار، حتى الآن." },
    { title: "Report your delayed baggage now (English)", content: "Good, since you're still at the airport, please head to the baggage services counter right away so they can log the delayed baggage report immediately." },
    { title: "بلّغوا عن تأخر أمتعتكم الآن (Arabic)", content: "جيد، بما أنكم لا تزالون في المطار، يرجى التوجه فورًا إلى كاونتر خدمات الأمتعة حتى يتم تسجيل بلاغ تأخر الأمتعة على الفور." },
    { title: "Photos alone cannot replace an airport report (English)", content: "I'm sorry, but photos by email can't substitute for reporting at the airport — damage, loss and delay all need to be reported at the arrival airport at the time of arrival for us to process a claim." },
    { title: "الصور وحدها لا تُغني عن الإبلاغ في المطار (Arabic)", content: "نأسف، لا يمكن أن تحل الصور المرسلة عبر البريد الإلكتروني محل الإبلاغ في المطار - يجب الإبلاغ عن التلف أو الفقدان أو التأخر في مطار الوصول وقت الوصول لمعالجة المطالبة." },
    { title: "Escalating a baggage claim (Lost & Found refused/not responding) (English)", content: "I'm sorry you've had trouble getting through to Lost & Found. I've raised this directly as a Baggage Claim escalation, noting that our team hasn't been able to help you get this resolved — someone will follow up with you soon." },
    { title: "تصعيد مطالبة الأمتعة (رفض أو عدم استجابة قسم المفقودات) (Arabic)", content: "يؤسفنا صعوبة تواصلكم مع قسم المفقودات (Lost & Found). لقد قمنا برفع هذا الأمر مباشرة كتصعيد ضمن مطالبة الأمتعة (Baggage Claim)، مع توضيح أن فريقنا لم يتمكن من مساعدتكم في حل الأمر - سيتواصل معكم أحد ممثلينا قريبًا." },
  ],
  emailTemplates: [
    { title: "Reporting baggage damage after leaving the airport (English)", subject: "Reporting baggage damage after leaving the airport", body: "Dear [Customer Name],\n\nWe're sorry to hear about the damage to your suitcase reported a couple of days after landing.\n\nBaggage damage must be reported at the arrival airport at the time of arrival. As this report is coming in after you've left the airport, we'd recommend contacting that airport's baggage services desk directly to check what options remain available.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "الإبلاغ عن تلف الأمتعة بعد مغادرة المطار (Arabic)", subject: "الإبلاغ عن تلف الأمتعة بعد مغادرة المطار", body: "عزيزي/عزيزتي [اسم العميل]،\n\nيؤسفنا سماع تعرّض حقيبتكم للضرر، والذي تم الإبلاغ عنه بعد يومين من الهبوط.\n\nيجب الإبلاغ عن تلف الأمتعة في مطار الوصول وقت الوصول. وبما أن هذا البلاغ يصل بعد مغادرتكم المطار، ننصح بالتواصل مباشرة مع مكتب خدمات الأمتعة في ذلك المطار للتحقق من الخيارات المتاحة.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
    { title: "Report your delayed baggage now (English)", subject: "Report your delayed baggage now", body: "Dear [Customer Name],\n\nThank you for letting us know your bag didn't arrive on your flight.\n\nAs you're still at the airport, please report this immediately at the arrival airport's baggage services counter so it can be logged and tracked without delay.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "بلّغوا عن تأخر أمتعتكم الآن (Arabic)", subject: "بلّغوا عن تأخر أمتعتكم الآن", body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لإبلاغنا بعدم وصول حقيبتكم مع رحلتكم.\n\nبما أنكم لا تزالون في المطار، يرجى الإبلاغ عن ذلك فورًا في كاونتر خدمات الأمتعة في مطار الوصول حتى يتم تسجيل البلاغ ومتابعته دون تأخير.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
    { title: "Photos alone cannot replace an airport report (English)", subject: "Photos alone cannot replace an airport report", body: "Dear [Customer Name],\n\nThank you for offering to send photos of your damaged luggage.\n\nUnfortunately, damage, loss, and delay all need to be reported at the arrival airport at the time of arrival — this cannot be substituted with an email report after the fact.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "الصور وحدها لا تُغني عن الإبلاغ في المطار (Arabic)", subject: "الصور وحدها لا تُغني عن الإبلاغ في المطار", body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لعرضكم إرسال صور لأمتعتكم التالفة.\n\nللأسف، يجب الإبلاغ عن التلف أو الفقدان أو التأخر في مطار الوصول وقت الوصول - ولا يمكن الاستعاضة عن ذلك ببلاغ لاحق عبر البريد الإلكتروني.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
    { title: "Escalating a baggage claim (Lost & Found refused/not responding) (English)", subject: "Escalating your baggage claim", body: "Dear [Customer Name],\n\nWe're sorry to hear you haven't been able to get a response from Lost & Found on your baggage claim.\n\nWe've raised this directly as a Baggage Claim escalation, clearly noting that our team hasn't been able to help you get this resolved. Someone will follow up with you soon.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "تصعيد مطالبة الأمتعة (رفض أو عدم استجابة قسم المفقودات) (Arabic)", subject: "تصعيد مطالبة الأمتعة الخاصة بكم", body: "عزيزي/عزيزتي [اسم العميل]،\n\nيؤسفنا سماع عدم تمكنكم من الحصول على رد من قسم المفقودات (Lost & Found) بخصوص مطالبة الأمتعة الخاصة بكم.\n\nلقد قمنا برفع هذا الأمر مباشرة كتصعيد ضمن مطالبة الأمتعة (Baggage Claim)، مع توضيح أن فريقنا لم يتمكن من مساعدتكم في حل الأمر. سيتواصل معكم أحد ممثلينا قريبًا.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
  ],
};

const COMPLAINTS_ARTICLE = {
  title: "Handling Complaints – All Hubs",
  description: "The core complaint-handling approach, the standard complaint types, and the most common sub-procedures (payment issues, quality cases, and baggage complaints).",
  overview:
    "The most important skill when handling a complaint is listening and showing empathy, then acknowledging the inconvenience caused. Show the passenger you're doing your best to help, then offer a solution, escalate to a supervisor, or raise a case, depending on the complaint type.\n\nStandard complaint types: AirRewards, Booking issues, Business Class downgrade, Call Center complaints, Flight delay & cancellation, Holiday booking complaints, Onboard services, Payment issues, Staff behavior, Baggage Claim, Baggage Category.",
  procedures: [
    { title: "Payment issues", content: "If a passenger's money was debited but the PNR isn't confirmed, first ask them to check again after 2 hours (the payment may still be processing). If still unresolved after 2 hours: run an advanced search to check whether a PNR was generated, raise a Sprinklr request for payment issues, and extend the booking's time limit by at least 24 hours (or create one if no PNR was found)." },
    { title: "Quality cases (Call Center complaints)", content: "Raise a request under Complaints > Call Center Complaints, then select the correct sub-type — e.g. wrong information given, wrong booking, wrong modification, or a cancellation that was requested but not completed." },
    { title: "contactus@ email inquiries", content: "contactus@airarabia.com and contactus@flyjinnah.com no longer accept new customer emails. New messages to these addresses receive an automated reply directing the customer to the Feedback/Complaint form on the website or app. Always create a Sprinklr case where applicable. Customers already in an ongoing email thread may continue that conversation as normal." },
    { title: "Baggage Claim / Baggage Category", content: "Baggage complaints don't start here — delayed, lost, or damaged baggage must first be reported at the Baggage Claims desk at the arrival airport to get a PIR (Property Irregularity Report); don't raise a new Sprinklr case for that first report. Once a PIR exists: raise under Baggage Claim if Lost & Found refused to issue it or isn't answering follow-up calls, or under Baggage Category once a damaged-bag claim (7+ days) or lost-bag claim (21+ days) with a PIR remains unresolved. See Baggage Claims – All Hubs for the full walk-through." },
  ],
  scenarios: [
    { situation: "A passenger is upset that money was debited but they never received a booking confirmation.", response: "Empathize first, then ask them to check again in case the payment is still processing — if still unresolved after 2 hours, run an advanced search for a generated PNR, raise a Sprinklr payment-issues request, and extend the booking time limit by at least 24 hours." },
    { situation: "A passenger complains that a previous agent gave them the wrong modification fee over the phone.", response: "This is a quality case — raise it under Complaints > Call Center Complaints, selecting the 'wrong information' sub-type." },
    { situation: "A passenger is angry about a flight cancellation and wants to vent before discussing solutions.", response: "Let them speak, listen actively, and acknowledge the inconvenience before moving to solutions — jumping straight to policy without empathy tends to escalate the call further." },
    { situation: "A customer says they emailed contactus@airarabia.com and got no reply.", response: "That inbox no longer accepts new emails — it now auto-replies directing them to the Feedback/Complaint form on our website or app. If it's a genuine new complaint, raise a Sprinklr case for them now." },
    { situation: "A passenger says Lost & Found refused to give them a PIR when they tried to report their bag.", response: "This isn't a payment or quality case — raise it under Baggage Claim in Sprinklr, clearly noting that Lost & Found refused to issue the PIR. See Baggage Claims – All Hubs for the full policy." },
  ],
  notes: [
    { type: "Information", content: "Complaint types map to a specific Sprinklr sub-type each — always select the correct one so it routes to the right team." },
    { type: "Information", content: "Baggage complaints route differently — see Baggage Claims – All Hubs before raising a case under Baggage Claim or Baggage Category." },
  ],
  keywords: ["complaints", "escalation", "sprinklr", "payment issue", "contactus email", "baggage claim", "baggage category", "PIR"],
  chatTemplates: [
    { title: "We're looking into your payment issue (English)", content: "I'm really sorry for the trouble this has caused. Let me look into this properly for you right now — can you walk me through exactly what happened so I make sure we fix the right thing?" },
    { title: "نحن نبحث في مشكلة الدفع الخاصة بكم (Arabic)", content: "أعتذر بشدة عن هذا الإزعاج. دعوني أتحقق من الأمر بشكل صحيح الآن - هل يمكنكم إخباري بما حدث بالتفصيل حتى أتأكد من حل المشكلة الصحيحة؟" },
    { title: "Your Call Center complaint has been logged (English)", content: "I completely understand your frustration, and I apologize for the wrong information you received. Let me raise this as a quality case so it's reviewed and addressed properly." },
    { title: "تم تسجيل شكواكم بخصوص مركز الاتصال (Arabic)", content: "أتفهم تمامًا استياءكم، وأعتذر عن المعلومات الخاطئة التي تلقيتموها. دعوني أفتح هذا كطلب جودة ليتم مراجعته ومعالجته بشكل صحيح." },
    { title: "We're here to help resolve this (English)", content: "I hear you, and I'm sorry this has been so frustrating. Please take your time — I'm listening, and once you've walked me through everything we'll work on the best way forward together." },
    { title: "نحن هنا لمساعدتكم في حل هذا الأمر (Arabic)", content: "أتفهم شعوركم، وأعتذر عن هذا الإزعاج الكبير. خذوا وقتكم من فضلكم - أنا أستمع إليكم، وبعد أن تخبروني بكل التفاصيل سنعمل معًا على إيجاد أفضل حل." },
    { title: "Contactus email no longer monitored (English)", content: "I'm sorry for the trouble — that inbox no longer accepts new emails, so it wouldn't have reached anyone. Let me raise this as a proper case for you right now instead." },
    { title: "البريد الإلكتروني للتواصل لم يعد نشطًا (Arabic)", content: "أعتذر عن هذا الإزعاج - هذا البريد الإلكتروني لم يعد يستقبل رسائل جديدة، لذا لم تصل رسالتكم لأحد. دعوني أفتح لكم حالة رسمية الآن بدلاً من ذلك." },
  ],
  emailTemplates: [
    { title: "We're looking into your payment issue (English)", subject: "We're looking into your payment issue", body: "Dear [Customer Name],\n\nWe're very sorry to hear your payment was debited without receiving a booking confirmation.\n\nPlease allow up to 2 hours in case the payment is still processing. If it remains unresolved after that, we'll run an advanced search for any generated PNR, raise a Sprinklr payment-issues request on your behalf, and extend the booking time limit by at least 24 hours.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "نحن نبحث في مشكلة الدفع الخاصة بكم (Arabic)", subject: "نحن نبحث في مشكلة الدفع الخاصة بكم", body: "عزيزي/عزيزتي [اسم العميل]،\n\nيؤسفنا سماع أنه تم خصم المبلغ من حسابكم دون استلام تأكيد للحجز.\n\nيرجى الانتظار حتى ساعتين في حال كانت عملية الدفع لا تزال قيد المعالجة. إذا استمرت المشكلة بعد ذلك، سنقوم بإجراء بحث متقدم عن أي حجز تم إنشاؤه، وفتح طلب على Sprinklr بخصوص مشكلة الدفع نيابةً عنكم، وتمديد مهلة الحجز لمدة 24 ساعة على الأقل.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
    { title: "Your Call Center complaint has been logged (English)", subject: "Your Call Center complaint has been logged", body: "Dear [Customer Name],\n\nThank you for letting us know that a previous agent gave you incorrect modification fee information.\n\nWe're sorry for this experience. We've raised this as a quality case under Complaints > Call Center Complaints, and it will be reviewed by our quality team to ensure it doesn't happen again.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "تم تسجيل شكواكم بخصوص مركز الاتصال (Arabic)", subject: "تم تسجيل شكواكم بخصوص مركز الاتصال", body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لإبلاغنا بأن أحد ممثلي خدمة العملاء زوّدكم بمعلومات خاطئة حول رسوم التعديل.\n\nنأسف لهذه التجربة. لقد سجّلنا هذا كطلب جودة ضمن الشكاوى > شكاوى مركز الاتصال، وسيتم مراجعته من قبل فريق الجودة لدينا لضمان عدم تكراره.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
    { title: "We're here to help resolve this (English)", subject: "We're here to help resolve this", body: "Dear [Customer Name],\n\nWe're very sorry for the frustration caused by your flight cancellation.\n\nWe understand how disruptive this has been, and we want to make it right. Please share the full details of what happened, and our team will review your case and follow up with the best available solution.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "نحن هنا لمساعدتكم في حل هذا الأمر (Arabic)", subject: "نحن هنا لمساعدتكم في حل هذا الأمر", body: "عزيزي/عزيزتي [اسم العميل]،\n\nنأسف بشدة للإزعاج الناتج عن إلغاء رحلتكم.\n\nنتفهم مدى الإزعاج الذي سببه هذا الأمر، ونرغب في تصحيحه. يرجى مشاركة كافة تفاصيل ما حدث، وسيقوم فريقنا بمراجعة حالتكم والمتابعة بأفضل حل متاح.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
    { title: "Contactus email no longer monitored (English)", subject: "Contactus email no longer monitored", body: "Dear [Customer Name],\n\nThank you for reaching out, and we're sorry your email to contactus@airarabia.com didn't receive a reply — that inbox no longer accepts new customer emails and now sends an automated response directing you to our Feedback/Complaint form.\n\nWe've logged your concern as a case with our team directly, so no further action is needed on your end for this.\n\nShould you need further assistance, we're always here for you by phone, email or live chat: https://www.airarabia.com/en/help/contact-us.\n\nBest regards,\nAir Arabia Customer Support" },
    { title: "البريد الإلكتروني للتواصل لم يعد نشطًا (Arabic)", subject: "البريد الإلكتروني للتواصل لم يعد نشطًا", body: "عزيزي/عزيزتي [اسم العميل]،\n\nشكراً لتواصلكم، ونعتذر عن عدم استلام رد على رسالتكم إلى contactus@airarabia.com - هذا البريد الإلكتروني لم يعد يستقبل رسائل جديدة من العملاء ويقوم الآن بإرسال رد تلقائي يوجهكم إلى نموذج الملاحظات/الشكاوى لدينا.\n\nلقد قمنا بتسجيل استفساركم كحالة مباشرة مع فريقنا، لذا لا حاجة لأي إجراء إضافي من جانبكم بخصوص هذا الأمر.\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: https://www.airarabia.com/en/help/contact-us\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران" },
  ],
};

const BAGGAGE_TREE = {
  title: "Baggage Claim — Still at the Airport?",
  slug: "baggage-claim-still-at-the-airport-1783845136615-51",
  description: "Where and when a baggage claim can be filed, and how to route follow-ups, refusals and overdue escalations.",
  topic: "Customer Support",
  status: "Published",
  author: AUTHOR,
  sourceArticleId: BAGGAGE_ARTICLE_ID,
  nodes: [
    { clientKey: 1, type: "question" as const, text: "What does the passenger need?", order: 1, options: [
      { label: "Report new damage, loss or delay", targetClientKey: 2, targetTreeId: null },
      { label: "Follow up on an existing claim (already has a PIR)", targetClientKey: 5, targetTreeId: null },
    ] },
    { clientKey: 2, type: "question" as const, text: "Is the passenger still at the arrival airport?", order: 2, options: [
      { label: "Yes, still at the airport", targetClientKey: 3, targetTreeId: null },
      { label: "No, already left the airport", targetClientKey: 4, targetTreeId: null },
    ] },
    { clientKey: 3, type: "outcome" as const, text: "Direct them to the baggage services counter right now to log the damage/loss/delay report and get a PIR (Property Irregularity Report) immediately. Do not raise this on Sprinklr.", order: 3, options: [] },
    { clientKey: 4, type: "outcome" as const, text: "Damage, loss and delay must be reported at the arrival airport at the time of arrival to get a PIR — this can't be substituted with a later phone or email report, and shouldn't be raised as a new Sprinklr case. Advise contacting that airport's baggage desk directly regardless.", order: 4, options: [
      { label: "Passenger wants to file a formal complaint instead", targetClientKey: null, targetTreeId: COMPLAINT_TREE_ID },
    ] },
    { clientKey: 5, type: "question" as const, text: "What's the situation with the existing claim?", order: 5, options: [
      { label: "Lost & Found is responding normally", targetClientKey: 6, targetTreeId: null },
      { label: "Lost & Found refused to issue a PIR, or isn't answering follow-up calls", targetClientKey: 7, targetTreeId: null },
      { label: "Damaged bag complaint exceeds 7 days (with PIR)", targetClientKey: 8, targetTreeId: null },
      { label: "Lost bag complaint exceeds 21 days (with PIR)", targetClientKey: 9, targetTreeId: null },
    ] },
    { clientKey: 6, type: "outcome" as const, text: "Advise the passenger to contact Lost & Found / Baggage Claim directly, using the contact details printed on their PIR — not the Call Center.", order: 6, options: [] },
    { clientKey: 7, type: "outcome" as const, text: "Raise a case under Baggage Claim in Sprinklr, clearly stating that Lost & Found staff refused to issue a PIR or are not responding to follow-up calls.", order: 7, options: [] },
    { clientKey: 8, type: "outcome" as const, text: "Raise a complaint under Baggage Category in Sprinklr — this applies once a damaged-bag claim with a PIR passes 7 days unresolved.", order: 8, options: [] },
    { clientKey: 9, type: "outcome" as const, text: "Raise a complaint under Baggage Category in Sprinklr — this applies once a lost-bag claim with a PIR passes 21 days unresolved.", order: 9, options: [] },
  ],
};

const COMPLAINT_TREE = {
  title: "Handling a Complaint — What Type?",
  slug: "handling-a-complaint-what-type-1783845136499-50",
  description: "Routes each complaint type to the right sub-procedure.",
  topic: "Customer Support",
  status: "Published",
  author: AUTHOR,
  sourceArticleId: COMPLAINTS_ARTICLE_ID,
  nodes: [
    { clientKey: 1, type: "question" as const, text: "What kind of complaint is this?", order: 1, options: [
      { label: "Payment issue — money debited, no confirmation", targetClientKey: 2, targetTreeId: null },
      { label: "Quality case — wrong info/booking/modification from a previous call", targetClientKey: 3, targetTreeId: null },
      { label: "Any other complaint type (AirRewards, delay, staff behavior, etc.)", targetClientKey: 4, targetTreeId: null },
      { label: "Customer emailed contactus@ and got no reply", targetClientKey: 5, targetTreeId: null },
      { label: "Baggage claim — follow-up, refusal, or overdue (7+/21+ days)", targetClientKey: null, targetTreeId: BAGGAGE_TREE_ID },
    ] },
    { clientKey: 2, type: "outcome" as const, text: "Ask the passenger to check again after 2 hours. If still unresolved: advanced search for a generated PNR, raise a Sprinklr payment-issues request, extend the booking time limit 24h+.", image: "/uploads/1783879079290-complaint-quality-case.png", order: 2, options: [
      { label: "Check available payment methods/charges", targetClientKey: null, targetTreeId: 46 },
    ] },
    { clientKey: 3, type: "outcome" as const, text: "Raise a request under Complaints > Call Center Complaints, selecting the correct sub-type (wrong info, wrong booking, wrong modification, cancellation not done).", image: "/uploads/1783879079290-complaint-quality-case.png", order: 3, options: [] },
    { clientKey: 4, type: "outcome" as const, text: "Listen, empathize, acknowledge the inconvenience, then offer a solution, escalate to a supervisor, or raise a case under the matching complaint type in Sprinklr.", image: "/uploads/1783879079290-complaint-quality-case.png", order: 4, options: [] },
    { clientKey: 5, type: "outcome" as const, text: "contactus@airarabia.com and contactus@flyjinnah.com no longer accept new customer emails — new messages get an automated reply directing the customer to the Feedback/Complaint form on the website or app. Raise a Sprinklr case for them now if it is a genuine new complaint. Customers already in an ongoing email thread may continue that conversation as normal.", order: 5, options: [] },
  ],
};

const GLOSSARY_TERM = {
  term: "PIR",
  definition: "Property Irregularity Report — the report a passenger gets when filing a damaged, lost, or delayed baggage claim at the Baggage Claims desk; also lists Lost & Found's contact details for follow-ups.",
  category: "Case Management",
};

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD not set in .env");

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Logging in...");
  await page.goto(`${SITE_URL}/admin/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([page.waitForURL(`${SITE_URL}/admin`), page.click('button[type="submit"]')]);
  console.log("Logged in.");

  // 1. Baggage Claims article
  {
    const res = await page.request.put(`${SITE_URL}/api/articles/${BAGGAGE_ARTICLE_ID}`, {
      data: { ...BAGGAGE_ARTICLE, categoryId: CATEGORY_ID, folderId: null, author: AUTHOR, status: "Published" },
    });
    if (!res.ok()) throw new Error(`Failed to update article #${BAGGAGE_ARTICLE_ID}: ${res.status()} ${await res.text()}`);
    console.log(`Updated article #${BAGGAGE_ARTICLE_ID}: ${BAGGAGE_ARTICLE.title}`);
  }

  // 2. Handling Complaints article
  {
    const res = await page.request.put(`${SITE_URL}/api/articles/${COMPLAINTS_ARTICLE_ID}`, {
      data: { ...COMPLAINTS_ARTICLE, categoryId: CATEGORY_ID, folderId: null, author: AUTHOR, status: "Published" },
    });
    if (!res.ok()) throw new Error(`Failed to update article #${COMPLAINTS_ARTICLE_ID}: ${res.status()} ${await res.text()}`);
    console.log(`Updated article #${COMPLAINTS_ARTICLE_ID}: ${COMPLAINTS_ARTICLE.title}`);
  }

  // 3. Baggage Claim decision tree
  {
    const res = await page.request.put(`${SITE_URL}/api/decision-trees/${BAGGAGE_TREE_ID}`, {
      data: BAGGAGE_TREE,
    });
    if (!res.ok()) throw new Error(`Failed to update tree #${BAGGAGE_TREE_ID}: ${res.status()} ${await res.text()}`);
    console.log(`Updated decision tree #${BAGGAGE_TREE_ID}: ${BAGGAGE_TREE.title}`);
  }

  // 4. Handling a Complaint decision tree
  {
    const res = await page.request.put(`${SITE_URL}/api/decision-trees/${COMPLAINT_TREE_ID}`, {
      data: COMPLAINT_TREE,
    });
    if (!res.ok()) throw new Error(`Failed to update tree #${COMPLAINT_TREE_ID}: ${res.status()} ${await res.text()}`);
    console.log(`Updated decision tree #${COMPLAINT_TREE_ID}: ${COMPLAINT_TREE.title}`);
  }

  // 5. Glossary: add PIR term via the admin UI (no JSON API for this — AppSetting-backed).
  {
    await page.goto(`${SITE_URL}/admin/glossary`, { waitUntil: "networkidle" });
    await page.click('button:has-text("Add term")');
    const rows = page.locator("div.grid.gap-3");
    const lastRow = rows.last();
    await lastRow.locator('input[placeholder^="Term"]').fill(GLOSSARY_TERM.term);
    await lastRow.locator('input[placeholder="Definition"]').fill(GLOSSARY_TERM.definition);
    await lastRow.locator('input[placeholder^="Category"]').fill(GLOSSARY_TERM.category);
    await page.click('button:has-text("Save Changes")');
    await page.waitForSelector("text=Saved — live on the Champion Glossary page.", { timeout: 15000 });
    console.log("Added Glossary term: PIR");
  }

  await browser.close();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
