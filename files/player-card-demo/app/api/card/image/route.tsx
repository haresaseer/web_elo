import { ImageResponse } from "next/og";
import {
  validatePlayerCardInput,
  isTemplateId,
} from "@/app/lib/players";
import {
  TEMPLATE_COMPONENTS,
  TEMPLATE_DIMENSIONS,
} from "@/app/lib/templates";

export const runtime = "edge";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response("Invalid request body", { status: 400 });
  }

  const { template, ...playerData } = body as { template?: string };

  if (typeof template !== "string" || !isTemplateId(template)) {
    return new Response("Invalid or missing template", { status: 400 });
  }

  const validated = validatePlayerCardInput(playerData);
  if (!validated.ok) {
    return new Response(validated.error, { status: 400 });
  }

  const Template = TEMPLATE_COMPONENTS[template];
  const dimensions = TEMPLATE_DIMENSIONS[template];

  return new ImageResponse(<Template data={validated.value} />, dimensions);
}
