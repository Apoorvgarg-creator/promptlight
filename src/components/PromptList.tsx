import { PromptCard } from "./PromptCard";
import type { PromptTemplate } from "../types";

interface PromptListProps {
  prompts: PromptTemplate[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onCopy: (prompt: PromptTemplate) => void;
}

export function PromptList({
  prompts,
  selectedIndex,
  onSelect,
  onCopy,
}: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#71717a",
          padding: "48px 0",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg
            style={{ width: "40px", height: "40px", margin: "0 auto 8px", opacity: 0.3 }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p style={{ fontSize: "14px" }}>No prompts found</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {prompts.map((prompt, index) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          index={index}
          isSelected={index === selectedIndex}
          onSelect={() => onSelect(index)}
          onCopy={() => onCopy(prompt)}
        />
      ))}
    </div>
  );
}
