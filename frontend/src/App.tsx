import { Route, Routes } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ThemeContextProvider } from "./state/ThemeContext";
import Navbar from "./components/NavBar";

const App = () => {
  return (
    <ThemeContextProvider>
      <Navbar />
    </ThemeContextProvider>
  );
};

export default App;
