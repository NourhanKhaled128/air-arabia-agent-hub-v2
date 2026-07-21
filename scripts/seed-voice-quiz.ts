// Seeds the Voice Soft Skills quiz (QMF 2026 aligned), derived from the
// "Air Arabia - Voice Coaching (Soft Skills - QMF 2026 Aligned).pptx" deck —
// covers all 9 scored soft-skill categories plus 3 cross-category role-play
// scenarios pulled from the trainer notes. Created as Draft.
//
// Run with: npx tsx scripts/seed-voice-quiz.ts

import { prisma } from "../lib/prisma";

interface QuestionSeed {
  text: string;
  correct: string;
  wrong: [string, string, string];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const QUESTIONS: QuestionSeed[] = [
  // ---- Opening (5 pts) ----
  {
    text: "A call connects and the agent takes 4 seconds to speak first. What does this count as?",
    correct: "A FAIL — greetings after 3+ seconds miss the mark, even if the rest of the greeting is perfect.",
    wrong: [
      "Still a PASS, since anything under 5 seconds is acceptable.",
      "A CRITICAL automatic fail, since any delay is treated as rude.",
      "A PASS as long as the agent apologizes for the wait.",
    ],
  },
  {
    text: "An agent opens with: \"Hi, how can I help?\" — no company name, no self-introduction. What applies?",
    correct: "A FAIL — the opening is missing the company name and self-intro, even though it's fast and friendly.",
    wrong: [
      "A PASS, since the tone is warm and the offer to help is there.",
      "A CRITICAL automatic fail, since skipping the company name is treated as dismissive.",
      "A PASS, as long as the agent adds the company name later in the call.",
    ],
  },
  {
    text: "A caller says something irritating right at the start, and the agent responds with a curt, dismissive tone before anything else is said. What applies?",
    correct: "CRITICAL — automatic fail. A rude or dismissive opening tone toward the passenger is a critical failure, not just a FAIL.",
    wrong: [
      "A FAIL, the same weight as a slow or missing greeting.",
      "A PASS, since the caller was irritating first.",
      "A FAIL, but only if it happens more than once in the call.",
    ],
  },
  {
    text: "What's the \"Answering Machine Test\" used to check an opening?",
    correct: "If a robot could say it, it's wrong — the opening should never be flat, scripted-sounding, or missing warmth.",
    wrong: [
      "Whether the greeting can be understood if played back at high speed.",
      "Whether the greeting would work as a pre-recorded IVR message.",
      "Whether the caller would mistake the agent for a machine after the whole call.",
    ],
  },
  // ---- Personalization (4 pts) ----
  {
    text: "The system shows the passenger's name as \"Fatima.\" What should the agent do?",
    correct: "Use it naturally, without asking again — ideally 2-3 times across the call (hello, middle, goodbye).",
    wrong: [
      "Confirm the name with the passenger before using it, to be safe.",
      "Use it once at the very start only, to avoid sounding repetitive.",
      "Use it as often as possible throughout the call to sound personal.",
    ],
  },
  {
    text: "The passenger's name isn't visible in the system. What should the agent do?",
    correct: "Ask for it once, politely, then use it consistently — but watch for overusing it.",
    wrong: [
      "Never ask — proceed without using a name at all.",
      "Ask for it at the start and again to confirm before closing.",
      "Guess that a name will appear later in the call and wait.",
    ],
  },
  {
    text: "What is the \"Golden Rule of 3\" for personalization?",
    correct: "Use the passenger's name at hello, in the middle, and at goodbye — like a barista who remembers your order.",
    wrong: [
      "Use the name exactly 3 times in the first minute of the call.",
      "Ask the passenger to confirm their name 3 times for verification.",
      "Use the name once per topic discussed, however many that is.",
    ],
  },
  // ---- Tone & Professionalism (4 pts) ----
  {
    text: "An agent is warm and engaged for the first half of the call, then becomes flat and rushed once the passenger's issue seems resolved. What applies?",
    correct: "A FAIL — tone must stay warm and engaged throughout the WHOLE call, not just part of it.",
    wrong: [
      "A PASS, since most of the call was warm and engaged.",
      "A CRITICAL automatic fail, since the tone changed mid-call.",
      "A PASS, since tone only matters during the opening and closing.",
    ],
  },
  {
    text: "An agent sounds cold and disengaged but never says anything actually rude. What applies?",
    correct: "A FAIL — monotonous, cold, or disengaged tone fails this category even without rudeness.",
    wrong: [
      "A PASS, since nothing rude or disrespectful was said.",
      "A CRITICAL automatic fail — coldness is treated the same as rudeness.",
      "Not scored at all, since tone is subjective.",
    ],
  },
  {
    text: "An agent raises their voice and is dismissive toward a passenger mid-call. What applies?",
    correct: "CRITICAL — automatic fail. Rude, aggressive, dismissive, or disrespectful conduct is a critical failure.",
    wrong: [
      "A FAIL, the same weight as sounding rushed or careless.",
      "A PASS, if the passenger was being difficult first.",
      "A FAIL, unless it happens in the first 30 seconds of the call.",
    ],
  },
  {
    text: "Why do radio DJs \"record smiling\" on purpose, per the tone mnemonic?",
    correct: "Because listeners can hear a smile in your voice — so can a passenger on the phone.",
    wrong: [
      "Because it's a station policy unrelated to how the voice sounds.",
      "Because smiling makes the recording session go faster.",
      "Because it helps the DJ remember their script better.",
    ],
  },
  // ---- Active Listening (6 pts, highest-weighted) ----
  {
    text: "How many of the 40 Soft Skills points does Active Listening carry?",
    correct: "6 points — the single highest-weighted soft skill on the scorecard.",
    wrong: [
      "4 points, the same as most other categories.",
      "5 points, tied with Opening and Closure.",
      "10 points, since it's described as the most important skill.",
    ],
  },
  {
    text: "A passenger explains their issue, and the agent proceeds directly to a solution without asking any clarifying questions or confirming understanding first. What applies?",
    correct: "A FAIL — Active Listening requires confirming understanding and asking relevant probing questions, not just proceeding on assumptions.",
    wrong: [
      "A PASS, since the agent moved quickly to a solution.",
      "A CRITICAL automatic fail, since the passenger's issue was ignored entirely.",
      "A PASS, as long as the solution offered turns out to be correct.",
    ],
  },
  {
    text: "A passenger has to repeat the same information twice because the agent didn't retain it the first time. What does the \"One Story, One Time\" principle say about this?",
    correct: "This fails Active Listening — nobody should have to repeat themselves, the same way a doctor who already read your chart wouldn't ask again.",
    wrong: [
      "This is acceptable as long as the agent apologizes for asking again.",
      "This only fails if the passenger repeats themselves three or more times.",
      "This is a Personalization issue, not an Active Listening one.",
    ],
  },
  {
    text: "An agent interrupts a passenger mid-sentence to move the call along faster. What applies?",
    correct: "A FAIL — interrupting directly fails Active Listening, regardless of the reason.",
    wrong: [
      "A PASS, since it kept the call efficient.",
      "A CRITICAL automatic fail, since interrupting is treated as disrespectful.",
      "Not scored, since call efficiency is a separate metric.",
    ],
  },
  {
    text: "What counts as \"dead air\" risk in Active Listening, and how should it be handled?",
    correct: "Silence while the agent is working should be avoided or narrated — dead air on a call feels much longer than it does in person.",
    wrong: [
      "Dead air is only a problem if it lasts more than 30 seconds.",
      "Dead air doesn't affect Active Listening scoring at all.",
      "Dead air should be filled with hold music automatically, not narration.",
    ],
  },
  // ---- Empathy (4 pts) ----
  {
    text: "A passenger's flight is cancelled and they're upset. The agent immediately says \"I can rebook you on the 3pm flight\" without acknowledging how the passenger feels. What applies?",
    correct: "A FAIL — empathy must come before the solution; jumping straight to a fix is purely transactional.",
    wrong: [
      "A PASS, since offering a fast solution is the most helpful response.",
      "A CRITICAL automatic fail, since the passenger's frustration was ignored.",
      "A PASS, as long as the rebooking solves the actual problem.",
    ],
  },
  {
    text: "An agent says \"I understand your frustration\" in a flat, clearly scripted tone that doesn't match the passenger's situation. What applies?",
    correct: "A FAIL — a scripted or mismatched empathy line doesn't satisfy this category; it needs to be genuine and situation-specific.",
    wrong: [
      "A PASS, since the correct empathy phrase was technically said.",
      "A PASS, since any empathy statement is better than none.",
      "A CRITICAL automatic fail, since scripted language is treated as dismissive.",
    ],
  },
  {
    text: "What does \"Feel It Before You Fix It\" mean in practice?",
    correct: "If a friend's flight got cancelled, you'd say \"that's awful\" before offering solutions — empathy comes first, genuinely.",
    wrong: [
      "Fix the passenger's problem as fast as possible, then explain what you did.",
      "Only use empathy language for complaints, not general questions.",
      "Ask the passenger how they feel as a formal survey question.",
    ],
  },
  // ---- Acknowledgement (4 pts) ----
  {
    text: "A passenger says they want to move their flight to the 14th. The agent immediately starts asking for the booking reference without repeating back the request. What applies?",
    correct: "A FAIL — the request should be echoed back (\"So you'd like to move your flight to the 14th...\") before acting on it.",
    wrong: [
      "A PASS, since asking for the booking reference is a necessary next step.",
      "A CRITICAL automatic fail, since the passenger's request was ignored.",
      "A PASS, as long as the date change is processed correctly in the end.",
    ],
  },
  {
    text: "What does the \"Echo, Then Act\" principle compare Acknowledgement to?",
    correct: "A pilot's read-back to air traffic control — repeat what you heard before you respond.",
    wrong: [
      "A doctor's receptionist checking availability before confirming.",
      "A radio DJ smiling before speaking on air.",
      "A barista remembering a regular customer's order.",
    ],
  },
  {
    text: "A passenger mentions they already tried calling once about this issue, but the agent asks unrelated intake questions as if hearing about it for the first time. What applies?",
    correct: "A FAIL — ignoring key info already shared and jumping to unrelated questions both fail Acknowledgement.",
    wrong: [
      "A PASS, since intake questions are a standard part of every call.",
      "A FAIL, but only under Active Listening, not Acknowledgement.",
      "A CRITICAL automatic fail, since the passenger had called before.",
    ],
  },
  // ---- Customer Service Execution (4 pts) ----
  {
    text: "An agent needs to place a passenger on hold. What's the correct procedure?",
    correct: "Ask permission, give a reason for the hold, and thank the passenger after coming back.",
    wrong: [
      "Give a reason for the hold, then place them on hold immediately.",
      "Ask permission only — a reason isn't required if the hold is brief.",
      "Thank the passenger before the hold, and give the reason after returning.",
    ],
  },
  {
    text: "An agent says \"Give me your ID\" with no further context. What applies?",
    correct: "A FAIL — abrupt data collection like this fails Customer Service Execution, even if the information itself is needed.",
    wrong: [
      "A PASS, since collecting the required ID is the actual goal.",
      "A CRITICAL automatic fail, since it sounds like a command.",
      "A FAIL, but only if the passenger complains about the phrasing.",
    ],
  },
  {
    text: "An agent places a passenger on hold without asking permission or giving a reason, then never thanks them afterward. What applies?",
    correct: "A FAIL — an incorrect hold (missing permission, reason, or thank-you) fails Customer Service Execution.",
    wrong: [
      "A PASS, as long as the hold itself was short.",
      "A CRITICAL automatic fail, since permission wasn't asked.",
      "Not scored, since hold procedure is only a guideline, not a scored item.",
    ],
  },
  {
    text: "What does \"Ask, Explain, Thank\" compare the hold procedure to?",
    correct: "A doctor's receptionist who says \"let me just check\" instead of vanishing without a word.",
    wrong: [
      "A pilot's read-back procedure to air traffic control.",
      "A concierge who solves problems personally instead of transferring.",
      "A radio DJ who smiles before speaking.",
    ],
  },
  // ---- Proactivity & Ownership (4 pts) ----
  {
    text: "A passenger's issue needs to be transferred to another team. What must the agent do?",
    correct: "Transfer with full context, so the passenger doesn't have to repeat their whole story to the next agent.",
    wrong: [
      "Transfer as quickly as possible, since the next team will ask their own questions anyway.",
      "Avoid transferring at all, even if another team is genuinely better suited.",
      "Tell the passenger to call back on the correct line instead of transferring directly.",
    ],
  },
  {
    text: "An agent says \"That's not my department\" and ends the call without giving the passenger any next steps. What applies?",
    correct: "A FAIL — deflecting responsibility and leaving the passenger without next steps both fail Proactivity & Ownership.",
    wrong: [
      "A PASS, since the issue genuinely belongs to another department.",
      "A CRITICAL automatic fail, since it sounds dismissive.",
      "A FAIL, but only under Tone & Professionalism, not Ownership.",
    ],
  },
  {
    text: "What does \"Treat every interaction as an opportunity, not just a question to close\" emphasize?",
    correct: "Proactivity and ownership — driving toward genuine resolution rather than just closing the call quickly.",
    wrong: [
      "Using every call as a chance to upsell additional services.",
      "Treating repeat callers differently from first-time callers.",
      "Closing calls faster to improve average handling time.",
    ],
  },
  // ---- Closure Standards (5 pts, "your last impression") ----
  {
    text: "How many of the 40 points does Closure Standards carry, and what's it described as?",
    correct: "5 points — described as the passenger's last impression of the call.",
    wrong: [
      "4 points — the same weight as most other categories.",
      "6 points — tied with Active Listening as highest-weighted.",
      "5 points — but only relevant if the call included a complaint.",
    ],
  },
  {
    text: "An agent resolves the passenger's issue but ends the call immediately without asking if anything else is needed or thanking them. What applies?",
    correct: "A FAIL — ending abruptly and missing the thank-you both fail Closure Standards, even if the actual issue was resolved.",
    wrong: [
      "A PASS, since the core issue was successfully resolved.",
      "A CRITICAL automatic fail, since the passenger wasn't thanked.",
      "Not scored, since Closure only matters if the call included a complaint.",
    ],
  },
  {
    text: "What must a proper closing include, per Closure Standards?",
    correct: "Asking if further help is needed, thanking the customer including the company name, a proper closing statement, and mentioning the survey.",
    wrong: [
      "Just a thank-you — the other elements are optional if time is short.",
      "A summary of everything discussed during the call, word for word.",
      "An offer to transfer the passenger to a supervisor for feedback.",
    ],
  },
  {
    text: "What does \"End on a High Note\" compare a call's closing to?",
    correct: "The last scene of a movie — it's the part the passenger actually remembers.",
    wrong: [
      "The opening scene, since first impressions matter most.",
      "A trailer, since it should preview what happens on the next call.",
      "The credits, since it's the least-remembered part of the experience.",
    ],
  },
  // ---- Bonus cross-category role-play scenarios ----
  {
    text: "A passenger is upset about a 3-hour delay and a missed connection. What should the agent do FIRST, before offering any solution?",
    correct: "Acknowledge and show empathy for the situation first — solutioning before empathy fails that category even if the fix offered is correct.",
    wrong: [
      "Offer rebooking options immediately, since solving the problem fast is the priority.",
      "Apologize on behalf of the airline and then transfer to a supervisor.",
      "Ask for the booking reference before addressing anything the passenger said.",
    ],
  },
  {
    text: "A customer's bag arrived damaged and they're raising their voice. The agent stays calm, but responds in a flat, purely procedural tone with no acknowledgement of how upsetting this is. What applies?",
    correct: "Both Empathy (no genuine acknowledgement before process) and Tone & Professionalism (disengaged, cold delivery) fail here — staying calm isn't the same as being warm.",
    wrong: [
      "Only Tone & Professionalism fails — Empathy only applies to complaints about the airline directly, not baggage handlers.",
      "Nothing fails, since the agent didn't become rude or aggressive.",
      "Only a CRITICAL automatic fail applies, since the customer raised their voice.",
    ],
  },
  {
    text: "A customer insists they were charged incorrectly for extra baggage and wants it resolved on this call. The agent says \"I can look into that for you\" and transfers them to billing without further explanation. What applies?",
    correct: "A likely FAIL on Proactivity & Ownership — the agent should drive toward resolution and only transfer with full context, not use a transfer to end their own involvement.",
    wrong: [
      "A PASS, since billing disputes always belong to a specialized team.",
      "A CRITICAL automatic fail, since transferring is never allowed on a fare dispute.",
      "Not scored, since fare disputes fall outside the Soft Skills scorecard entirely.",
    ],
  },
];

async function main() {
  const title = "Voice Soft Skills Quiz — QMF 2026";
  const existing = await prisma.quiz.findFirst({ where: { title } });
  if (existing) {
    console.log(`Skip (already exists): ${title}`);
    await prisma.$disconnect();
    return;
  }

  const maxOrder = await prisma.quiz.aggregate({ _max: { order: true } });

  await prisma.quiz.create({
    data: {
      title,
      description:
        "Covers all 9 QMF 2026 Soft Skills categories (Opening, Personalization, Tone & Professionalism, Active Listening, Empathy, Acknowledgement, Customer Service Execution, Proactivity & Ownership, Closure Standards) plus 3 cross-category role-play scenarios, drawn from the Voice Coaching training deck.",
      timeLimitMinutes: 45,
      passingScore: 70,
      showAnswers: true,
      status: "Draft",
      order: (maxOrder._max.order ?? 0) + 1,
      questions: {
        create: QUESTIONS.map((q, qi) => {
          const choices = shuffle([
            { text: q.correct, isCorrect: true },
            { text: q.wrong[0], isCorrect: false },
            { text: q.wrong[1], isCorrect: false },
            { text: q.wrong[2], isCorrect: false },
          ]);
          return {
            text: q.text,
            order: qi,
            points: 1,
            choices: {
              create: choices.map((c, ci) => ({ text: c.text, isCorrect: c.isCorrect, order: ci })),
            },
          };
        }),
      },
    },
  });

  console.log(`Created quiz: ${title} (${QUESTIONS.length} questions, 45 min)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
