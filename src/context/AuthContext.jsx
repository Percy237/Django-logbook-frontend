import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api";
import { getAuthenticatedUserDetails } from "../api";
import { useQuery } from "react-query";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const fetchAuthState = async () => {
  const isAuthenticated = await auth();
  return isAuthenticated;
};

export const AuthProvider = ({ children }) => {
  

  const {
    data: isAuthorized,
    isLoading,
    isError,
    refetch,
  } = useQuery("auth", fetchAuthState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoading && !isError) {
      setIsAuthenticated(isAuthorized);
    }
  }, [isAuthorized, isLoading, isError]);

  const value = {
    isAuthenticated,
    refetchAuthState: refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
