import { Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

const largeur = 250;

export default function Sidebar() {

  return (

    <Drawer
      variant="permanent"
      sx={{
        width: largeur,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: largeur,
          boxSizing: "border-box",
          background: "#0d47a1",
          color: "white",
        },
      }}
    >

      <Toolbar />

      <List>

        <ListItemButton component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton component={Link} to="/motos">
          <ListItemText primary="Gestion des motos" />
        </ListItemButton>

        <ListItemButton component={Link} to="/stock">
          <ListItemText primary="Gestion du stock" />
        </ListItemButton>

        <ListItemButton component={Link} to="/vente-comptant">
          <ListItemText primary="Vente au comptant" />
        </ListItemButton>

        <ListItemButton component={Link} to="/vente-credit">
          <ListItemText primary="Vente à crédit" />
        </ListItemButton>

        <ListItemButton component={Link} to="/paiements">
          <ListItemText primary="Paiements" />
        </ListItemButton>

        <ListItemButton component={Link} to="/clients">
          <ListItemText primary="Clients" />
        </ListItemButton>

        <ListItemButton component={Link} to="/bus">
          <ListItemText primary="Location des bus" />
        </ListItemButton>

        <ListItemButton component={Link} to="/comptabilite">
          <ListItemText primary="Comptabilité" />
        </ListItemButton>

        <ListItemButton component={Link} to="/rapports">
          <ListItemText primary="Rapports" />
        </ListItemButton>

        <ListItemButton component={Link} to="/utilisateurs">
          <ListItemText primary="Utilisateurs" />
        </ListItemButton>

        <ListItemButton component={Link} to="/parametres">
          <ListItemText primary="Paramètres" />
        </ListItemButton>

      </List>

    </Drawer>

  );
}