import { deleteSubscription } from "@/lib/server/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = {
  userId?: unknown;
};

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

  await deleteSubscription(body.userId);

  return Response.json({ ok: true });
}
