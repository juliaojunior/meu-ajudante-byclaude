import Link from "next/link";
import { IcChevronLeft } from "@/components/icons";

type Props = {
  backHref: string;
  label: string;
  title?: string;
};

export default function PageHeader({ backHref, label, title }: Props) {
  return (
    <div
      style={{
        padding: "8px 20px 16px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexShrink: 0,
      }}
    >
      <Link
        href={backHref}
        aria-label="Voltar"
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          background: "#FFFBF3",
          border: "1px solid #EADFCE",
          color: "#1C1917",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          textDecoration: "none",
        }}
      >
        <IcChevronLeft size={22} stroke={2.3} />
      </Link>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#57534E",
            textTransform: "uppercase",
            letterSpacing: 1.5,
          }}
        >
          {label}
        </div>
        {title && (
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 24,
              fontWeight: 600,
              color: "#1C1917",
              letterSpacing: -0.4,
              display: "block",
            }}
          >
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
