import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { invoke } from "@tauri-apps/api/core";
import { CategoryTabs } from "./CategoryTabs";
import { PromptList } from "./PromptList";
import { RefineButton } from "./RefineButton";
import { Settings } from "./Settings";
import { promptTemplates, filterPrompts } from "../services/prompts";
import { useSettingsStore } from "../store/settings";
import type { PromptTemplate } from "../types";

export function Spotlight() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { customPrompts, addRecentPrompt } = useSettingsStore();

  const allPrompts = [...promptTemplates, ...customPrompts];
  const filteredPrompts = filterPrompts(allPrompts, search, category);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search, category]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selectedItem = list.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const copyToClipboard = useCallback(
    async (prompt: PromptTemplate, close = false) => {
      const text = refinedPrompt || prompt.template;
      await writeText(text);
      addRecentPrompt(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
      if (close) {
        await invoke("hide_window");
      }
    },
    [refinedPrompt, addRecentPrompt]
  );

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent) => {
      const prompt = filteredPrompts[selectedIndex];

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) =>
            prev < filteredPrompts.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (prompt) {
            await copyToClipboard(prompt, e.metaKey);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (showSettings) {
            setShowSettings(false);
          } else {
            await invoke("hide_window");
          }
          break;
        case ",":
          if (e.metaKey) {
            e.preventDefault();
            setShowSettings(true);
          }
          break;
      }
    },
    [filteredPrompts, selectedIndex, showSettings, copyToClipboard]
  );

  return (
    <div
      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        {showSettings ? (
          <Settings key="settings" onClose={() => setShowSettings(false)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg
                style={{ width: "20px", height: "20px", color: "#71717a", flexShrink: 0 }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 400,
                }}
              />
              <RefineButton
                prompt={search || filteredPrompts[selectedIndex]?.template || ""}
                onRefined={setRefinedPrompt}
              />
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  padding: "10px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Settings (⌘,)"
              >
                <svg
                  style={{ width: "20px", height: "20px", color: "#71717a" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Category Tabs */}
            <CategoryTabs selected={category} onSelect={setCategory} />

            {/* Refined Prompt Display */}
            <AnimatePresence>
              {refinedPrompt && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    margin: "16px 20px",
                    padding: "16px",
                    background: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ color: "#818cf8", fontSize: "14px", fontWeight: 500 }}>Refined Prompt</span>
                    <button
                      onClick={() => setRefinedPrompt(null)}
                      style={{ padding: "4px", background: "transparent", border: "none", cursor: "pointer", borderRadius: "6px" }}
                    >
                      <svg style={{ width: "16px", height: "16px", color: "#71717a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <pre style={{ fontSize: "13px", color: "#d4d4d8", whiteSpace: "pre-wrap", fontFamily: "monospace", maxHeight: "100px", overflow: "auto", lineHeight: 1.6 }}>
                    {refinedPrompt}
                  </pre>
                  <button
                    onClick={async () => {
                      await writeText(refinedPrompt);
                      setCopyFeedback(true);
                      setTimeout(() => setCopyFeedback(false), 1500);
                    }}
                    style={{
                      marginTop: "12px",
                      padding: "10px 16px",
                      background: "#6366f1",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Copy Refined
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt List */}
            <div ref={listRef} style={{ flex: 1, overflow: "auto", padding: "8px 12px" }}>
              <PromptList
                prompts={filteredPrompts}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                onCopy={(prompt) => copyToClipboard(prompt)}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#71717a",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <kbd style={{ padding: "4px 8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", fontSize: "11px", color: "#a1a1aa" }}>↑↓</kbd>
                  Navigate
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <kbd style={{ padding: "4px 8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", fontSize: "11px", color: "#a1a1aa" }}>↵</kbd>
                  Copy
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <kbd style={{ padding: "4px 8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", fontSize: "11px", color: "#a1a1aa" }}>⌘↵</kbd>
                  Copy & Close
                </span>
              </div>
              <AnimatePresence>
                {copyFeedback && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ color: "#4ade80", fontSize: "12px", fontWeight: 500 }}
                  >
                    ✓ Copied!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
