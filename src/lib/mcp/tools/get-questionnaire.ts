import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getQuestions, listQuestionnaires } from "../catalog";

export default defineTool({
  name: "get_questionnaire",
  title: "Get questionnaire questions",
  description:
    "Fetch all questions and answer options for one questionnaire, plus the answer format expected by score_questionnaire.",
  inputSchema: {
    slug: z.string().describe("Questionnaire slug from list_questionnaires, e.g. 'personality-patterns'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const data = getQuestions(slug);
    if (!data) {
      throw new ToolError(
        `Unknown questionnaire '${slug}'. Available: ${listQuestionnaires().map((q) => q.slug).join(", ")}`,
      );
    }
    return {
      content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
