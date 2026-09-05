import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f5f5" }}>

      <Sidebar />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <Header />

        <Box sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>

      </Box>

    </Box>
  );
}