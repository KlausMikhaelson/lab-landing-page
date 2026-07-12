import { ImageResponse } from "next/og";

export const alt = "Understudy — Run the experiment before your users do";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const rows = [
    [1, 0.3, 1],
    [0.3, 1, 0.3],
    [1, 0.3, 1],
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          // dawn palette echoing the landing scene
          backgroundImage:
            "linear-gradient(135deg, #141728 0%, #26203f 45%, #6a3f55 78%, #b8724f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 34, height: 34 }}>
            {rows.map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                {row.map((op, j) => (
                  <div key={j} style={{ width: 8, height: 8, background: "#6ee7b7", opacity: op, borderRadius: 1 }} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "white", letterSpacing: -0.5 }}>Understudy</div>
        </div>

        {/* headline + subhead */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ width: 12, height: 12, background: "#6ee7b7" }} />
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.85)", fontFamily: "monospace" }}>
              Backtested on real behavioral data · p &lt; 0.01
            </div>
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, color: "white", lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 900 }}>
            Run the experiment before your users do.
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.82)", marginTop: 26, maxWidth: 820 }}>
            Swarms of grounded agents reveal which version wins — and why.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
