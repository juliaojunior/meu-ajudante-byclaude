import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#C2410C",
          borderRadius: "96px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Pill icon */}
          <div
            style={{
              width: "220px",
              height: "100px",
              borderRadius: "50px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "6px solid rgba(255,255,255,0.6)",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "50%",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            />
            <div
              style={{
                width: "50%",
                height: "100%",
                backgroundColor: "transparent",
              }}
            />
          </div>
          <div
            style={{
              color: "white",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-2px",
              marginTop: "24px",
              fontFamily: "sans-serif",
            }}
          >
            MA
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
