import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

const login = (data) => {
  setUser(data.user); // salva apenas o usuário
  localStorage.setItem("user", JSON.stringify(data.user));

  if (data.token) {
    localStorage.setItem("token", data.token); // salva o token
  } else {
    console.warn("Token não encontrado no backend!");
  }
};
 

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
