export default function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#FBF6EE",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 430,
          minHeight: "100dvh",
          background: "#FBF6EE",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "var(--font-sans)",
          color: "#1C1917",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
