import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  auth: string | null;
  setAuth: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/verify`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            setAuth(data);
          } else {
            localStorage.removeItem("token");
            setAuth(null);
          }
        } catch (error) {
          localStorage.removeItem("token");
          setAuth(null);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
