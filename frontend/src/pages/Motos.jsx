import { useEffect, useState } from "react";
import { getMotos } from "../services/motos";

export default function Motos() {

    const [motos, setMotos] = useState([]);

    useEffect(() => {
        chargerMotos();
    }, []);

    async function chargerMotos() {
        try {
            const res = await getMotos();
            setMotos(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div style={{ padding: 30 }}>

            <h1>Gestion des motos</h1>

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: 20
                }}
            >

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Marque</th>
                        <th>Modèle</th>
                        <th>Châssis</th>
                        <th>Prix Vente</th>
                    </tr>

                </thead>

                <tbody>

                    {motos.map((moto) => (

                        <tr key={moto.id}>

                            <td>{moto.id}</td>

                            <td>{moto.marque?.nom}</td>

                            <td>{moto.modele}</td>

                            <td>{moto.numeroChassis}</td>

                            <td>{moto.prixVente}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}