import React, { createContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Define the ThemeContext interface
interface ThemeContextProps {
  mode: "light" | "dark";
  toggleMode: () => void;
}

// Create the ThemeContext
const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  toggleMode: () => {},
});

// ThemeContextProvider to wrap the app
const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            default: mode === "light" ? "#ffffff" : "#121212",
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
export { ThemeContext };
export default ThemeContextProvider;
