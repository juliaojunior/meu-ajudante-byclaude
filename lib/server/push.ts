import webpush from "web-push";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;

if (VAPID_PUBLIC && VAPID_PRIVATE && VAPID_SUBJECT) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

export type PushPayload = {
  title: string;
  body: string;
  tag?: string;
  url?: string;
};

export type PushResult = {
  ok: boolean;
  gone: boolean;
};

export async function sendPush(
  subscription: PushSubscriptionJSON,
  payload: PushPayload
): Promise<PushResult> {
  // The DOM lib's PushSubscriptionJSON has optional fields, but web-push needs
  // a concrete shape. Cast through unknown and trust the caller stored a valid one.
  const sub = subscription as unknown as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return { ok: true, gone: false };
  } catch (err: unknown) {
    const status =
      typeof err === "object" && err !== null && "statusCode" in err
        ? (err as { statusCode?: number }).statusCode
        : undefined;
    console.error("[sendPush] error status=%s err=%s", status, String(err));
    if (status === 404 || status === 410) {
      return { ok: false, gone: true };
    }
    return { ok: false, gone: false };
  }
}
