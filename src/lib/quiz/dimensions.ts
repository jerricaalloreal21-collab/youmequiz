export type DimensionKey =
  | "empathy"
  | "sensitivity"
  | "socialEnergy"
  | "independence"
  | "assertiveness"
  | "trust"
  | "conscientiousness"
  | "openness"
  | "impulsivity"
  | "regulation"
  | "rejectionSensitivity"
  | "conflictDirectness"
  | "boundaries"
  | "approvalSeeking";

export interface DimensionMeta {
  key: DimensionKey;
  label: string;
  /** Short, neutral description of what the scale reflects. */
  blurb: string;
  /** Narrative fragments used to build the report. */
  high: string;
  mid: string;
  low: string;
  /** Words used when composing a pattern title. */
  adjective: string;
  noun: string;
  strength: string;
  blindSpot: string;
  growth: string;
}

export const DIMENSIONS: Record<DimensionKey, DimensionMeta> = {
  empathy: {
    key: "empathy",
    label: "Empathy",
    blurb: "How much you orient to other people's inner experience.",
    high: "you read the room through other people's feelings first, often before your own",
    mid: "you notice how others feel but weigh it against your own read of the situation",
    low: "you tend to lead with facts and outcomes rather than emotional undercurrents",
    adjective: "Attuned",
    noun: "Empath",
    strength: "People tend to feel understood around you without having to explain much.",
    blindSpot: "Carrying other people's feelings can quietly become your default job.",
    growth: "Try naming what you feel before you name what everyone else feels.",
  },
  sensitivity: {
    key: "sensitivity",
    label: "Emotional sensitivity",
    blurb: "How strongly small emotional signals register for you.",
    high: "small shifts in tone or mood land loudly for you",
    mid: "you register emotional signals without them dominating your day",
    low: "you tend to stay fairly unbothered by small emotional turbulence",
    adjective: "Perceptive",
    noun: "Sensor",
    strength: "You pick up details and undercurrents most people walk straight past.",
    blindSpot: "Minor signals can get interpreted as bigger than they were meant to be.",
    growth: "When something stings, try checking the evidence before the interpretation.",
  },
  socialEnergy: {
    key: "socialEnergy",
    label: "Social energy",
    blurb: "Where your energy comes from: people or quiet.",
    high: "being around people tops your energy back up",
    mid: "you move between social time and solo time without much friction",
    low: "solo time is how you recharge, and crowds spend that battery quickly",
    adjective: "Outward",
    noun: "Connector",
    strength: "You can create momentum in a group and keep energy moving.",
    blindSpot: "Constant input can crowd out the quiet where your own thinking happens.",
    growth: "Protect one low-stimulation block a week and treat it as non-negotiable.",
  },
  independence: {
    key: "independence",
    label: "Independence",
    blurb: "How much you rely on yourself versus lean on others.",
    high: "your first instinct is to handle things yourself",
    mid: "you ask for help when it is clearly useful, and self-manage otherwise",
    low: "you naturally reach for other people when working something out",
    adjective: "Self-reliant",
    noun: "Independent",
    strength: "You're steady on your own and rarely stuck waiting for permission.",
    blindSpot: "Self-sufficiency can turn into refusing support you'd genuinely benefit from.",
    growth: "Practise asking for help once before you actually need it.",
  },
  assertiveness: {
    key: "assertiveness",
    label: "Assertiveness",
    blurb: "How readily you state what you want out loud.",
    high: "you say what you want plainly and early",
    mid: "you speak up when it matters and let smaller things pass",
    low: "you often wait to see what others want before naming your own preference",
    adjective: "Direct",
    noun: "Advocate",
    strength: "People rarely have to guess where you stand.",
    blindSpot: "Clarity delivered fast can read as pressure to quieter people.",
    growth: "Ask one genuine question before making your case.",
  },
  trust: {
    key: "trust",
    label: "Trust",
    blurb: "Your default assumption about other people's intentions.",
    high: "you start from good faith and adjust only if given a reason",
    mid: "you extend trust in measured steps",
    low: "you tend to wait for consistency before you extend much trust",
    adjective: "Open-handed",
    noun: "Believer",
    strength: "You give relationships room to grow instead of testing them constantly.",
    blindSpot: "Good faith extended too early can cost you more than it should.",
    growth: "Let trust track behaviour over time rather than first impressions.",
  },
  conscientiousness: {
    key: "conscientiousness",
    label: "Conscientiousness",
    blurb: "How much structure and follow-through you bring.",
    high: "you plan, prepare, and close loops",
    mid: "you keep the important things organised and let the rest be loose",
    low: "you work best improvising rather than following a plan",
    adjective: "Deliberate",
    noun: "Planner",
    strength: "Things you take on tend to actually get finished.",
    blindSpot: "High standards can make rest feel like something you have to earn.",
    growth: "Pick one area where 'good enough' is genuinely good enough.",
  },
  openness: {
    key: "openness",
    label: "Openness & adaptability",
    blurb: "How you respond to novelty and change.",
    high: "new and unfamiliar things read as interesting rather than threatening",
    mid: "you're open to change when there's a reason for it",
    low: "you prefer known quantities and tested routines",
    adjective: "Curious",
    noun: "Explorer",
    strength: "Plans changing doesn't derail you; you re-route quickly.",
    blindSpot: "Novelty can pull attention away from things that only pay off with repetition.",
    growth: "Finish one thing that has stopped being new before starting the next.",
  },
  impulsivity: {
    key: "impulsivity",
    label: "Spontaneity",
    blurb: "How quickly you move from impulse to action.",
    high: "you act on the first strong instinct and sort details later",
    mid: "you move fairly quickly but usually pause on bigger calls",
    low: "you sit with a decision before you commit to it",
    adjective: "Spontaneous",
    noun: "Instinctive",
    strength: "You start things other people are still thinking about.",
    blindSpot: "Fast yeses can create commitments your future week didn't agree to.",
    growth: "Give big decisions one night before you answer.",
  },
  regulation: {
    key: "regulation",
    label: "Emotional regulation",
    blurb: "How steady you stay when feelings run high.",
    high: "you can feel something strongly and still choose your response",
    mid: "you mostly stay level, with occasional spillover under pressure",
    low: "strong feelings tend to arrive faster than your response to them",
    adjective: "Grounded",
    noun: "Anchor",
    strength: "You're the person who stays usable when things get tense.",
    blindSpot: "Composure can look like distance, or hide that you needed support too.",
    growth: "Say the feeling out loud early, while it's still small.",
  },
  rejectionSensitivity: {
    key: "rejectionSensitivity",
    label: "Rejection sensitivity",
    blurb: "How much ambiguous social signals worry you.",
    high: "silence or a short reply can pull your attention for a while",
    mid: "you notice ambiguous signals but usually let them settle",
    low: "you rarely read much into a delayed reply",
    adjective: "Watchful",
    noun: "Reader",
    strength: "You care about your relationships and notice when something changes.",
    blindSpot: "Ambiguity can get filled in with the least generous explanation.",
    growth: "When you notice a story forming, ask a plain question instead.",
  },
  conflictDirectness: {
    key: "conflictDirectness",
    label: "Conflict response",
    blurb: "Whether you move toward or away from friction.",
    high: "you'd rather have the hard conversation now",
    mid: "you address friction, but you pick the moment",
    low: "you tend to give things time and space rather than confront them",
    adjective: "Unflinching",
    noun: "Straight-talker",
    strength: "Problems around you get named before they calcify.",
    blindSpot: "Wanting resolution now can override someone else's need to process first.",
    growth: "Agree on a time to talk rather than needing it resolved immediately.",
  },
  boundaries: {
    key: "boundaries",
    label: "Boundaries",
    blurb: "How comfortably you hold your own limits.",
    high: "you can say no without a long justification",
    mid: "you hold most limits, and stretch them for people who matter",
    low: "saying no tends to cost you more than saying yes",
    adjective: "Steady",
    noun: "Boundary-keeper",
    strength: "Your yes means something because your no is available.",
    blindSpot: "Firm limits can be experienced as a closed door if unexplained.",
    growth: "Pair a no with what you can offer instead.",
  },
  approvalSeeking: {
    key: "approvalSeeking",
    label: "Approval orientation",
    blurb: "How much external validation shapes your choices.",
    high: "other people's approval carries real weight in your decisions",
    mid: "you like being well thought of without organising your life around it",
    low: "you're fairly indifferent to whether a choice reads well to others",
    adjective: "Considerate",
    noun: "Harmoniser",
    strength: "You're genuinely easy to be around and you make people feel wanted.",
    blindSpot: "Choices can drift toward what keeps the peace rather than what you want.",
    growth: "Make one small decision this week purely on your own preference.",
  },
};

export const DIMENSION_ORDER: DimensionKey[] = Object.keys(DIMENSIONS) as DimensionKey[];
