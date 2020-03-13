import React, { useState, useEffect } from 'react';

export const AuthContext = React.createContext({});

export default function Auth({ children }) {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/users/verify', { credentials: 'include' })
      .then(res => res.json())
      .then(setUser)
      .catch(() => setUser(null))
      .then(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
