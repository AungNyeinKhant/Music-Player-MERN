import { createContext, ReactNode, useContext, useState } from "react";
import { AuthContextType, UserAuth } from "../types";

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAuth | null>({
    id: "",
    role: "",
    image: "",
    name: "",
  });

  // Create value object
  const value: AuthContextType = {
    user,
    setUser,
    // Add other properties and methods
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
