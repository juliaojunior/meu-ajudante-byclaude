type Props = {
  label: string;
  value: string;
  big?: boolean;
  style?: React.CSSProperties;
};

export default function FormField({ label, value, big, style }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#57534E",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          padding: "14px 16px",
          background: "#FFFBF3",
          borderRadius: 14,
          border: "1px solid #EADFCE",
          fontSize: big ? 22 : 16,
          fontWeight: big ? 700 : 500,
          color: "#1C1917",
          fontFamily: big ? "var(--font-serif)" : "var(--font-sans)",
          letterSpacing: big ? -0.3 : 0,
        }}
      >
        {value}
      </div>
    </div>
  );
}
