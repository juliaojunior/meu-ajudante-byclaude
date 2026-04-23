export type MedKind = "cap1" | "cap2" | "tab1" | "tab2" | "oval";

const Capsule = ({
  a = "#C2410C",
  b = "#FDBA74",
  size = 48,
  rot = -30,
}: {
  a?: string;
  b?: string;
  size?: number;
  rot?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <g transform={`rotate(${rot} 24 24)`}>
      <rect x="8" y="18" width="16" height="12" rx="6" fill={a} />
      <rect x="24" y="18" width="16" height="12" rx="6" fill={b} />
      <rect
        x="8"
        y="18"
        width="32"
        height="12"
        rx="6"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />
      <ellipse
        cx="14"
        cy="22"
        rx="3"
        ry="1.2"
        fill="rgba(255,255,255,0.45)"
      />
    </g>
  </svg>
);

const Tablet = ({
  c = "#fff",
  ring = "#A16207",
  size = 48,
}: {
  c?: string;
  ring?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="13" fill={c} stroke={ring} strokeWidth="1.5" />
    <line
      x1="12"
      y1="24"
      x2="36"
      y2="24"
      stroke={ring}
      strokeWidth="1.2"
      opacity="0.6"
    />
    <ellipse cx="20" cy="20" rx="3" ry="1.5" fill="rgba(255,255,255,0.6)" />
  </svg>
);

const Oval = ({ c = "#4D7C0F", size = 48 }: { c?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <g transform="rotate(-20 24 24)">
      <ellipse cx="24" cy="24" rx="14" ry="8" fill={c} />
      <ellipse cx="19" cy="21" rx="3" ry="1.3" fill="rgba(255,255,255,0.45)" />
    </g>
  </svg>
);

export function MedIcon({ kind, size = 48 }: { kind: MedKind; size?: number }) {
  if (kind === "cap1") return <Capsule a="#C2410C" b="#FDBA74" size={size} />;
  if (kind === "cap2")
    return <Capsule a="#9A3412" b="#FED7AA" rot={-12} size={size} />;
  if (kind === "tab1") return <Tablet c="#FEF3C7" ring="#92400E" size={size} />;
  if (kind === "tab2") return <Tablet c="#FFFFFF" ring="#78716C" size={size} />;
  if (kind === "oval") return <Oval c="#4D7C0F" size={size} />;
  return <Tablet size={size} />;
}
