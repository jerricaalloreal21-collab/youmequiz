import { defineTool } from "@lovable.dev/mcp-js";
import { listDimensions } from "../catalog";

export default defineTool({
  name: "list_personality_dimensions",
  title: "List personality dimensions",
  description:
    "List the 14 non-clinical behaviour dimensions the Personality Patterns questionnaire scores, with a neutral description of each.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const items = listDimensions();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
