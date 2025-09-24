import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark" | "system";

type ThemeContextType = {
  theme: ThemeType;              // user’s chosen setting
  resolvedTheme: "light" | "dark"; // actual theme applied
  setTheme: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [theme, setTheme] = useState<ThemeType>("system");

  // load saved theme on startup
  useEffect(() => {
    AsyncStorage.getItem("theme").then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setTheme(stored);
      }
    });
  }, []);

  // persist choice
  useEffect(() => {
    AsyncStorage.setItem("theme", theme);
  }, [theme]);

  const resolvedTheme = theme === "system" ? deviceScheme ?? "light" : theme;

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
