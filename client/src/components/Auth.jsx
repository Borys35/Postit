import React, { useState, useEffect } from 'react';

export const AuthContext = React.createContext({});

export default function Auth({ children }) {
  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch('/api/users/verify', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUserId(data._id))
      .catch(() => setUserId(null))
      .then(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
