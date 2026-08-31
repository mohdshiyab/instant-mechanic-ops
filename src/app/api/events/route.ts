import { sseHub } from "@/lib/sse";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const stream = new ReadableStream({
    start(controller) {
      sseHub.addClient(clientId, controller);

      // Send initial connection greeting
      const initialPayload = {
        type: "CONNECTED",
        clientId,
        timestamp: new Date().toISOString(),
        message: "Connected to Instant Mechanic Live Operations Stream",
      };
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(initialPayload)}\n\n`));
    },
    cancel() {
      sseHub.removeClient(clientId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
