import { useId } from "react";

type Props = {
  label: string;
  value: string;
  big?: boolean;
  style?: React.CSSProperties;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
};

export default function FormField({
  label,
  value,
  big,
  style,
  onChange,
  placeholder,
  type = "text",
}: Props) {
  const id = useId();

  const baseStyle: React.CSSProperties = {
    padding: "14px 16px",
    background: "#FFFBF3",
    borderRadius: 14,
    border: "1px solid #EADFCE",
    fontSize: big ? 22 : 16,
    fontWeight: big ? 700 : 500,
    color: "#1C1917",
    fontFamily: big ? "var(--font-serif)" : "var(--font-sans)",
    letterSpacing: big ? -0.3 : 0,
    width: "100%",
    boxSizing: "border-box" as const,
    minHeight: 52,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, ...style }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#57534E",
          textTransform: "uppercase" as const,
          letterSpacing: 1,
        }}
      >
        {label}
      </label>
      {onChange ? (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={baseStyle}
        />
      ) : (
        <div style={baseStyle}>{value}</div>
      )}
    </div>
  );
}
