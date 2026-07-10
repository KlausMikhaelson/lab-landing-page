import { ImageResponse } from "next/og";

// pixel dot-matrix "swarm" mark — same glyph as the nav logo
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          background: "#141728",
          borderRadius: 6,
          padding: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
            {row.map((op, j) => (
              <div
                key={j}
                style={{ width: 5, height: 5, background: "#6ee7b7", opacity: op, borderRadius: 1 }}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    { ...size }
  );
}
