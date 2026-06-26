import { PlayerCardInput } from "../players";

export function TradingTemplate({ data }: { data: PlayerCardInput }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F4EFE4",
        fontFamily: "Inter",
      }}
    >
      <div
        style={{
          width: 420,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFDF7",
          borderRadius: 20,
          border: "6px solid #C9A24B",
          padding: "28px 30px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#C9A24B",
              color: "#FFFDF7",
              fontSize: 14,
              fontWeight: 700,
              padding: "4px 14px",
              borderRadius: 999,
              letterSpacing: 1,
            }}
          >
            RANK {data.rank}
          </div>
        </div>

        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#2B2410",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {data.name}
        </span>

        {data.archetype && (
          <span
            style={{
              fontSize: 16,
              color: "#8A7B4E",
              textAlign: "center",
              marginTop: 2,
              fontStyle: "italic",
            }}
          >
            {data.archetype}
          </span>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 24,
            marginTop: 20,
            paddingTop: 16,
            borderTop: "2px dashed #C9A24B",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#8A7B4E" }}>ELO</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#2B2410" }}>
              {data.elo.toLocaleString()}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#8A7B4E" }}>PEAK</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: "#2B2410" }}>
              {data.peakElo.toLocaleString()}
            </span>
          </div>
        </div>

        {(data.bestPerformance || data.winRate !== undefined || data.customFields.length > 0) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 18,
              paddingTop: 14,
              borderTop: "2px dashed #C9A24B",
              gap: 6,
            }}
          >
            {data.bestPerformance && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#8A7B4E" }}>Best performance</span>
                <span style={{ fontSize: 14, color: "#2B2410", fontWeight: 600 }}>
                  {data.bestPerformance}
                </span>
              </div>
            )}
            {data.winRate !== undefined && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#8A7B4E" }}>Win rate</span>
                <span style={{ fontSize: 14, color: "#2B2410", fontWeight: 600 }}>
                  {data.winRate}%
                </span>
              </div>
            )}
            {data.customFields.map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#8A7B4E" }}>{f.label}</span>
                <span style={{ fontSize: 14, color: "#2B2410", fontWeight: 600 }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
