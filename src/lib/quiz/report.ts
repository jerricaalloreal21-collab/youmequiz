import { DIMENSIONS, type DimensionKey } from "./dimensions";
import { mostDistinctive, sortedByStrength, type DimensionScore, type ScoreMap } from "./score";

const LOW_WORDS: Record<DimensionKey, { adjective: string; noun: string }> = {
  empathy: { adjective: "Level-headed", noun: "Analyst" },
  sensitivity: { adjective: "Unrattled", noun: "Steadier" },
  socialEnergy: { adjective: "Quiet", noun: "Observer" },
  independence: { adjective: "Collaborative", noun: "Teammate" },
  assertiveness: { adjective: "Understated", noun: "Diplomat" },
  trust: { adjective: "Discerning", noun: "Gatekeeper" },
  conscientiousness: { adjective: "Freeform", noun: "Improviser" },
  openness: { adjective: "Rooted", noun: "Traditionalist" },
  impulsivity: { adjective: "Measured", noun: "Deliberator" },
  regulation: { adjective: "Openly Feeling", noun: "Live Wire" },
  rejectionSensitivity: { adjective: "Unshaken", noun: "Self-Referencer" },
  conflictDirectness: { adjective: "Peace-Seeking", noun: "Smoother" },
  boundaries: { adjective: "Accommodating", noun: "Giver" },
  approvalSeeking: { adjective: "Self-Directed", noun: "Independent" },
};

function wordsFor(d: DimensionScore) {
  const meta = DIMENSIONS[d.key];
  return d.value >= 50 ? { adjective: meta.adjective, noun: meta.noun } : LOW_WORDS[d.key];
}

function phrase(d: DimensionScore) {
  const meta = DIMENSIONS[d.key];
  return d.band === "high" ? meta.high : d.band === "low" ? meta.low : meta.mid;
}

export interface PatternReport {
  title: string;
  subtitle: string;
  coreTraits: { label: string; text: string }[];
  strengths: string[];
  blindSpots: string[];
  emotionalPattern: string;
  communicationStyle: string;
  conflictResponse: string;
  underStress: string;
  relationshipTendencies: string;
  decisionMaking: string;
  worthNoticing: string[];
  growth: string[];
  topScores: DimensionScore[];
}

export function buildReport(scores: ScoreMap): PatternReport {
  const distinctive = mostDistinctive(scores);
  const ranked = sortedByStrength(scores);
  const [first, second, third] = distinctive as [DimensionScore, DimensionScore, DimensionScore];

  const a = wordsFor(first);
  const b = wordsFor(second);
  const title = `The ${a.adjective} ${b.noun}`;

  const coreTraits = distinctive.slice(0, 4).map((d) => ({
    label: d.label,
    text: `Across the questionnaire, ${phrase(d)}.`,
  }));

  const strengths = distinctive
    .filter((d) => d.band !== "mid")
    .slice(0, 4)
    .map((d) =>
      d.band === "high"
        ? DIMENSIONS[d.key].strength
        : `Your answers suggest a lower-key take on ${DIMENSIONS[d.key].label.toLowerCase()}, which can make you harder to knock off course.`,
    );

  const blindSpots = distinctive
    .filter((d) => d.band === "high")
    .slice(0, 3)
    .map((d) => DIMENSIONS[d.key].blindSpot);
  if (blindSpots.length < 2) {
    blindSpots.push(
      "Your responses sit near the middle on several scales, which can mean flexibility — or that you adapt to whoever you're with more than you notice.",
    );
  }

  const sens = scores.sensitivity;
  const reg = scores.regulation;
  const rej = scores.rejectionSensitivity;
  const emotionalPattern = `Your answers suggest ${phrase(sens)}, and that ${phrase(reg)}. When social signals are ambiguous, ${phrase(rej)}.`;

  const assert = scores.assertiveness;
  const emp = scores.empathy;
  const appr = scores.approvalSeeking;
  const communicationStyle = `In conversation you may tend to lead in a way where ${phrase(assert)}. Alongside that, ${phrase(emp)}, and ${phrase(appr)}.`;

  const conf = scores.conflictDirectness;
  const bound = scores.boundaries;
  const conflictResponse = `When friction shows up, your responses point to a pattern where ${phrase(conf)}. On limits, ${phrase(bound)}.`;

  const socialEnergy = scores.socialEnergy;
  const indep = scores.independence;
  const underStress = `Under sustained pressure, your answers suggest ${phrase(reg)} and that ${phrase(socialEnergy)}. Your instinct is one where ${phrase(indep)} — that's worth watching when the load gets heavy.`;

  const trust = scores.trust;
  const relationshipTendencies = `In close relationships of any kind, your pattern is one where ${phrase(trust)}, ${phrase(emp)}, and ${phrase(bound)}. You may tend to need ${indep.value >= 55 ? "more room than people expect" : indep.value <= 45 ? "more closeness and contact than you usually say out loud" : "a fairly even mix of closeness and space"}.`;

  const imp = scores.impulsivity;
  const consc = scores.conscientiousness;
  const open = scores.openness;
  const decisionMaking = `On decisions, your answers suggest ${phrase(imp)}, and that ${phrase(consc)}. Facing something unfamiliar, ${phrase(open)}.`;

  const worthNoticing = distinctive.slice(0, 3).map((d) => {
    const meta = DIMENSIONS[d.key];
    return d.band === "high"
      ? `${meta.label} came through strongly across several unrelated scenarios — not just one answer.`
      : d.band === "low"
        ? `${meta.label} sat consistently low here, which shapes more of the picture than it might feel like day to day.`
        : `${meta.label} landed mid-range, so it may shift depending on who you're with.`;
  });
  worthNoticing.push(
    `Your three most defining scales in this questionnaire were ${first.label.toLowerCase()}, ${second.label.toLowerCase()} and ${third.label.toLowerCase()}.`,
  );

  const growth = distinctive
    .filter((d) => d.band !== "mid")
    .slice(0, 4)
    .map((d) => DIMENSIONS[d.key].growth);

  return {
    title,
    subtitle: `A pattern built from all 20 of your answers — strongest across ${first.label.toLowerCase()} and ${second.label.toLowerCase()}.`,
    coreTraits,
    strengths,
    blindSpots,
    emotionalPattern,
    communicationStyle,
    conflictResponse,
    underStress,
    relationshipTendencies,
    decisionMaking,
    worthNoticing,
    growth,
    topScores: ranked,
  };
}

export const DISCLAIMER =
  "YouMeQuiz is a self-reflection tool for entertainment. It describes patterns in the answers you gave in this questionnaire — it is not a psychological assessment, diagnosis, or medical advice.";
