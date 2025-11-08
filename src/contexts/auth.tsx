import { createContext, useContext, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getCurrentUserFn } from "@/actions/getter.auth";
import type { SafeUser, UserStatus } from "@/schemas/db/schema";
import { useQuery } from "@tanstack/react-query";

type AuthContextType = {
  user: (SafeUser & UserStatus) | null;
  isLoading: boolean;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getCurrentUser = useServerFn(getCurrentUserFn);
  const query = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(),
  });

  return (
    <AuthContext.Provider
      value={{
        user: query.data ?? null,
        isLoading: query.isLoading,
        refetch: query.refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
