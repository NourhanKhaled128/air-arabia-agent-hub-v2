export interface ScenarioTemplate {
  chatEn: string;
  chatAr: string;
  emailSubjectEn: string;
  emailIssueEn: string;
  emailResolutionEn: string;
  emailSubjectAr: string;
  emailIssueAr: string;
  emailResolutionAr: string;
}

// Exactly 3 scenario templates per article.
export type ArticleTemplateSet = ScenarioTemplate[];

const CONTACT_URL = "https://www.airarabia.com/en/help/contact-us";

export function emailBodyEn(issue: string, resolution: string) {
  return `Dear [Customer Name],\n\n${issue}\n\n${resolution}\n\nShould you need further assistance, we're always here for you by phone, email or live chat: ${CONTACT_URL}.\n\nBest regards,\nAir Arabia Customer Support`;
}

export function emailBodyAr(issue: string, resolution: string) {
  return `عزيزي/عزيزتي [اسم العميل]،\n\n${issue}\n\n${resolution}\n\nلمزيد من المساعدة، يسعدنا تواصلكم معنا في أي وقت عبر الهاتف أو البريد الإلكتروني أو الدردشة المباشرة عبر الرابط: ${CONTACT_URL}\n\nمع خالص التحية،\nفريق دعم عملاء العربية للطيران`;
}
