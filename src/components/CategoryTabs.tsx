import { motion } from "framer-motion";

const categories = [
  { id: "all", label: "All" },
  { id: "coding", label: "Coding" },
  { id: "writing", label: "Writing" },
  { id: "analysis", label: "Analysis" },
  { id: "custom", label: "Custom" },
];

interface CategoryTabsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          style={{
            position: "relative",
            padding: "10px 16px",
            fontSize: "13px",
            fontWeight: 500,
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: selected === category.id ? "white" : "#71717a",
            transition: "color 0.15s",
          }}
        >
          {selected === category.id && (
            <motion.div
              layoutId="activeTab"
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.08)",
                borderRadius: "8px",
              }}
              transition={{ type: "spring", duration: 0.25, bounce: 0.15 }}
            />
          )}
          <span style={{ position: "relative", zIndex: 10 }}>{category.label}</span>
        </button>
      ))}
    </div>
  );
}
