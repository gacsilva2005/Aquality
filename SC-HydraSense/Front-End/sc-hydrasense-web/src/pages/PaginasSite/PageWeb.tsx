import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { HeaderPageWeb } from "./HeaderPageWeb";
import { SideBarPageWeb } from "./SideBarPageWeb";
import { SideBarPagePerfil } from "./SideBarPagePerfil";
import "./PageWeb.css";

export function PageWeb() {
    const [usuario, setUsuario] = useState<any>(null);
    const [perfilAberto, setPerfilAberto] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/auth/user", {
            method: "GET",
            credentials: "include"
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Usuário não autenticado");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Usuário Google:", data);
                setUsuario(data);
            })
            .catch((err) => {
                console.error("Erro ao buscar usuário:", err);
            });
    }, []);

    return (
        <div className="pageweb">
            <HeaderPageWeb
                usuario={usuario}
                onPerfilClick={() => setPerfilAberto(true)}
            />
            <SideBarPageWeb />

            <main className="pageweb__main">
                <Outlet />
            </main>

            <SideBarPagePerfil
                aberto={perfilAberto}
                onFechar={() => setPerfilAberto(false)}
            />
        </div>
    );
}