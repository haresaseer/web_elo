import { PlayerCardInput } from "../players";

export function MinimalTemplate({ data }: { data: PlayerCardInput }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EDEBE3",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          width: 520,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          padding: "36px 42px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 32, fontWeight: 600, color: "#1A1A18" }}>{data.name}</span>
          <div
            style={{
              display: "flex",
              backgroundColor: "#E6F1FB",
              color: "#0C447C",
              fontSize: 18,
              padding: "8px 16px",
              borderRadius: 8,
            }}
          >
            Rank {data.rank}
          </div>
        </div>

        {(data.joinDate || data.archetype) && (
          <span style={{ fontSize: 18, color: "#6B6A64", marginTop: 6 }}>
            {[
              data.joinDate ? `Joined ${data.joinDate}` : null,
              data.archetype ? `${data.archetype} archetype` : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        )}

        <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              backgroundColor: "#F1EFE8",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <span style={{ fontSize: 16, color: "#6B6A64" }}>Elo rating</span>
            <span style={{ fontSize: 34, fontWeight: 600, color: "#1A1A18" }}>
              {data.elo.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              backgroundColor: "#F1EFE8",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            <span style={{ fontSize: 16, color: "#6B6A64" }}>Peak elo</span>
            <span style={{ fontSize: 34, fontWeight: 600, color: "#1A1A18" }}>
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
              borderTop: "1px solid rgba(0,0,0,0.08)",
              gap: 10,
            }}
          >
            {data.bestPerformance && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, color: "#6B6A64" }}>Best performance</span>
                <span style={{ fontSize: 18, color: "#1A1A18" }}>{data.bestPerformance}</span>
              </div>
            )}
            {data.winRate !== undefined && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, color: "#6B6A64" }}>Win rate</span>
                <span style={{ fontSize: 18, color: "#1A1A18" }}>{data.winRate}%</span>
              </div>
            )}
            {data.customFields.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 18, color: "#6B6A64" }}>{f.label}</span>
                <span style={{ fontSize: 18, color: "#1A1A18" }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
