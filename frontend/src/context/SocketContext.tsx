import React, { createContext, useContext, useEffect, ReactNode } from "react";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user?.id && auth?.user?.role) {
      console.log("Connecting to socket with role:", auth.user.role);
      socketService.connect(auth.user.role);
      console.log("socket connected");
      // Cleanup on unmount
      return () => {
        socketService.disconnect();
        console.log("socket disconnected");
      };
    }
  }, [auth?.user]);

  const value: SocketContextType = {
    isConnected: !!socketService.getSocket()?.connected,
    emit: (event: string, data?: any) => socketService.emit(event, data),
    on: (event: string, callback: (data: any) => void) =>
      socketService.on(event, callback),
    off: (event: string) => socketService.off(event),
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
