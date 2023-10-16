import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  isAuthenticatedAsGuest: false,
  login: (sessionId) => {},
  logout: () => {},
  loginAsGuest: (guestSessionId) => {},
  logoutAsGuest: () => {},
  updateAuthenticationStatus: () => {}
});

export function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticatedAsGuest, setIsAuthenticatedAsGuest] = useState(false);

  useEffect(() => {
    console.log("Auth effect running");
    setIsAuthenticated(Boolean(sessionStorage.getItem("session_id")));
    setIsAuthenticatedAsGuest(Boolean(sessionStorage.getItem("guest_session_id")));
  }, [setIsAuthenticated, setIsAuthenticatedAsGuest]);

  function login(sessionId) {
    sessionStorage.setItem("session_id", sessionId);
    sessionStorage.removeItem("request_token");
    setIsAuthenticated(true);
  }

  function logout() {
    sessionStorage.removeItem("session_id");
    sessionStorage.removeItem("guest_session_id");
    sessionStorage.removeItem("request_token");
    setIsAuthenticated(false);
    setIsAuthenticatedAsGuest(false);
  }

  function loginAsGuest(guestSessionId) {
    sessionStorage.setItem("guest_session_id", guestSessionId);
    setIsAuthenticatedAsGuest(true);
  }

  function logoutAsGuest() {
    sessionStorage.removeItem("guest_session_id");
    setIsAuthenticated(false);
  }

  function updateAuthenticationStatus(){
    setIsAuthenticated(Boolean(sessionStorage.getItem("session_id")));
    setIsAuthenticatedAsGuest(Boolean(sessionStorage.getItem("guest_session_id")));
  }


  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAuthenticatedAsGuest, login, logout, loginAsGuest, logoutAsGuest, updateAuthenticationStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
