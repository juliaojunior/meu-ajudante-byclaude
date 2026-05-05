import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export type Schedule = {
  remedioId: string;
  nome: string; // medicine name
  dose: string; // dosage text
  horario: string; // "HH:MM" 24h format
  refeicao: string; // "café da manhã" etc
};

const SUB_PREFIX = "sub:";
const SCHED_PREFIX = "sched:";
const SENT_PREFIX = "sent:";

function subKey(userId: string): string {
  return `${SUB_PREFIX}${userId}`;
}

function schedKey(userId: string): string {
  return `${SCHED_PREFIX}${userId}`;
}

function sentKey(userId: string, key: string): string {
  return `${SENT_PREFIX}${userId}:${key}`;
}

export async function saveSubscription(
  userId: string,
  subscription: PushSubscriptionJSON,
  schedules: Schedule[]
): Promise<void> {
  await Promise.all([
    redis.set(subKey(userId), JSON.stringify(subscription)),
    redis.set(schedKey(userId), JSON.stringify(schedules)),
  ]);
}

export async function getSubscription(
  userId: string
): Promise<PushSubscriptionJSON | null> {
  const raw = await redis.get<string | PushSubscriptionJSON>(subKey(userId));
  if (raw === null || raw === undefined) return null;
  // Upstash auto-parses JSON when possible — handle both cases.
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as PushSubscriptionJSON;
    } catch {
      return null;
    }
  }
  return raw;
}

export async function getSchedules(userId: string): Promise<Schedule[]> {
  const raw = await redis.get<string | Schedule[]>(schedKey(userId));
  if (raw === null || raw === undefined) return [];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Schedule[]) : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
}

export async function getAllUserIds(): Promise<string[]> {
  // NOTE: KEYS scan is fine for v1 with a handful of users.
  // For production scale, replace with a SET index of user IDs.
  const keys = await redis.keys(`${SUB_PREFIX}*`);
  return keys.map((k) => k.slice(SUB_PREFIX.length));
}

export async function deleteSubscription(userId: string): Promise<void> {
  await redis.del(subKey(userId), schedKey(userId));
}

export async function markSent(
  userId: string,
  key: string
): Promise<boolean> {
  // SET key value NX EX 86400 — returns "OK" if newly set, null if it already existed.
  const result = await redis.set(sentKey(userId, key), "1", {
    nx: true,
    ex: 86400,
  });
  return result === "OK";
}
