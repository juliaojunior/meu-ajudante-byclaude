import {
  deleteSubscription,
  getAllUserIds,
  getSchedules,
  getSubscription,
  markSent,
} from "@/lib/server/storage";
import { sendPush } from "@/lib/server/push";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  const provided = request.headers.get("x-cron-secret");
  if (!secret || provided !== secret) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const time = `${get("hour")}:${get("minute")}`;

  let userIds: string[];
  try {
    userIds = await getAllUserIds();
  } catch (err) {
    console.error("[cron-tick] Redis error on getAllUserIds:", err);
    return Response.json({ error: "redis_unavailable", detail: String(err) }, { status: 500 });
  }

  let processed = 0;

  for (const userId of userIds) {
    try {
      const [subscription, schedules] = await Promise.all([
        getSubscription(userId),
        getSchedules(userId),
      ]);
      if (!subscription) continue;

      const due = schedules.filter((s) => s.horario === time);
      if (due.length === 0) continue;

      for (const schedule of due) {
        const key = `${date}:${time}:${schedule.remedioId}`;
        const fresh = await markSent(userId, key);
        if (!fresh) continue;

        const payload = {
          title: `Hora do ${schedule.nome}`,
          body: `${schedule.dose} — ${schedule.refeicao}`,
          tag: key,
          url: "/",
        };

        const result = await sendPush(subscription, payload);
        if (result.ok) processed += 1;

        if (result.gone) {
          await deleteSubscription(userId);
          break;
        }
      }
    } catch (err) {
      console.error(`[cron-tick] Error processing user ${userId}:`, err);
    }
  }

  return Response.json({ ok: true, time, processed });
}
