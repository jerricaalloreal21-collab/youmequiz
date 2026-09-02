import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { listQuestionnaires, scoreQuestionnaireBySlug } from "../catalog";

export default defineTool({
  name: "score_questionnaire",
  title: "Score questionnaire answers",
  description:
    "Score a set of answers with YouMeQuiz's deterministic engine and return questionnaire scale scores plus the written pattern report. Not a psychological or medical assessment.",
  inputSchema: {
    slug: z.string().describe("Questionnaire slug from list_questionnaires."),
    answers: z
      .record(z.string(), z.string())
      .describe(
        "Map of question id to chosen option id, exactly as described by get_questionnaire's answerFormat.",
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug, answers }) => {
    const result = scoreQuestionnaireBySlug(slug, answers);
    if (!result) {
      throw new ToolError(
        `Unknown questionnaire '${slug}'. Available: ${listQuestionnaires().map((q) => q.slug).join(", ")}`,
      );
    }
    if (result.answered === 0) {
      throw new ToolError("No recognised answers were supplied. Call get_questionnaire first for valid ids.");
    }
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
