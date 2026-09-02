import { defineTool } from "@lovable.dev/mcp-js";
import { listQuestionnaires } from "../catalog";

export default defineTool({
  name: "list_questionnaires",
  title: "List questionnaires",
  description:
    "List every YouMeQuiz self-reflection questionnaire with its slug, title, summary, question count, and web path.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = listQuestionnaires();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
