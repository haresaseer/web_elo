import { PlayerCardInput } from "../players";

export function EsportsTemplate({ data }: { data: PlayerCardInput }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B0B10",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          width: 520,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#15151D",
          borderRadius: 12,
          border: "1px solid #2A2A38",
          padding: "36px 42px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 34, fontWeight: 700, color: "#FFFFFF", letterSpacing: -0.5 }}>
            {data.name.toUpperCase()}
          </span>
          <div
            style={{
              display: "flex",
              backgroundColor: "#5B2EE0",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 6,
            }}
          >
            RANK {data.rank}
          </div>
        </div>

        {(data.joinDate || data.archetype) && (
          <span style={{ fontSize: 16, color: "#8C8CA0", marginTop: 6, letterSpacing: 0.5 }}>
            {[
              data.joinDate ? `JOINED ${data.joinDate.toUpperCase()}` : null,
              data.archetype ? `${data.archetype.toUpperCase()} ARCHETYPE` : null,
            ]
              .filter(Boolean)
              .join("  //  ")}
          </span>
        )}

        <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              backgroundColor: "#1E1E2A",
              borderRadius: 8,
              borderLeft: "3px solid #5B2EE0",
              padding: "16px 20px",
            }}
          >
            <span style={{ fontSize: 14, color: "#8C8CA0", letterSpacing: 0.5 }}>ELO RATING</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#FFFFFF" }}>
              {data.elo.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              backgroundColor: "#1E1E2A",
              borderRadius: 8,
              borderLeft: "3px solid #E03E5B",
              padding: "16px 20px",
            }}
          >
            <span style={{ fontSize: 14, color: "#8C8CA0", letterSpacing: 0.5 }}>PEAK ELO</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#FFFFFF" }}>
              {data.peakElo.toLocaleString()}
            </span>
          </div>
        </div>

        {(data.bestPerformance || data.winRate !== undefined || data.customFields.length > 0) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid #2A2A38",
              gap: 10,
            }}
          >
            {data.bestPerformance && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 16, color: "#8C8CA0" }}>BEST PERFORMANCE</span>
                <span style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 600 }}>
                  {data.bestPerformance}
                </span>
              </div>
            )}
            {data.winRate !== undefined && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 16, color: "#8C8CA0" }}>WIN RATE</span>
                <span style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 600 }}>
                  {data.winRate}%
                </span>
              </div>
            )}
            {data.customFields.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 16, color: "#8C8CA0" }}>{f.label.toUpperCase()}</span>
                <span style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 600 }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
