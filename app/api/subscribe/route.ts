import { saveSubscription, type Schedule } from "@/lib/server/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  userId?: unknown;
  subscription?: unknown;
  schedules?: unknown;
};

function isValidSubscription(
  v: unknown
): v is PushSubscriptionJSON & { endpoint: string } {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as { endpoint?: unknown };
  return typeof obj.endpoint === "string" && obj.endpoint.length > 0;
}

function isValidSchedule(v: unknown): v is Schedule {
  if (typeof v !== "object" || v === null) return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.remedioId === "string" &&
    typeof s.nome === "string" &&
    typeof s.dose === "string" &&
    typeof s.horario === "string" &&
    typeof s.refeicao === "string"
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (typeof body.userId !== "string" || body.userId.length === 0) {
    return Response.json(
      { error: "userId must be a non-empty string" },
      { status: 400 }
    );
  }

  if (!isValidSubscription(body.subscription)) {
    return Response.json(
      { error: "subscription.endpoint is required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.schedules)) {
    return Response.json(
      { error: "schedules must be an array" },
      { status: 400 }
    );
  }

  const schedules: Schedule[] = [];
  for (const item of body.schedules) {
    if (!isValidSchedule(item)) {
      return Response.json(
        { error: "invalid schedule entry" },
        { status: 400 }
      );
    }
    schedules.push(item);
  }

  await saveSubscription(body.userId, body.subscription, schedules);

  return Response.json({ ok: true });
}
