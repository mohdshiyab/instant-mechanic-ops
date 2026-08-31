import { SSEEventPayload } from "./types";

type SSEClient = {
  id: string;
  controller: ReadableStreamDefaultController;
};

class SSEHub {
  private clients: Map<string, SSEClient> = new Map();

  addClient(id: string, controller: ReadableStreamDefaultController) {
    this.clients.set(id, { id, controller });
  }

  removeClient(id: string) {
    this.clients.delete(id);
  }

  broadcast(event: SSEEventPayload) {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);

    this.clients.forEach((client, id) => {
      try {
        client.controller.enqueue(encoded);
      } catch (err) {
        console.error(`Failed to send SSE to client ${id}:`, err);
        this.clients.delete(id);
      }
    });
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

const globalForSSE = globalThis as unknown as {
  sseHub: SSEHub | undefined;
};

export const sseHub = globalForSSE.sseHub ?? new SSEHub();

if (process.env.NODE_ENV !== "production") {
  globalForSSE.sseHub = sseHub;
}
