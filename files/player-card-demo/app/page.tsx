"use client";

import { useEffect, useState } from "react";
import { MAX_CUSTOM_FIELDS, TemplateId } from "./lib/players";

type CustomFieldRow = { label: string; value: string };
type Theme = "light" | "dark";

const TEMPLATE_OPTIONS: { id: TemplateId; name: string; blurb: string }[] = [
  { id: "minimal", name: "Minimal", blurb: "Clean, light stat card" },
  { id: "esports", name: "Esports", blurb: "Dark, high-contrast" },
  { id: "trading", name: "Trading card", blurb: "Collectible style" },
];

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
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

  // Sync local state with whatever the pre-paint script in layout.tsx
  // already applied to <html data-theme="...">, so the toggle icon
  // reflects reality on first render instead of defaulting to light.
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dark" || current === "light") setTheme(current);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage can be unavailable (e.g. private browsing); theme
      // still works for this session, it just won't persist.
    }
  }

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
    <div className="app-shell">
      <div className="window">
        <div className="titlebar">
          <span>web-elo — player stat card generator</span>
          <div className="titlebar-buttons">
            <div className="titlebar-btn">_</div>
            <div className="titlebar-btn">▢</div>
            <div className="titlebar-btn close">✕</div>
          </div>
        </div>

        <div className="content">
          <div className="top-row">
            <div>
              <h1>Player stat card generator</h1>
              <p className="subtitle">
                Enter your stats, pick a template, then export as an image or spreadsheet.
              </p>
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? "☀" : "🌙"}
            </button>
          </div>

          {/* Template picker */}
          <section>
            <p className="section-label">1. Choose a template</p>
            <div className="template-row">
              {TEMPLATE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`template-card${template === opt.id ? " selected" : ""}`}
                  onClick={() => setTemplate(opt.id)}
                >
                  <div className="name">{opt.name}</div>
                  <div className="blurb">{opt.blurb}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Fixed fields */}
          <section>
            <p className="section-label">2. Enter your stats</p>
            <div className="field-grid">
              <Field label="Player name *" value={name} onChange={setName} />
              <Field label="Rank *" value={rank} onChange={setRank} type="number" />
              <Field label="Elo rating *" value={elo} onChange={setElo} type="number" />
              <Field label="Peak elo *" value={peakElo} onChange={setPeakElo} type="number" />
              <Field label="Archetype" value={archetype} onChange={setArchetype} />
              <Field label="Join date" value={joinDate} onChange={setJoinDate} placeholder="e.g. March 2023" />
              <Field
                label="Best performance"
                value={bestPerformance}
                onChange={setBestPerformance}
                placeholder="e.g. 1st, Spring Open"
              />
              <Field label="Win rate (%)" value={winRate} onChange={setWinRate} type="number" />
            </div>
          </section>

          {/* Custom fields */}
          <section>
            <p className="section-label">
              3. Custom fields ({customFields.length}/{MAX_CUSTOM_FIELDS})
            </p>
            {customFields.map((f, i) => (
              <div key={i} className="custom-row">
                <input
                  type="text"
                  placeholder="Label (e.g. Main weapon)"
                  value={f.label}
                  onChange={(e) => updateCustomField(i, "label", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Crossbow)"
                  value={f.value}
                  onChange={(e) => updateCustomField(i, "value", e.target.value)}
                />
                <button className="remove-btn" onClick={() => removeCustomField(i)}>
                  ✕
                </button>
              </div>
            ))}
            {customFields.length < MAX_CUSTOM_FIELDS && (
              <button className="add-field-btn" onClick={addCustomField}>
                + Add custom field
              </button>
            )}
          </section>

          {/* Export actions */}
          <section className="actions">
            <button className="aero-btn primary" onClick={handleGenerateImage} disabled={loading !== null}>
              {loading === "image" ? "Generating…" : "Generate image"}
            </button>
            <button className="aero-btn" onClick={handleDownloadSpreadsheet} disabled={loading !== null}>
              {loading === "sheet" ? "Generating…" : "Download spreadsheet (.xlsx)"}
            </button>
          </section>

          {error && <p className="error-text">{error}</p>}

          {imageUrl && (
            <section>
              <p className="section-label">Preview</p>
              <img src={imageUrl} alt="Generated player card" className="preview-image" />
              <div style={{ marginTop: 12 }}>
                <a href={imageUrl} download={`${name || "player"}_card.png`} className="aero-btn">
                  Download PNG
                </a>
              </div>
            </section>
          )}
        </div>
      </div>
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
    <label>
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
