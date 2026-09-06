export interface Choice {
  text: string;
  category: string;
}
export interface Question {
  prompt: string;
  choices: Choice[];
}
export interface ResultCopy {
  title: string;
  summary: string;
  strengths: string[];
  watch: string;
  tip: string;
}
export interface Questionnaire {
  slug: string;
  emoji: string;
  title: string;
  short: string;
  intro: string;
  categories: Record<string, ResultCopy>;
  questions: Question[];
}

const choices = (items: Record<string, string>): Choice[] =>
  Object.entries(items).map(([category, text]) => ({ category, text }));
const q = (prompt: string, items: Record<string, string>): Question => ({
  prompt,
  choices: choices(items),
});

const loveCategories: Record<string, ResultCopy> = {
  words: {
    title: "Reassuring Words",
    summary: "Love lands most clearly when it is spoken, written, and made unmistakable.",
    strengths: [
      "You notice sincere praise and encouragement.",
      "You often give people the reassurance you hope to receive.",
    ],
    watch: "Silence can feel like disinterest even when care is being shown another way.",
    tip: "Tell close people which words feel genuine, and notice the care hidden in actions too.",
  },
  time: {
    title: "Undivided Time",
    summary:
      "Attention is your clearest proof of care. Presence matters more than a packed schedule.",
    strengths: [
      "You value depth and shared memories.",
      "You make people feel chosen when you are present.",
    ],
    watch: "Distraction or repeated rescheduling may feel more personal than intended.",
    tip: "Ask for a specific pocket of focused time instead of waiting for someone to guess.",
  },
  acts: {
    title: "Helpful Action",
    summary: "Care feels real when someone notices what needs doing and lightens the load.",
    strengths: [
      "You read effort as commitment.",
      "You tend to love people in practical, dependable ways.",
    ],
    watch: "You may overlook affection that is warm but not especially useful.",
    tip: "Name one concrete thing that would help, and let verbal appreciation count too.",
  },
  touch: {
    title: "Warm Affection",
    summary: "Safe physical closeness gives you a strong sense of connection and reassurance.",
    strengths: [
      "You communicate warmth without needing many words.",
      "You notice distance and closeness quickly.",
    ],
    watch: "Different comfort levels can feel like rejection when they are simply preferences.",
    tip: "Talk openly about consent, comfort, and the kinds of affection each person enjoys.",
  },
  gifts: {
    title: "Thoughtful Tokens",
    summary: "A meaningful object tells you someone remembered, noticed, and chose you.",
    strengths: [
      "You treasure symbolism and small details.",
      "Your gifts often show careful attention.",
    ],
    watch: "A forgotten occasion can sting even when the relationship itself is steady.",
    tip: "Explain that meaning matters more than price, and look for other signs of thoughtfulness.",
  },
};

const loveQuestions = [
  q("After a rough day, what would comfort you most?", {
    words: "A heartfelt message telling me I am appreciated",
    time: "Sitting together with no phones",
    acts: "Someone taking one task off my plate",
    touch: "A long, safe hug",
    gifts: "A small surprise chosen just for me",
  }),
  q("On an ordinary Tuesday, what feels most romantic?", {
    acts: "They quietly handle something I was dreading",
    words: "They tell me exactly what they admire about me",
    gifts: "They bring home my favorite little treat",
    time: "They make an evening just for us",
    touch: "They reach for my hand while we talk",
  }),
  q("What absence do you notice fastest?", {
    time: "We are together but never truly connecting",
    touch: "There is very little physical affection",
    words: "I rarely hear how they feel about me",
    acts: "I carry everything without help",
    gifts: "Special moments pass without any thoughtful gesture",
  }),
  q("Which apology would mean the most?", {
    words: "A sincere, specific apology",
    acts: "Changed behavior and help repairing the damage",
    time: "A calm conversation with full attention",
    touch: "Gentle closeness after we talk it through",
    gifts: "A meaningful peace offering that shows they remembered",
  }),
  q("You feel most remembered when someone…", {
    gifts: "Finds something that instantly made them think of me",
    words: "Sends an encouraging note out of nowhere",
    acts: "Anticipates a need before I ask",
    time: "Protects time in their schedule for me",
    touch: "Greets me with warmth and affection",
  }),
  q("At a celebration, which moment stays with you?", {
    words: "The toast that captures who I really am",
    time: "The uninterrupted time together afterward",
    gifts: "The personal gift with a story behind it",
    touch: "The hugs and closeness",
    acts: "Someone handling details so I can enjoy myself",
  }),
  q("When life gets busy, what keeps love feeling steady?", {
    time: "A dependable weekly check-in",
    acts: "Sharing the practical load",
    words: "Frequent reassurance",
    touch: "Small affectionate moments",
    gifts: "Little reminders that I was on their mind",
  }),
  q("Which everyday gesture feels biggest?", {
    touch: "A kiss on the forehead",
    acts: "My car filled up or lunch packed",
    words: "A genuine compliment",
    gifts: "My favorite snack appearing",
    time: "A slow coffee together",
  }),
  q("What makes you feel chosen?", {
    time: "They turn down distractions to be with me",
    words: "They say clearly that I matter",
    acts: "They show up when I need help",
    gifts: "They remember a tiny detail and act on it",
    touch: "They pull me close naturally",
  }),
  q("Long-distance connection would feel strongest through…", {
    words: "Thoughtful messages and voice notes",
    time: "Regular video dates",
    gifts: "Care packages",
    acts: "Helping solve things from afar",
    touch: "Planning the next visit and the closeness we will share",
  }),
  q("Which compliment feels most convincing?", {
    words: "One that is detailed and deeply sincere",
    acts: "Someone backing it up through effort",
    time: "Someone listening long enough to truly know me",
    touch: "Affection that matches the words",
    gifts: "A token tied to what they noticed about me",
  }),
  q("When you give love naturally, you tend to…", {
    acts: "Help, fix, organize, or lighten the load",
    gifts: "Find meaningful little surprises",
    time: "Make space and listen",
    words: "Encourage and praise",
    touch: "Offer warm physical affection",
  }),
  q("A perfect low-cost date is…", {
    time: "Hours talking or exploring together",
    acts: "Doing a project together that makes life better",
    words: "Trading meaningful letters or questions",
    touch: "A cozy movie night curled up together",
    gifts: "A thrift-store challenge to find each other something",
  }),
  q("What hurts most during conflict?", {
    words: "Cruel or dismissive language",
    time: "Being ignored or shut out",
    acts: "Promises without changed behavior",
    touch: "Cold physical distance",
    gifts: "A meaningful date or gesture being forgotten",
  }),
  q("What makes a reunion feel complete?", {
    touch: "A long embrace",
    words: "Hearing how much I was missed",
    time: "Getting uninterrupted time together",
    acts: "They make my return easier",
    gifts: "They saved or brought me something meaningful",
  }),
  q("Which memory would you keep forever?", {
    gifts: "The keepsake that marks the day",
    words: "The exact loving words someone said",
    time: "The hours we spent fully present",
    acts: "The way they showed up when it mattered",
    touch: "The feeling of being held and safe",
  }),
  q("You know someone understands you when…", {
    time: "They listen without rushing",
    words: "They put what I feel into the right words",
    acts: "They respond to what I actually need",
    gifts: "They choose something perfectly personal",
    touch: "Their affection feels safe and attuned",
  }),
  q("Which surprise would delight you most?", {
    acts: "A dreaded chore already finished",
    time: "A planned day together",
    words: "A letter about what I mean to them",
    gifts: "A thoughtful item with personal meaning",
    touch: "An affectionate welcome and cozy evening",
  }),
  q("When you doubt a relationship, what reassures you?", {
    words: "Clear verbal commitment",
    acts: "Consistent follow-through",
    time: "A real conversation and protected time",
    touch: "Warm, respectful closeness",
    gifts: "A symbolic reminder of us",
  }),
  q("If only one could happen this week, you would choose…", {
    time: "A full evening of undivided attention",
    words: "A deeply sincere message",
    acts: "Meaningful help with something heavy",
    touch: "Plenty of comfortable affection",
    gifts: "A small, perfectly chosen surprise",
  }),
];

const stressCategories: Record<string, ResultCopy> = {
  overload: {
    title: "The Overload Trigger",
    summary: "Your stress rises fastest when demands pile up faster than you can organize them.",
    strengths: [
      "You care about handling responsibilities well.",
      "You often spot practical pressure before others do.",
    ],
    watch: "You may keep pushing until your body forces a stop.",
    tip: "Reduce the field: choose the next two actions, delay one, and ask for help with one.",
  },
  uncertainty: {
    title: "The Uncertainty Trigger",
    summary: "Ambiguity, waiting, and not knowing where you stand activate your stress response.",
    strengths: ["You prepare carefully and notice risks.", "Clarity helps you move decisively."],
    watch: "Your mind may fill missing information with worst-case answers.",
    tip: "Separate what is known, unknown, and controllable before making a decision.",
  },
  conflict: {
    title: "The Conflict Trigger",
    summary: "Tension, criticism, or emotional disconnection puts your system on alert.",
    strengths: [
      "Relationships matter deeply to you.",
      "You notice changes in tone and harmony quickly.",
    ],
    watch: "Keeping peace may become more important than saying what is true.",
    tip: "Use one calm sentence: “I want to work this out, and I need us to slow down.”",
  },
  control: {
    title: "The Loss-of-Control Trigger",
    summary: "Stress spikes when plans change or other people control outcomes that affect you.",
    strengths: [
      "You are proactive and protective of important details.",
      "Structure helps you perform reliably.",
    ],
    watch: "Trying to control every variable can create more strain than the change itself.",
    tip: "Choose one anchor you control and one variable you will deliberately let move.",
  },
  pressure: {
    title: "The Performance Trigger",
    summary:
      "Being evaluated, compared, or expected to get it right activates your stress response.",
    strengths: [
      "You have meaningful standards.",
      "You often prepare thoroughly and care about quality.",
    ],
    watch: "A mistake can start feeling like a verdict on your worth.",
    tip: "Define a realistic “good enough” before you start, not after exhaustion sets in.",
  },
};
const stressQuestions = [
  ["Three urgent texts arrive while you are already behind.", "overload"],
  ["Someone says, “We need to talk,” but cannot talk until tonight.", "uncertainty"],
  ["A close person becomes cold and short with you.", "conflict"],
  ["A carefully made plan changes at the last minute.", "control"],
  ["You must perform a task while people watch.", "pressure"],
  ["Your to-do list grows faster than you can finish it.", "overload"],
  ["You are waiting on an answer that affects your future.", "uncertainty"],
  ["Two people around you are angry with each other.", "conflict"],
  ["Someone else makes a decision that changes your day.", "control"],
  ["You are compared publicly with someone doing better.", "pressure"],
  ["Noise, interruptions, and requests all hit at once.", "overload"],
  ["Instructions are vague but the consequences matter.", "uncertainty"],
  ["You receive criticism in a sharp tone.", "conflict"],
  ["Technology fails right before something important.", "control"],
  ["You make a visible mistake.", "pressure"],
  ["Several people need something from you at the same time.", "overload"],
  ["A message is read but unanswered for hours.", "uncertainty"],
  ["You know someone is upset but they deny it.", "conflict"],
  ["You must depend on an unreliable person.", "control"],
  ["You feel you must prove you deserve your place.", "pressure"],
].map(([prompt, category]: string[]) =>
  q(prompt as string, {
    [category as string]: "This would hit me hard",
    overload:
      category === "overload"
        ? "I would feel swamped"
        : "My first reaction would be mental overload",
    uncertainty:
      category === "uncertainty"
        ? "The unknown would consume me"
        : "I would mainly worry about what happens next",
    conflict:
      category === "conflict"
        ? "The tension would stay with me"
        : "I would focus most on people's reactions",
    control:
      category === "control"
        ? "Losing control would bother me"
        : "I would immediately try to regain control",
    pressure:
      category === "pressure" ? "I would feel judged" : "I would worry about doing it wrong",
  }),
);

const attachmentCategories: Record<string, ResultCopy> = {
  secure: {
    title: "Mostly Secure",
    summary:
      "You tend to balance closeness with independence and address relationship concerns directly.",
    strengths: [
      "You can receive care without losing yourself.",
      "You are generally willing to repair after conflict.",
    ],
    watch: "Security can still wobble with inconsistent or unsafe people.",
    tip: "Keep choosing clear communication, reciprocal effort, and relationships where repair is possible.",
  },
  anxious: {
    title: "Anxious-Leaning",
    summary: "Connection matters deeply, and uncertainty can quickly make you seek reassurance.",
    strengths: [
      "You are attentive and emotionally invested.",
      "You notice relationship shifts early.",
    ],
    watch: "Ambiguous signals may feel like proof that you are being left.",
    tip: "Pause before pursuing reassurance; name the fact, the story, and the direct question.",
  },
  avoidant: {
    title: "Avoidant-Leaning",
    summary:
      "You protect yourself through independence and may create distance when closeness feels demanding.",
    strengths: [
      "You are self-reliant and composed under pressure.",
      "You respect autonomy and personal space.",
    ],
    watch: "Pulling away can prevent the very understanding you need.",
    tip: "Share one honest feeling before retreating, and ask for space with a return time.",
  },
  fearful: {
    title: "Fearful-Avoidant Leaning",
    summary:
      "You may want deep closeness while also bracing for hurt, creating a push-pull pattern.",
    strengths: [
      "You read emotional risk carefully.",
      "You are capable of deep connection when safety is consistent.",
    ],
    watch: "Testing, withdrawing, or chasing can make relationships feel less predictable.",
    tip: "Move slowly, state needs plainly, and judge safety by consistent behavior over time.",
  },
};
const attachmentQuestions = [
  "A close person takes much longer than usual to reply.",
  "Someone you care about asks for more emotional closeness.",
  "After an argument, your strongest impulse is…",
  "A relationship begins to feel very serious.",
  "Someone needs space after a difficult conversation.",
  "You need support during a bad week.",
  "A partner or friend seems less affectionate.",
  "You realize you made a relationship mistake.",
  "Someone depends heavily on you emotionally.",
  "You meet a person who feels immediately important.",
  "A close person sets a boundary with you.",
  "You feel misunderstood by someone you love.",
  "Plans are cancelled without much explanation.",
  "Someone offers steady, uncomplicated affection.",
  "You are asked to name what you need.",
  "Conflict has gone unresolved for two days.",
  "A person you love is very independent.",
  "You notice yourself becoming attached.",
  "Someone apologizes and wants to repair.",
  "At your healthiest, closeness feels like…",
].map((prompt) =>
  q(prompt, {
    secure: "Talk openly and assume good faith",
    anxious: "Seek reassurance and worry about the bond",
    avoidant: "Pull back and handle my feelings alone",
    fearful: "Want closeness, then feel unsafe and retreat",
  }),
);

const boundaryCategories: Record<string, ResultCopy> = {
  steady: {
    title: "Steady Boundaries",
    summary: "You can usually protect your limits while staying connected and respectful.",
    strengths: [
      "Your yes and no both carry meaning.",
      "You can negotiate without abandoning yourself.",
    ],
    watch: "Even strong boundaries need flexibility and explanation.",
    tip: "Keep limits clear, kind, consistent, and open to genuine discussion.",
  },
  porous: {
    title: "Porous Boundaries",
    summary:
      "You may absorb other people's needs, feelings, or responsibilities before checking your own capacity.",
    strengths: [
      "You are generous and responsive.",
      "People often experience you as caring and available.",
    ],
    watch: "Resentment and exhaustion can become the hidden price of being helpful.",
    tip: "Replace instant yes with: “Let me check what I can realistically do.”",
  },
  rigid: {
    title: "Protective Boundaries",
    summary:
      "You guard your time and emotions firmly, sometimes by limiting access before trust can grow.",
    strengths: [
      "You are self-protective and hard to pressure.",
      "You take privacy and autonomy seriously.",
    ],
    watch: "Protection can become isolation or make reasonable needs feel intrusive.",
    tip: "Experiment with a smaller yes instead of only a full yes or full no.",
  },
  inconsistent: {
    title: "Situational Boundaries",
    summary: "Your limits may change with the person, your mood, or how much conflict you expect.",
    strengths: [
      "You are adaptable and responsive to context.",
      "You can be flexible when circumstances genuinely differ.",
    ],
    watch: "People may not know where the line is—and sometimes neither do you.",
    tip: "Write down three limits that stay true even when someone is disappointed.",
  },
};
const boundaryQuestions = [
  "A friend asks for help on your only free day.",
  "Someone keeps joking about something you asked them to stop.",
  "A relative asks a very personal question.",
  "Your boss contacts you repeatedly outside work hours.",
  "Someone is upset because you said no.",
  "A friend vents for an hour when you are exhausted.",
  "A person borrows things and returns them late.",
  "You are pressured to explain a private decision.",
  "Someone arrives unannounced.",
  "A loved one expects an immediate reply to every message.",
  "You disagree with the group's plan.",
  "Someone asks you to keep a secret that feels wrong.",
  "A favor becomes much bigger than originally described.",
  "A close person reads your messages without permission.",
  "Someone blames you for their emotional reaction.",
  "You need to change a commitment you previously made.",
  "A person repeatedly interrupts you.",
  "You notice resentment after saying yes.",
  "Someone says your limit is selfish.",
  "A relationship improves when you stop over-giving.",
].map((prompt) =>
  q(prompt, {
    steady: "State my limit clearly and offer what I can",
    porous: "Give in, then feel drained or resentful",
    rigid: "Shut the request down and create distance",
    inconsistent: "My response depends heavily on who is asking",
  }),
);

const matchCategories: Record<string, ResultCopy> = {
  anchor: {
    title: "Your Best Fit: The Steady Anchor",
    summary:
      "You are likely to thrive with someone consistent, calm, dependable, and emotionally safe.",
    strengths: [
      "This match brings stability without unnecessary drama.",
      "Reliability gives trust room to deepen.",
    ],
    watch: "Steady should not become emotionally unavailable or overly routine.",
    tip: "Look for consistency between words and actions, especially during stress.",
  },
  spark: {
    title: "Your Best Fit: The Playful Spark",
    summary:
      "You pair well with someone lively, affectionate, curious, and able to bring fresh energy.",
    strengths: [
      "This match keeps connection expressive and fun.",
      "Novelty can pull both people out of stale patterns.",
    ],
    watch: "Excitement without follow-through will eventually feel unstable.",
    tip: "Choose playful people who are also dependable when life stops being fun.",
  },
  nurturer: {
    title: "Your Best Fit: The Warm Nurturer",
    summary:
      "You flourish with someone emotionally attentive, reassuring, patient, and openly caring.",
    strengths: [
      "This match makes feelings easier to name.",
      "Warmth supports repair and vulnerability.",
    ],
    watch: "Care should remain reciprocal rather than turning into rescuing.",
    tip: "Look for kindness paired with boundaries and emotional responsibility.",
  },
  challenger: {
    title: "Your Best Fit: The Growth Partner",
    summary:
      "You are energized by someone honest, motivated, direct, and willing to challenge you constructively.",
    strengths: [
      "This match creates momentum and mutual growth.",
      "Directness reduces guessing games.",
    ],
    watch: "Challenge without tenderness can feel like constant evaluation.",
    tip: "Choose someone who pushes with respect and celebrates progress too.",
  },
  freeSpirit: {
    title: "Your Best Fit: The Independent Explorer",
    summary:
      "You fit well with someone open-minded, self-directed, adaptable, and respectful of freedom.",
    strengths: [
      "This match gives both people room to breathe.",
      "Difference and discovery stay welcome.",
    ],
    watch: "Freedom should not become avoidance of commitment or repair.",
    tip: "Agree clearly on commitment while protecting healthy independence.",
  },
};
const matchQuestions = [
  "Your ideal weekend together includes…",
  "When you are overwhelmed, you most need someone who…",
  "The trait you admire fastest is…",
  "During conflict, the best partner response is…",
  "A relationship feels alive when…",
  "Your biggest relationship frustration is…",
  "You feel safest with someone who…",
  "A person becomes more attractive when they…",
  "The best kind of support is…",
  "You want everyday life to feel…",
  "When plans fall apart, you value someone who…",
  "Your best conversations are…",
  "You need a close person to respect…",
  "A relationship should help you…",
  "When you doubt yourself, you want someone to…",
  "The energy you naturally gravitate toward is…",
  "A long-term bond needs plenty of…",
  "You would rather date or befriend someone who…",
  "The kindest challenge from a partner is…",
  "At the end of the day, compatibility means…",
].map((prompt) =>
  q(prompt, {
    anchor: "Brings steadiness, loyalty, and calm",
    spark: "Adds humor, affection, and fresh energy",
    nurturer: "Listens closely and responds with warmth",
    challenger: "Tells the truth and helps me grow",
    freeSpirit: "Respects freedom and stays open to adventure",
  }),
);

export const QUESTIONNAIRES: Questionnaire[] = [
  {
    slug: "love-language",
    emoji: "💗",
    title: "How Do You Feel Most Loved?",
    short: "Discover the signals of care that land most deeply for you.",
    intro: "Choose the response that would genuinely mean the most—not the one that sounds nicest.",
    categories: loveCategories,
    questions: loveQuestions,
  },
  {
    slug: "stress-triggers",
    emoji: "🌩️",
    title: "What Triggers Your Stress Response?",
    short: "Map the pressure point that activates you fastest.",
    intro:
      "Imagine each situation happening on an already ordinary day, then choose your strongest reaction.",
    categories: stressCategories,
    questions: stressQuestions,
  },
  {
    slug: "attachment-style",
    emoji: "🧷",
    title: "What's Your Attachment Style?",
    short: "See how you move toward and away from closeness.",
    intro:
      "Answer from your real relationship habits, especially when you feel uncertain—not only from your best days.",
    categories: attachmentCategories,
    questions: attachmentQuestions,
  },
  {
    slug: "boundaries",
    emoji: "🚧",
    title: "How Strong Are Your Boundaries?",
    short: "Find where you hold the line and where it gets harder.",
    intro: "Choose what you usually do before you have time to prepare the perfect response.",
    categories: boundaryCategories,
    questions: boundaryQuestions,
  },
  {
    slug: "compatible-personality",
    emoji: "🧭",
    title: "Which Personality Type Fits You Best?",
    short: "Discover the kind of person who naturally balances you.",
    intro: "Think beyond chemistry. Choose what helps you feel both alive and secure over time.",
    categories: matchCategories,
    questions: matchQuestions,
  },
];

export const questionnaireBySlug = (slug: string) => QUESTIONNAIRES.find((x) => x.slug === slug);

export function scoreQuestionnaire(questionnaire: Questionnaire, answers: Record<number, string>) {
  const totals: Record<string, number> = Object.fromEntries(
    Object.keys(questionnaire.categories).map((k) => [k, 0]),
  );
  Object.values(answers).forEach((k) => {
    if (k in totals) totals[k] = (totals[k] ?? 0) + 1;
  });
  const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const fallback: ResultCopy = {
    title: "Mixed pattern",
    summary: "Your answers spread fairly evenly across the patterns in this questionnaire.",
    strengths: ["You adapt to what a situation asks of you."],
    watch: "A blended pattern can make it harder to name what you need.",
    tip: "Notice which pattern shows up most in the relationships that matter most.",
  };
  const pick = (i: number) => {
    const entry = ranked[i];
    if (!entry) return { key: "mixed", score: 0, ...fallback };
    const copy = questionnaire.categories[entry[0]] ?? fallback;
    return { key: entry[0], score: entry[1], ...copy };
  };
  return { primary: pick(0), secondary: pick(1), totals };
}
