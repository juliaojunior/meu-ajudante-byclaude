type Props = { time?: string };

export default function StatusBar({ time = "07:48" }: Props) {
  return (
    <div
      style={{
        height: 44,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: 15,
        fontWeight: 600,
        color: "#1C1917",
        fontVariantNumeric: "tabular-nums",
        flexShrink: 0,
      }}
    >
      <span>{time}</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {/* Barras de sinal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <path d="M1 7.5h2v3H1zM5 5.5h2v5H5zM9 3h2v7.5H9zM13 0h2v10.5h-2z" />
        </svg>
        {/* Bateria */}
        <div
          style={{
            width: 24,
            height: 11,
            border: "1px solid currentColor",
            borderRadius: 3,
            padding: 1,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              width: "80%",
              height: "100%",
              background: "currentColor",
              borderRadius: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
}
