import type { DimensionKey } from "./dimensions";

export interface QuizOption {
  id: string;
  text: string;
  /** Signed contributions, roughly -2..+2 per dimension. */
  scores: Partial<Record<DimensionKey, number>>;
}

export interface QuizQuestion {
  id: string;
  /** Short situational framing shown above the question. */
  scene: string;
  prompt: string;
  options: QuizOption[];
}

/**
 * 20 scenario items. Every option contributes to several dimensions so that
 * no single answer can determine a result on its own.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    scene: "Friday, 6:41pm",
    prompt:
      "A group plan you were looking forward to gets cancelled an hour before. What actually happens in you?",
    options: [
      {
        id: "a",
        text: "Relief. You already have the evening rearranged in your head.",
        scores: { socialEnergy: -2, independence: 2, sensitivity: -1, boundaries: 1 },
      },
      {
        id: "b",
        text: "You start messaging other people to salvage something tonight.",
        scores: { socialEnergy: 2, impulsivity: 1, assertiveness: 1, openness: 1 },
      },
      {
        id: "c",
        text: "A quiet 'was it actually about me?' runs in the background.",
        scores: { rejectionSensitivity: 2, sensitivity: 2, regulation: -1, trust: -1 },
      },
      {
        id: "d",
        text: "Mild annoyance about the disruption, then you get on with the plan you had anyway.",
        scores: { conscientiousness: 2, regulation: 1, openness: -1, independence: 1 },
      },
    ],
  },
  {
    id: "q2",
    scene: "Group chat, 11 unread",
    prompt: "Someone makes a joke at your expense and everyone piles on. Your move?",
    options: [
      {
        id: "a",
        text: "You out-joke them. Fastest way to end it in your favour.",
        scores: { assertiveness: 2, socialEnergy: 1, conflictDirectness: 1, regulation: 1 },
      },
      {
        id: "b",
        text: "Laugh along, then reread it three times later.",
        scores: {
          rejectionSensitivity: 2,
          approvalSeeking: 2,
          sensitivity: 1,
          conflictDirectness: -1,
        },
      },
      {
        id: "c",
        text: "Say plainly that it landed wrong, even if it makes things briefly awkward.",
        scores: { conflictDirectness: 2, boundaries: 2, assertiveness: 1, approvalSeeking: -1 },
      },
      {
        id: "d",
        text: "Barely register it. It's a joke; you move on.",
        scores: { sensitivity: -2, rejectionSensitivity: -2, regulation: 2 },
      },
    ],
  },
  {
    id: "q3",
    scene: "Monday morning",
    prompt: "You're handed a project with no instructions and a real deadline. First hour?",
    options: [
      {
        id: "a",
        text: "Map the whole thing out before touching any of it.",
        scores: { conscientiousness: 2, impulsivity: -2, independence: 1 },
      },
      {
        id: "b",
        text: "Start doing something and let the shape emerge.",
        scores: { impulsivity: 2, openness: 2, conscientiousness: -1 },
      },
      {
        id: "c",
        text: "Find whoever has done this before and pull them into it.",
        scores: { socialEnergy: 1, independence: -2, trust: 1, empathy: 1 },
      },
      {
        id: "d",
        text: "Push back and get the brief clarified before anything starts.",
        scores: { assertiveness: 2, boundaries: 2, conscientiousness: 1, approvalSeeking: -1 },
      },
    ],
  },
  {
    id: "q4",
    scene: "A friend's kitchen table",
    prompt: "A friend is upset about something you think they've misread. You...",
    options: [
      {
        id: "a",
        text: "Stay with the feeling first. Accuracy can wait.",
        scores: { empathy: 2, sensitivity: 1, conflictDirectness: -1, approvalSeeking: 1 },
      },
      {
        id: "b",
        text: "Gently offer the other reading while they're still talking.",
        scores: { conflictDirectness: 1, assertiveness: 1, empathy: 1, regulation: 1 },
      },
      {
        id: "c",
        text: "Move to solutions — what do we actually do about it?",
        scores: { conscientiousness: 2, empathy: -1, assertiveness: 1, sensitivity: -1 },
      },
      {
        id: "d",
        text: "Agree with them for now to keep the evening intact.",
        scores: { approvalSeeking: 2, conflictDirectness: -2, boundaries: -2, empathy: 1 },
      },
    ],
  },
  {
    id: "q5",
    scene: "Sunday, 9:12pm",
    prompt: "Someone asks for a favour that would eat your only free day. Honestly?",
    options: [
      {
        id: "a",
        text: "You say yes, then quietly resent the day.",
        scores: { boundaries: -2, approvalSeeking: 2, empathy: 1, regulation: -1 },
      },
      {
        id: "b",
        text: "No, with no long explanation attached.",
        scores: { boundaries: 2, assertiveness: 2, approvalSeeking: -2 },
      },
      {
        id: "c",
        text: "Offer a smaller version of the help that actually fits.",
        scores: { boundaries: 1, empathy: 2, conscientiousness: 1, assertiveness: 1 },
      },
      {
        id: "d",
        text: "Go quiet and hope the question resolves itself.",
        scores: {
          conflictDirectness: -2,
          rejectionSensitivity: 1,
          boundaries: -1,
          assertiveness: -2,
        },
      },
    ],
  },
  {
    id: "q6",
    scene: "Two days of silence",
    prompt: "A close person has been unusually short with you. What are you doing about it?",
    options: [
      {
        id: "a",
        text: "Asking them directly what's going on.",
        scores: { conflictDirectness: 2, assertiveness: 2, trust: 1, rejectionSensitivity: -1 },
      },
      {
        id: "b",
        text: "Reviewing the last conversation for what you did.",
        scores: { rejectionSensitivity: 2, sensitivity: 2, approvalSeeking: 1, regulation: -1 },
      },
      {
        id: "c",
        text: "Giving them room. People have their own weather.",
        scores: { trust: 2, regulation: 2, independence: 1, sensitivity: -1 },
      },
      {
        id: "d",
        text: "Matching their energy until they come back around.",
        scores: { conflictDirectness: -1, trust: -2, regulation: -1, boundaries: 1 },
      },
    ],
  },
  {
    id: "q7",
    scene: "New job, week one",
    prompt: "A stranger tells you something surprisingly personal early on. Internally?",
    options: [
      {
        id: "a",
        text: "You match it. Depth fast is your favourite kind.",
        scores: { trust: 2, socialEnergy: 2, openness: 1, impulsivity: 1 },
      },
      {
        id: "b",
        text: "You listen warmly but share nothing back yet.",
        scores: { empathy: 2, boundaries: 1, trust: -1, independence: 1 },
      },
      {
        id: "c",
        text: "A small flag goes up about why they're sharing this.",
        scores: { trust: -2, sensitivity: 1, independence: 1, openness: -1 },
      },
      {
        id: "d",
        text: "You redirect to lighter ground and keep it pleasant.",
        scores: { approvalSeeking: 1, conflictDirectness: -1, socialEnergy: 1, boundaries: 1 },
      },
    ],
  },
  {
    id: "q8",
    scene: "Three weeks of pressure",
    prompt: "Sustained stress shows up in you first as...",
    options: [
      {
        id: "a",
        text: "Lists, systems, and control over the small things.",
        scores: { conscientiousness: 2, regulation: 1, openness: -1, independence: 1 },
      },
      {
        id: "b",
        text: "Withdrawing. Fewer messages, shorter answers.",
        scores: { socialEnergy: -2, independence: 2, conflictDirectness: -1, sensitivity: 1 },
      },
      {
        id: "c",
        text: "A shorter fuse than you'd like.",
        scores: { regulation: -2, conflictDirectness: 1, sensitivity: 1, impulsivity: 1 },
      },
      {
        id: "d",
        text: "Needing more contact with people than usual.",
        scores: { socialEnergy: 2, independence: -2, rejectionSensitivity: 1, empathy: 1 },
      },
    ],
  },
  {
    id: "q9",
    scene: "A decision worth real money",
    prompt: "How do you usually get to the answer?",
    options: [
      {
        id: "a",
        text: "Gut first, and it's usually right.",
        scores: { impulsivity: 2, independence: 2, conscientiousness: -1, openness: 1 },
      },
      {
        id: "b",
        text: "A spreadsheet, or something suspiciously like one.",
        scores: { conscientiousness: 2, impulsivity: -2, regulation: 1 },
      },
      {
        id: "c",
        text: "Talk it through with two or three people you trust.",
        scores: { trust: 2, independence: -2, empathy: 1, socialEnergy: 1 },
      },
      {
        id: "d",
        text: "Delay. Deciding while unsure feels worse than waiting.",
        scores: {
          impulsivity: -2,
          rejectionSensitivity: 1,
          assertiveness: -1,
          conscientiousness: 1,
        },
      },
    ],
  },
  {
    id: "q10",
    scene: "Mid-argument",
    prompt: "It's escalating and you can feel it. What do you do?",
    options: [
      {
        id: "a",
        text: "Stay in it until it's genuinely resolved.",
        scores: { conflictDirectness: 2, assertiveness: 2, regulation: 1 },
      },
      {
        id: "b",
        text: "Name that you need twenty minutes, then come back.",
        scores: { regulation: 2, boundaries: 2, conflictDirectness: 1, empathy: 1 },
      },
      {
        id: "c",
        text: "Concede something you don't actually agree with to end it.",
        scores: { approvalSeeking: 2, boundaries: -2, conflictDirectness: -2 },
      },
      {
        id: "d",
        text: "Go cold and stop giving them much back.",
        scores: { regulation: -2, trust: -1, conflictDirectness: -1, sensitivity: 1 },
      },
    ],
  },
  {
    id: "q11",
    scene: "A crowded room of strangers",
    prompt: "Forty minutes in, where are you?",
    options: [
      {
        id: "a",
        text: "Somewhere in the middle of it, three conversations deep.",
        scores: { socialEnergy: 2, assertiveness: 1, openness: 1, impulsivity: 1 },
      },
      {
        id: "b",
        text: "One long conversation in a corner with one person.",
        scores: { empathy: 2, socialEnergy: -1, sensitivity: 1, trust: 1 },
      },
      {
        id: "c",
        text: "Doing a job — drinks, introductions, keeping things moving.",
        scores: { conscientiousness: 2, approvalSeeking: 1, empathy: 1, socialEnergy: 1 },
      },
      {
        id: "d",
        text: "Calculating the earliest acceptable exit.",
        scores: { socialEnergy: -2, independence: 2, boundaries: 1, approvalSeeking: -1 },
      },
    ],
  },
  {
    id: "q12",
    scene: "Feedback you didn't ask for",
    prompt: "Someone criticises something you worked hard on. First 24 hours?",
    options: [
      {
        id: "a",
        text: "It stings, then you mine it for what's true.",
        scores: { regulation: 2, openness: 2, conscientiousness: 1, sensitivity: 1 },
      },
      {
        id: "b",
        text: "It replays. A lot.",
        scores: { rejectionSensitivity: 2, sensitivity: 2, regulation: -2, approvalSeeking: 1 },
      },
      {
        id: "c",
        text: "You defend the work on the spot.",
        scores: { assertiveness: 2, conflictDirectness: 2, openness: -1, approvalSeeking: -1 },
      },
      {
        id: "d",
        text: "You weigh the source and mostly move on.",
        scores: { independence: 2, regulation: 1, rejectionSensitivity: -2, trust: -1 },
      },
    ],
  },
  {
    id: "q13",
    scene: "Plans, again",
    prompt: "Your week is fully booked and someone offers something great for Wednesday.",
    options: [
      {
        id: "a",
        text: "In. You'll rearrange the rest.",
        scores: { impulsivity: 2, openness: 2, socialEnergy: 1, conscientiousness: -2 },
      },
      {
        id: "b",
        text: "No — you'd rather do the week you already committed to.",
        scores: { conscientiousness: 2, boundaries: 2, impulsivity: -2 },
      },
      {
        id: "c",
        text: "Yes, and then quietly dread how tight the week became.",
        scores: { approvalSeeking: 2, boundaries: -2, rejectionSensitivity: 1, regulation: -1 },
      },
      {
        id: "d",
        text: "Ask to move it to a week that actually has space.",
        scores: { assertiveness: 1, conscientiousness: 1, boundaries: 1, empathy: 1 },
      },
    ],
  },
  {
    id: "q14",
    scene: "Someone new says they'll handle it",
    prompt: "A person you barely know takes responsibility for something that matters to you.",
    options: [
      {
        id: "a",
        text: "Great. You let it go completely.",
        scores: { trust: 2, independence: -1, regulation: 1, conscientiousness: -1 },
      },
      {
        id: "b",
        text: "You check in once, lightly.",
        scores: { trust: 1, conscientiousness: 1, empathy: 1 },
      },
      {
        id: "c",
        text: "You keep a quiet backup plan running.",
        scores: { trust: -2, conscientiousness: 2, independence: 2 },
      },
      {
        id: "d",
        text: "You end up doing most of it yourself anyway.",
        scores: { independence: 2, trust: -2, boundaries: -1, conscientiousness: 1 },
      },
    ],
  },
  {
    id: "q15",
    scene: "A text you sent two hours ago",
    prompt: "No reply, and they've been online. What's the story you tell yourself?",
    options: [
      {
        id: "a",
        text: "They're busy. It genuinely doesn't register.",
        scores: { rejectionSensitivity: -2, trust: 2, regulation: 2 },
      },
      {
        id: "b",
        text: "You reread what you sent.",
        scores: { rejectionSensitivity: 2, sensitivity: 2, approvalSeeking: 1 },
      },
      {
        id: "c",
        text: "You send a follow-up to close the loop.",
        scores: {
          assertiveness: 1,
          impulsivity: 1,
          rejectionSensitivity: 1,
          conflictDirectness: 1,
        },
      },
      {
        id: "d",
        text: "You decide not to be the one who reaches out next.",
        scores: { boundaries: 1, trust: -2, conflictDirectness: -1, independence: 1 },
      },
    ],
  },
  {
    id: "q16",
    scene: "Praise, in public",
    prompt: "You're complimented in front of a group. What's the honest internal reaction?",
    options: [
      {
        id: "a",
        text: "It lands well and stays with you for days.",
        scores: { approvalSeeking: 2, sensitivity: 1, socialEnergy: 1 },
      },
      {
        id: "b",
        text: "You immediately redistribute it to other people.",
        scores: { empathy: 2, approvalSeeking: 1, assertiveness: -1 },
      },
      {
        id: "c",
        text: "Slight discomfort — you'd rather the attention move on.",
        scores: { socialEnergy: -2, independence: 1, sensitivity: 1, approvalSeeking: -1 },
      },
      {
        id: "d",
        text: "A simple thank you. You already knew the work was good.",
        scores: { assertiveness: 2, regulation: 2, approvalSeeking: -2, independence: 1 },
      },
    ],
  },
  {
    id: "q17",
    scene: "The plan collapses",
    prompt: "You're travelling and everything falls apart at once. Which version of you shows up?",
    options: [
      {
        id: "a",
        text: "Calm operator. You start solving in order.",
        scores: { regulation: 2, conscientiousness: 2, assertiveness: 1 },
      },
      {
        id: "b",
        text: "Delighted, honestly. This is the good part of a story.",
        scores: { openness: 2, impulsivity: 2, regulation: 1, socialEnergy: 1 },
      },
      {
        id: "c",
        text: "Tense and quiet until there's a fix in hand.",
        scores: { regulation: -1, sensitivity: 2, socialEnergy: -1, conscientiousness: 1 },
      },
      {
        id: "d",
        text: "You look for someone else who knows the system better.",
        scores: { independence: -2, trust: 2, socialEnergy: 1 },
      },
    ],
  },
  {
    id: "q18",
    scene: "A long relationship of any kind",
    prompt: "What most often causes friction on your side?",
    options: [
      {
        id: "a",
        text: "You need more space than the other person expects.",
        scores: { independence: 2, socialEnergy: -1, boundaries: 2, empathy: -1 },
      },
      {
        id: "b",
        text: "You need more reassurance than you like admitting.",
        scores: { rejectionSensitivity: 2, approvalSeeking: 2, independence: -2 },
      },
      {
        id: "c",
        text: "You say the blunt thing before you've softened it.",
        scores: { conflictDirectness: 2, assertiveness: 2, empathy: -1, sensitivity: -1 },
      },
      {
        id: "d",
        text: "You go along with things until it builds up.",
        scores: { boundaries: -2, conflictDirectness: -2, approvalSeeking: 2, regulation: -1 },
      },
    ],
  },
  {
    id: "q19",
    scene: "10:40pm, one more thing",
    prompt: "You've hit your limit but there's an hour of work left. What actually happens?",
    options: [
      {
        id: "a",
        text: "You finish it. Unfinished things don't let you sleep.",
        scores: { conscientiousness: 2, boundaries: -1, regulation: 1, approvalSeeking: 1 },
      },
      {
        id: "b",
        text: "You stop and pick it up fresh tomorrow.",
        scores: { boundaries: 2, regulation: 2, conscientiousness: -1 },
      },
      {
        id: "c",
        text: "You get distracted and neither finish nor rest.",
        scores: { impulsivity: 2, conscientiousness: -2, regulation: -1 },
      },
      {
        id: "d",
        text: "You hand part of it to someone else.",
        scores: { trust: 2, independence: -2, assertiveness: 1 },
      },
    ],
  },
  {
    id: "q20",
    scene: "Looking back on the year",
    prompt: "Which sentence sounds most like the year you just had?",
    options: [
      {
        id: "a",
        text: "I held a lot together for other people.",
        scores: { empathy: 2, boundaries: -1, conscientiousness: 1, approvalSeeking: 1 },
      },
      {
        id: "b",
        text: "I finally stopped explaining myself so much.",
        scores: { boundaries: 2, assertiveness: 2, approvalSeeking: -2, independence: 1 },
      },
      {
        id: "c",
        text: "I said yes to things that scared me.",
        scores: { openness: 2, impulsivity: 1, socialEnergy: 1, regulation: 1 },
      },
      {
        id: "d",
        text: "I kept a lot of it to myself.",
        scores: { independence: 2, socialEnergy: -2, trust: -1, sensitivity: 1 },
      },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
