import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          padding: 42,
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
                style={{ width: 26, height: 26, background: "#6ee7b7", opacity: op, borderRadius: 5 }}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    { ...size }
  );
}
