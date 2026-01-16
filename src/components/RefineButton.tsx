import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { useSettingsStore } from "../store/settings";

interface RefineButtonProps {
  prompt: string;
  onRefined: (refined: string) => void;
}

export function RefineButton({ prompt, onRefined }: RefineButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { provider, apiKey, ollamaEndpoint, model } = useSettingsStore();

  const handleRefine = async () => {
    if (!prompt.trim()) {
      setError("Enter a prompt first");
      setTimeout(() => setError(null), 2000);
      return;
    }

    if (provider !== "ollama" && !apiKey) {
      setError("Add API key in settings");
      setTimeout(() => setError(null), 2000);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const refined = await invoke<string>("refine_prompt", {
        prompt,
        provider,
        apiKey,
        endpoint: provider === "ollama" ? ollamaEndpoint : null,
        model: model || null,
      });
      onRefined(refined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refine");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleRefine}
        disabled={isLoading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 500,
          border: "none",
          cursor: isLoading ? "wait" : "pointer",
          background: isLoading ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.15)",
          color: isLoading ? "#a5b4fc" : "#818cf8",
          transition: "all 0.15s",
        }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.svg
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ rotate: { duration: 1, repeat: Infinity, ease: "linear" } }}
              style={{ width: "16px", height: "16px" }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sparkle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: "16px", height: "16px" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </motion.svg>
          )}
        </AnimatePresence>
        {isLoading ? "Refining..." : "Refine"}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              padding: "8px 12px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "8px",
              color: "#f87171",
              fontSize: "12px",
              whiteSpace: "nowrap",
              zIndex: 50,
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
