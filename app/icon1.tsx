import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function IconMaskable() {
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
        {/* Safe zone wrapper: 80% of canvas (~410x410) keeps content clear of adaptive-icon mask crop */}
        <div
          style={{
            width: "80%",
            height: "80%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
                width: "176px",
                height: "80px",
                borderRadius: "40px",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "5px solid rgba(255,255,255,0.6)",
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
                fontSize: "58px",
                fontWeight: 700,
                letterSpacing: "-2px",
                marginTop: "20px",
                fontFamily: "sans-serif",
              }}
            >
              MA
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
