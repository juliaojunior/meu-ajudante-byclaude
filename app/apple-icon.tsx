import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          <div
            style={{
              width: "80px",
              height: "36px",
              borderRadius: "18px",
              border: "3px solid rgba(255,255,255,0.7)",
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
          </div>
          <div
            style={{
              color: "white",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-1px",
              marginTop: "8px",
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
