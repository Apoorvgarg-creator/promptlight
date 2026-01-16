import type { PromptTemplate } from "../types";

export const promptTemplates: PromptTemplate[] = [
  // Coding prompts
  {
    id: "code-debug",
    title: "Debug Code",
    description: "Help identify and fix bugs in code",
    template:
      "Debug this code and explain what's wrong:\n\n```\n{code}\n```\n\nIdentify the issue, explain why it occurs, and provide a corrected version.",
    category: "coding",
  },
  {
    id: "code-refactor",
    title: "Refactor Code",
    description: "Improve code quality and readability",
    template:
      "Refactor this code for better readability, performance, and maintainability:\n\n```\n{code}\n```\n\nExplain the improvements made.",
    category: "coding",
  },
  {
    id: "code-explain",
    title: "Explain Code",
    description: "Get a detailed explanation of code",
    template:
      "Explain this code in detail, including its purpose, how it works, and any important patterns used:\n\n```\n{code}\n```",
    category: "coding",
  },
  {
    id: "code-generate",
    title: "Generate Code",
    description: "Generate code from requirements",
    template:
      "Generate {language} code that accomplishes the following:\n\n{requirements}\n\nInclude comments explaining key parts and handle edge cases.",
    category: "coding",
  },
  {
    id: "code-review",
    title: "Code Review",
    description: "Get a thorough code review",
    template:
      "Review this code for potential issues, security vulnerabilities, and improvements:\n\n```\n{code}\n```\n\nProvide specific, actionable feedback.",
    category: "coding",
  },
  {
    id: "code-tests",
    title: "Write Tests",
    description: "Generate unit tests for code",
    template:
      "Write comprehensive unit tests for this code:\n\n```\n{code}\n```\n\nCover edge cases and common scenarios. Use {framework} testing framework.",
    category: "coding",
  },
  {
    id: "code-convert",
    title: "Convert Code",
    description: "Convert code between languages",
    template:
      "Convert this {source_language} code to {target_language}:\n\n```\n{code}\n```\n\nMaintain the same functionality and follow {target_language} best practices.",
    category: "coding",
  },

  // Writing prompts
  {
    id: "write-email",
    title: "Write Email",
    description: "Compose a professional email",
    template:
      "Write a {tone} email about {topic}.\n\nContext: {context}\n\nKey points to include:\n- {point1}\n- {point2}",
    category: "writing",
  },
  {
    id: "write-document",
    title: "Write Document",
    description: "Create a structured document",
    template:
      "Write a {type} document about {topic}.\n\nTarget audience: {audience}\nTone: {tone}\nLength: {length}\n\nKey sections to cover: {sections}",
    category: "writing",
  },
  {
    id: "write-creative",
    title: "Creative Writing",
    description: "Generate creative content",
    template:
      "Write a {type} about {topic}.\n\nStyle: {style}\nTone: {tone}\nLength: approximately {length} words\n\nInclude these elements: {elements}",
    category: "writing",
  },
  {
    id: "write-summarize",
    title: "Summarize Text",
    description: "Create a concise summary",
    template:
      "Summarize the following text in {length} format:\n\n{text}\n\nFocus on: {focus}\nInclude key takeaways and main points.",
    category: "writing",
  },
  {
    id: "write-rewrite",
    title: "Rewrite Text",
    description: "Improve or adapt existing text",
    template:
      "Rewrite this text to be more {quality}:\n\n{text}\n\nMaintain the core message while improving {aspect}.",
    category: "writing",
  },
  {
    id: "write-proofread",
    title: "Proofread",
    description: "Check for errors and improvements",
    template:
      "Proofread this text for grammar, spelling, and style:\n\n{text}\n\nProvide corrections and suggestions for improvement.",
    category: "writing",
  },
  {
    id: "write-outline",
    title: "Create Outline",
    description: "Generate a structured outline",
    template:
      "Create a detailed outline for a {type} about {topic}.\n\nTarget audience: {audience}\nMain objective: {objective}\nKey points to cover: {points}",
    category: "writing",
  },

  // Analysis prompts
  {
    id: "analyze-data",
    title: "Analyze Data",
    description: "Get insights from data",
    template:
      "Analyze this data and provide insights:\n\n{data}\n\nFocus on: {focus}\nProvide statistical analysis, trends, and actionable recommendations.",
    category: "analysis",
  },
  {
    id: "analyze-research",
    title: "Research Topic",
    description: "Deep dive into a topic",
    template:
      "Research {topic} and provide a comprehensive analysis.\n\nInclude:\n- Background and context\n- Key findings\n- Different perspectives\n- Implications and conclusions\n\nFocus areas: {focus}",
    category: "analysis",
  },
  {
    id: "analyze-compare",
    title: "Compare Options",
    description: "Compare and contrast choices",
    template:
      "Compare {option1} vs {option2} for {use_case}.\n\nConsider these factors:\n- {factor1}\n- {factor2}\n- {factor3}\n\nProvide a clear recommendation with reasoning.",
    category: "analysis",
  },
  {
    id: "analyze-pros-cons",
    title: "Pros and Cons",
    description: "Evaluate advantages and disadvantages",
    template:
      "Analyze the pros and cons of {topic}.\n\nContext: {context}\n\nProvide a balanced assessment with:\n- Key advantages\n- Potential drawbacks\n- Overall recommendation",
    category: "analysis",
  },
  {
    id: "analyze-strategy",
    title: "Strategic Analysis",
    description: "Analyze strategy and planning",
    template:
      "Provide a strategic analysis for {objective}.\n\nCurrent situation: {situation}\nGoals: {goals}\nConstraints: {constraints}\n\nInclude actionable steps and risk assessment.",
    category: "analysis",
  },
  {
    id: "analyze-feedback",
    title: "Analyze Feedback",
    description: "Extract insights from feedback",
    template:
      "Analyze this feedback and extract key insights:\n\n{feedback}\n\nIdentify:\n- Common themes\n- Sentiment patterns\n- Actionable improvements\n- Priority areas",
    category: "analysis",
  },
];

export function filterPrompts(
  prompts: PromptTemplate[],
  search: string,
  category?: string
): PromptTemplate[] {
  let filtered = prompts;

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (search.trim()) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.template.toLowerCase().includes(query)
    );
  }

  return filtered;
}
