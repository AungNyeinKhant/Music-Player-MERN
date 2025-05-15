import { io, Socket } from "socket.io-client";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private readonly SOCKET_URL = "http://localhost:3000"; // Update this with your backend URL
  private role: "admin" | "user" | "artist" = "user";
  private authToken: string | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(role: "admin" | "user" | "artist" = "user"): void {
    this.role = role;
    if (!this.socket) {
      const namespace = this.role === "admin" ? "/admin" : "/user";
      this.socket = io(this.SOCKET_URL + namespace, {
        transports: ["websocket"],
        autoConnect: true,
        auth: this.authToken ? { token: this.authToken  } : undefined,
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public emit(event: string, data?: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
    if (this.socket) {
      this.disconnect();
      this.connect(this.role);
    }
  }
}

export default SocketService.getInstance();
