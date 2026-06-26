"use client";

import { useState } from "react";
import { MAX_CUSTOM_FIELDS, TemplateId } from "./lib/players";

type CustomFieldRow = { label: string; value: string };

const TEMPLATE_OPTIONS: { id: TemplateId; name: string; blurb: string }[] = [
  { id: "minimal", name: "Minimal", blurb: "Clean, light stat card" },
  { id: "esports", name: "Esports", blurb: "Dark, high-contrast" },
  { id: "trading", name: "Trading card", blurb: "Collectible style" },
];

export default function Home() {
  const [template, setTemplate] = useState<TemplateId>("minimal");
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [elo, setElo] = useState("");
  const [peakElo, setPeakElo] = useState("");
  const [archetype, setArchetype] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [bestPerformance, setBestPerformance] = useState("");
  const [winRate, setWinRate] = useState("");
  const [customFields, setCustomFields] = useState<CustomFieldRow[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"image" | "sheet" | null>(null);

  function buildPayload() {
    return {
      template,
      name,
      rank: Number(rank),
      elo: Number(elo),
      peakElo: Number(peakElo),
      archetype: archetype || undefined,
      joinDate: joinDate || undefined,
      bestPerformance: bestPerformance || undefined,
      winRate: winRate === "" ? undefined : Number(winRate),
      customFields: customFields.filter((f) => f.label.trim() && f.value.trim()),
    };
  }

  async function handleGenerateImage() {
    setError(null);
    setLoading("image");
    setImageUrl(null);
    try {
      const res = await fetch("/api/card/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch {
      setError("Something went wrong generating the image.");
    } finally {
      setLoading(null);
    }
  }

  async function handleDownloadSpreadsheet() {
    setError(null);
    setLoading("sheet");
    try {
      const res = await fetch("/api/card/spreadsheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        setError(await res.text());
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/[^a-z0-9]/gi, "_") || "player"}_stats.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Something went wrong generating the spreadsheet.");
    } finally {
      setLoading(null);
    }
  }

  function updateCustomField(index: number, key: keyof CustomFieldRow, value: string) {
    setCustomFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: value } : f))
    );
  }

  function addCustomField() {
    if (customFields.length >= MAX_CUSTOM_FIELDS) return;
    setCustomFields((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeCustomField(index: number) {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Player stat card generator</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Enter your stats, pick a template, then export as an image or spreadsheet.
      </p>

      {/* Template picker */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>1. Choose a template</h2>
        <div style={{ display: "flex", gap: 12 }}>
          {TEMPLATE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTemplate(opt.id)}
              style={{
                flex: 1,
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: 10,
                border: template === opt.id ? "2px solid #5B2EE0" : "1px solid #ddd",
                backgroundColor: template === opt.id ? "#F4F0FD" : "#fff",
                cursor: "pointer",
              }}
            >
              <div style={{ fontWeight: 600 }}>{opt.name}</div>
              <div style={{ fontSize: 13, color: "#666" }}>{opt.blurb}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Fixed fields */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>2. Enter your stats</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Player name *" value={name} onChange={setName} />
          <Field label="Rank *" value={rank} onChange={setRank} type="number" />
          <Field label="Elo rating *" value={elo} onChange={setElo} type="number" />
          <Field label="Peak elo *" value={peakElo} onChange={setPeakElo} type="number" />
          <Field label="Archetype" value={archetype} onChange={setArchetype} />
          <Field label="Join date" value={joinDate} onChange={setJoinDate} placeholder="e.g. March 2023" />
          <Field label="Best performance" value={bestPerformance} onChange={setBestPerformance} placeholder="e.g. 1st, Spring Open" />
          <Field label="Win rate (%)" value={winRate} onChange={setWinRate} type="number" />
        </div>
      </section>

      {/* Custom fields */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>
          3. Custom fields ({customFields.length}/{MAX_CUSTOM_FIELDS})
        </h2>
        {customFields.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              placeholder="Label (e.g. Main weapon)"
              value={f.label}
              onChange={(e) => updateCustomField(i, "label", e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Value (e.g. Crossbow)"
              value={f.value}
              onChange={(e) => updateCustomField(i, "value", e.target.value)}
              style={inputStyle}
            />
            <button onClick={() => removeCustomField(i)} style={{ ...buttonStyle, padding: "8px 12px" }}>
              ✕
            </button>
          </div>
        ))}
        {customFields.length < MAX_CUSTOM_FIELDS && (
          <button onClick={addCustomField} style={buttonStyle}>
            + Add custom field
          </button>
        )}
      </section>

      {/* Export actions */}
      <section style={{ marginBottom: 32, display: "flex", gap: 12 }}>
        <button
          onClick={handleGenerateImage}
          disabled={loading !== null}
          style={{ ...buttonStyle, backgroundColor: "#5B2EE0", color: "#fff", border: "none" }}
        >
          {loading === "image" ? "Generating…" : "Generate image"}
        </button>
        <button
          onClick={handleDownloadSpreadsheet}
          disabled={loading !== null}
          style={buttonStyle}
        >
          {loading === "sheet" ? "Generating…" : "Download spreadsheet (.xlsx)"}
        </button>
      </section>

      {error && (
        <p style={{ color: "#C0392B", marginBottom: 16 }}>{error}</p>
      )}

      {imageUrl && (
        <section>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Preview</h2>
          <img src={imageUrl} alt="Generated player card" style={{ borderRadius: 8 }} />
          <div style={{ marginTop: 12 }}>
            <a href={imageUrl} download={`${name || "player"}_card.png`} style={buttonStyle}>
              Download PNG
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", fontSize: 13, color: "#444", gap: 4 }}>
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
  flex: 1,
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "1px solid #ccc",
  backgroundColor: "#fff",
  cursor: "pointer",
  fontSize: 14,
  display: "inline-block",
  textDecoration: "none",
  color: "#222",
};
