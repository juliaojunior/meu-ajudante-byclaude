type Props = { on?: boolean; onClick?: () => void };

export default function Toggle({ on = true, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={on ? "Desativar alarme" : "Ativar alarme"}
      style={{
        width: 52,
        height: 30,
        borderRadius: 15,
        background: on ? "#4D7C0F" : "#D6C6AA",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        padding: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: on ? 25 : 3,
          width: 24,
          height: 24,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}
