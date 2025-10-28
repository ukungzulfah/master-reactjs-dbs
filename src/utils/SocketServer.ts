export default function createWebSocket(url: string, onMessage: (data: any) => void) {
    let socket: WebSocket | null = null;
    let retryTimeout: NodeJS.Timeout;
  
    const connect = () => {
      console.log(`[WebSocket] Connecting to ${url}...`);
      socket = new WebSocket(url);
  
      socket.onopen = () => {
        console.log("[WebSocket] Connected ✅");
      };
  
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error("[WebSocket] Failed to parse message", e);
        }
      };
  
      socket.onerror = (error) => {
        console.error("[WebSocket] Error ❌", error);
      };
  
      socket.onclose = () => {
        console.warn("[WebSocket] Disconnected. Retrying in 5 seconds...");
        retryTimeout = setTimeout(connect, 5000);
      };
    };
  
    connect();
  
    return {
      send: (data: any) => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        } else {
          console.warn("[WebSocket] Cannot send, not connected.");
        }
      },
      close: () => {
        clearTimeout(retryTimeout);
        socket?.close();
      }
    };
  }