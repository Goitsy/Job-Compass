import { Route, Routes } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ThemeContextProvider } from "./state/ThemeContext";
import Navbar from "./components/NavBar";
import HeroSection from "./components/HeroSection";

const App = () => {
  return (
    <ThemeContextProvider>
      <Navbar />
      <HeroSection />
    </ThemeContextProvider>
  );
};

export default App;
