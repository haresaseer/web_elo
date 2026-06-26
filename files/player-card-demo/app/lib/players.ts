export type CustomField = {
  label: string;
  value: string;
};

// The data shape shared by the form, every template, and both export paths.
// Fixed fields are required/typed; customFields lets users add their own
// label/value pairs (capped at MAX_CUSTOM_FIELDS) without changing the schema.
export type PlayerCardInput = {
  name: string;
  rank: number;
  elo: number;
  peakElo: number;
  archetype?: string;
  joinDate?: string;
  bestPerformance?: string;
  winRate?: number;
  customFields: CustomField[];
};

export const MAX_CUSTOM_FIELDS = 4;

export const TEMPLATE_IDS = ["minimal", "esports", "trading"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value);
}

// Server-side validation. The form should already enforce most of this,
// but never trust client input for something that lands in generated files.
export function validatePlayerCardInput(
  data: unknown
): { ok: true; value: PlayerCardInput } | { ok: false; error: string } {
  if (typeof data !== "object" || data === null) {
    return { ok: false, error: "Invalid payload" };
  }
  const d = data as Record<string, unknown>;

  if (typeof d.name !== "string" || d.name.trim().length === 0) {
    return { ok: false, error: "Name is required" };
  }
  if (d.name.length > 40) {
    return { ok: false, error: "Name must be 40 characters or fewer" };
  }
  if (typeof d.rank !== "number" || !Number.isFinite(d.rank) || d.rank < 0) {
    return { ok: false, error: "Rank must be a non-negative number" };
  }
  if (typeof d.elo !== "number" || !Number.isFinite(d.elo)) {
    return { ok: false, error: "Elo must be a number" };
  }
  if (typeof d.peakElo !== "number" || !Number.isFinite(d.peakElo)) {
    return { ok: false, error: "Peak elo must be a number" };
  }
  if (d.archetype !== undefined && typeof d.archetype !== "string") {
    return { ok: false, error: "Archetype must be text" };
  }
  if (d.joinDate !== undefined && typeof d.joinDate !== "string") {
    return { ok: false, error: "Join date must be text" };
  }
  if (d.bestPerformance !== undefined && typeof d.bestPerformance !== "string") {
    return { ok: false, error: "Best performance must be text" };
  }
  if (d.winRate !== undefined && typeof d.winRate !== "number") {
    return { ok: false, error: "Win rate must be a number" };
  }

  let customFields: CustomField[] = [];
  if (d.customFields !== undefined) {
    if (!Array.isArray(d.customFields)) {
      return { ok: false, error: "Custom fields must be a list" };
    }
    if (d.customFields.length > MAX_CUSTOM_FIELDS) {
      return { ok: false, error: `Max ${MAX_CUSTOM_FIELDS} custom fields` };
    }
    for (const f of d.customFields) {
      if (
        typeof f !== "object" ||
        f === null ||
        typeof (f as Record<string, unknown>).label !== "string" ||
        typeof (f as Record<string, unknown>).value !== "string"
      ) {
        return { ok: false, error: "Each custom field needs a label and value" };
      }
    }
    customFields = (d.customFields as CustomField[])
      .filter((f) => f.label.trim().length > 0)
      .map((f) => ({
        label: f.label.slice(0, 24),
        value: f.value.slice(0, 40),
      }));
  }

  return {
    ok: true,
    value: {
      name: d.name.trim(),
      rank: d.rank,
      elo: d.elo,
      peakElo: d.peakElo,
      archetype: (d.archetype as string | undefined)?.trim(),
      joinDate: (d.joinDate as string | undefined)?.trim(),
      bestPerformance: (d.bestPerformance as string | undefined)?.trim(),
      winRate: d.winRate as number | undefined,
      customFields,
    },
  };
}
