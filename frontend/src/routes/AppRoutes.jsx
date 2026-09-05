import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Motos from "../pages/Motos";
import Stock from "../pages/Stock";
import VenteComptant from "../pages/VenteComptant";
import VenteCredit from "../pages/VenteCredit";
import Paiements from "../pages/Paiements";
import Clients from "../pages/Clients";
import Bus from "../pages/Bus";
import Comptabilite from "../pages/Comptabilite";
import Rapports from "../pages/Rapports";
import Utilisateurs from "../pages/Utilisateurs";
import Parametres from "../pages/Parametres";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/motos" element={<Motos />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/vente-comptant" element={<VenteComptant />} />
            <Route path="/vente-credit" element={<VenteCredit />} />
            <Route path="/paiements" element={<Paiements />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/bus" element={<Bus />} />
            <Route path="/comptabilite" element={<Comptabilite />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/parametres" element={<Parametres />} />
        </Routes>
    );
}