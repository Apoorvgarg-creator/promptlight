import { useState } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "../store/settings";
import type { AIProvider, Theme } from "../types";

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const {
    provider,
    apiKey,
    ollamaEndpoint,
    model,
    theme,
    setProvider,
    setApiKey,
    setOllamaEndpoint,
    setModel,
    setTheme,
  } = useSettingsStore();

  const [showApiKey, setShowApiKey] = useState(false);

  const providers: { id: AIProvider; name: string; desc: string }[] = [
    { id: "openai", name: "OpenAI", desc: "GPT-4, GPT-3.5" },
    { id: "anthropic", name: "Anthropic", desc: "Claude models" },
    { id: "ollama", name: "Ollama", desc: "Local models" },
  ];

  const themes: { id: Theme; name: string }[] = [
    { id: "dark", name: "Dark" },
    { id: "light", name: "Light" },
    { id: "system", name: "System" },
  ];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "12px",
    color: "white",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <h2 style={{ color: "white", fontSize: "16px", fontWeight: 600, margin: 0 }}>Settings</h2>
        <button
          onClick={onClose}
          style={{
            padding: "8px",
            background: "transparent",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <svg style={{ width: "20px", height: "20px", color: "#a1a1aa" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
        {/* AI Provider */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a1a1aa", marginBottom: "14px" }}>
            AI Provider
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "left",
                  cursor: "pointer",
                  border: provider === p.id ? "1px solid rgba(99, 102, 241, 0.5)" : "1px solid rgba(255,255,255,0.06)",
                  background: provider === p.id ? "rgba(99, 102, 241, 0.1)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>{p.name}</div>
                <div style={{ color: "#71717a", fontSize: "12px", marginTop: "4px" }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        {provider !== "ollama" && (
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a1a1aa", marginBottom: "14px" }}>
              API Key
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Enter ${provider === "openai" ? "OpenAI" : "Anthropic"} API key`}
                style={{ ...inputStyle, paddingRight: "48px" }}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "6px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <svg style={{ width: "16px", height: "16px", color: "#71717a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {showApiKey ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Ollama Endpoint */}
        {provider === "ollama" && (
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a1a1aa", marginBottom: "14px" }}>
              Ollama Endpoint
            </label>
            <input
              type="text"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              placeholder="http://localhost:11434"
              style={inputStyle}
            />
          </div>
        )}

        {/* Model */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a1a1aa", marginBottom: "14px" }}>
            Model <span style={{ color: "#52525b", fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={
              provider === "openai" ? "gpt-4o-mini" : provider === "anthropic" ? "claude-3-5-haiku-latest" : "llama3.2"
            }
            style={inputStyle}
          />
          <p style={{ color: "#52525b", fontSize: "12px", marginTop: "8px" }}>Leave empty to use the default model</p>
        </div>

        {/* Theme */}
        <div style={{ marginBottom: "28px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a1a1aa", marginBottom: "14px" }}>Theme</label>
          <div style={{ display: "flex", gap: "12px" }}>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  border: theme === t.id ? "1px solid rgba(99, 102, 241, 0.5)" : "1px solid rgba(255,255,255,0.06)",
                  background: theme === t.id ? "rgba(99, 102, 241, 0.1)" : "transparent",
                  color: theme === t.id ? "white" : "#71717a",
                  transition: "all 0.15s",
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a1a1aa", marginBottom: "14px" }}>
            Keyboard Shortcuts
          </label>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "16px" }}>
            {[
              ["Toggle window", "Cmd + Shift + Space"],
              ["Copy prompt", "Enter"],
              ["Copy and close", "Cmd + Enter"],
              ["Navigate", "Up / Down"],
              ["Close window", "Escape"],
              ["Settings", "Cmd + ,"],
            ].map(([action, shortcut]) => (
              <div key={action} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", padding: "8px 0" }}>
                <span style={{ color: "#71717a" }}>{action}</span>
                <kbd style={{ padding: "4px 8px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", fontSize: "12px", color: "#a1a1aa", fontFamily: "monospace" }}>
                  {shortcut}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />
      <div style={{ padding: "16px 24px", textAlign: "center", color: "#52525b", fontSize: "12px" }}>
        PromptLight v0.1.0
      </div>
    </motion.div>
  );
}
