import { defineMcp } from "@lovable.dev/mcp-js";
import listQuestionnairesTool from "./tools/list-questionnaires";
import getQuestionnaireTool from "./tools/get-questionnaire";
import scoreQuestionnaireTool from "./tools/score-questionnaire";
import listDimensionsTool from "./tools/list-dimensions";

export default defineMcp({
  name: "youmequiz",
  title: "YouMeQuiz",
  version: "0.1.0",
  instructions:
    "Tools for YouMeQuiz, a set of 20-question self-reflection questionnaires. Use `list_questionnaires` to see what is available, `get_questionnaire` to read the questions and options, and `score_questionnaire` to turn a set of answers into questionnaire scale scores and a written pattern report. Results describe answer patterns only — they are for self-reflection and entertainment, never a psychological, clinical, or medical assessment.",
  tools: [listQuestionnairesTool, getQuestionnaireTool, scoreQuestionnaireTool, listDimensionsTool],
});
