import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        backgroundColor: "#1565c0",
      }}
    >
      <Toolbar>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          ETS AZINNON ET FILS
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography>
            Administrateur
          </Typography>

          <Avatar>
            A
          </Avatar>

        </Box>

      </Toolbar>
    </AppBar>
  );
}