import { motion, AnimatePresence } from "framer-motion";
import type { PromptTemplate } from "../types";
import { useSettingsStore } from "../store/settings";

interface PromptCardProps {
  prompt: PromptTemplate;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onCopy: () => void;
}

export function PromptCard({
  prompt,
  index,
  isSelected,
  onSelect,
  onCopy,
}: PromptCardProps) {
  const { favorites, toggleFavorite } = useSettingsStore();
  const isFavorite = favorites.includes(prompt.id);

  const categoryColors: Record<string, { bg: string; text: string }> = {
    coding: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" },
    writing: { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399" },
    analysis: { bg: "rgba(139, 92, 246, 0.15)", text: "#a78bfa" },
    custom: { bg: "rgba(249, 115, 22, 0.15)", text: "#fb923c" },
  };

  const colors = categoryColors[prompt.category] || categoryColors.custom;

  return (
    <div
      data-index={index}
      onClick={onSelect}
      onDoubleClick={onCopy}
      style={{
        margin: "4px 8px",
        padding: "14px 16px",
        borderRadius: "12px",
        cursor: "pointer",
        background: isSelected ? "rgba(255, 255, 255, 0.06)" : "transparent",
        transition: "background 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Icon */}
        <div
          style={{
            padding: "10px",
            borderRadius: "10px",
            background: colors.bg,
            color: colors.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {prompt.category === "coding" && (
            <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          )}
          {prompt.category === "writing" && (
            <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          )}
          {prompt.category === "analysis" && (
            <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
          )}
          {prompt.category === "custom" && (
            <svg style={{ width: "18px", height: "18px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>
              {prompt.title}
            </span>
            <span style={{ color: "#71717a", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {prompt.description}
            </span>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {isFavorite && (
            <svg style={{ width: "16px", height: "16px", color: "#fbbf24" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )}
          <span style={{ color: "#52525b", fontSize: "12px", textTransform: "capitalize" }}>{prompt.category}</span>
        </div>
      </div>

      {/* Expanded content when selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <pre
              style={{
                fontSize: "12px",
                color: "#a1a1aa",
                whiteSpace: "pre-wrap",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                background: "rgba(0,0,0,0.2)",
                padding: "14px",
                borderRadius: "10px",
                maxHeight: "120px",
                overflow: "auto",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {prompt.template}
            </pre>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "14px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
                style={{
                  padding: "10px 18px",
                  background: "#6366f1",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Copy to Clipboard
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(prompt.id);
                }}
                style={{
                  padding: "10px 14px",
                  background: isFavorite ? "rgba(251, 191, 36, 0.15)" : "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "8px",
                  color: isFavorite ? "#fbbf24" : "#a1a1aa",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {isFavorite ? "★ Favorited" : "☆ Favorite"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
