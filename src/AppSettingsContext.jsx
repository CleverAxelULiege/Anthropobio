import React, { createContext, useState, useEffect, useContext } from "react";

const EXPERT_MODE_KEY = "expert_mode";
const PRIMATE_ID_KEY = "primate_id";

const AppSettingsContext = createContext({
  expertMode: true,
  setExpertMode: () => {},
  primateId: null,
  setPrimateId: () => {},
});

export function AppSettingsProvider({ children }) {
  const [expertMode, setExpertMode] = useState(() => {
    const stored = localStorage.getItem(EXPERT_MODE_KEY);
    return stored === "true";
  });

  const [primateId, setPrimateId] = useState(() => {
    return localStorage.getItem(PRIMATE_ID_KEY);
  });

  useEffect(() => {
    localStorage.setItem(EXPERT_MODE_KEY, expertMode);
  }, [expertMode]);

  useEffect(() => {
    if (primateId === null || primateId === undefined) {
      localStorage.removeItem(PRIMATE_ID_KEY);
    } else {
      localStorage.setItem(PRIMATE_ID_KEY, primateId);
    }
  }, [primateId]);

  return (
    <AppSettingsContext.Provider
      value={{ expertMode, setExpertMode, primateId, setPrimateId }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
