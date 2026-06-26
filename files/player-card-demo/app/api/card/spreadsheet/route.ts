import ExcelJS from "exceljs";
import { validatePlayerCardInput } from "@/app/lib/players";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response("Invalid request body", { status: 400 });
  }

  const validated = validatePlayerCardInput(body);
  if (!validated.ok) {
    return new Response(validated.error, { status: 400 });
  }
  const data = validated.value;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Player Stats");

  sheet.columns = [
    { header: "Field", key: "field", width: 24 },
    { header: "Value", key: "value", width: 30 },
  ];
  sheet.getRow(1).font = { bold: true };

  const rows: { field: string; value: string | number }[] = [
    { field: "Name", value: data.name },
    { field: "Rank", value: data.rank },
    { field: "Elo rating", value: data.elo },
    { field: "Peak elo", value: data.peakElo },
  ];
  if (data.archetype) rows.push({ field: "Archetype", value: data.archetype });
  if (data.joinDate) rows.push({ field: "Join date", value: data.joinDate });
  if (data.bestPerformance) rows.push({ field: "Best performance", value: data.bestPerformance });
  if (data.winRate !== undefined) rows.push({ field: "Win rate (%)", value: data.winRate });
  for (const f of data.customFields) {
    rows.push({ field: f.label, value: f.value });
  }

  sheet.addRows(rows);

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${data.name.replace(/[^a-z0-9]/gi, "_")}_stats.xlsx"`,
    },
  });
}
