import { Spotlight } from "./components/Spotlight";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(28, 28, 30, 0.95)",
          backdropFilter: "blur(80px)",
          WebkitBackdropFilter: "blur(80px)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        <Spotlight />
      </div>
    </div>
  );
}

export default App;
