import { Spotlight } from "./components/Spotlight";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "24px",
        boxSizing: "border-box",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(28, 28, 30, 0.98)",
          backdropFilter: "blur(80px)",
          WebkitBackdropFilter: "blur(80px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        <Spotlight />
      </div>
    </div>
  );
}

export default App;
