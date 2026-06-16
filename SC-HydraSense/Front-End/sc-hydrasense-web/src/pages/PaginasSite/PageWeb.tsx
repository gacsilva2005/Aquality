import { useState } from "react";
import { Outlet } from "react-router-dom";

import { HeaderPageWeb } from "./HeaderPageWeb";
import { SideBarPageWeb } from "./SideBarPageWeb";
import { SideBarPagePerfil } from "./SideBarPagePerfil";
import { useUser } from "../../context/UserContext";
import "./PageWeb.css";

export function PageWeb() {
    const { user } = useUser();
    const [perfilAberto, setPerfilAberto] = useState(false);
    const [sidebarAberta, setSidebarAberta] = useState(false);

    return (
        <div className="pageweb">
            <HeaderPageWeb
                usuario={user}
                onPerfilClick={() => setPerfilAberto(true)}
                onMenuClick={() => setSidebarAberta(true)}
            />
            <SideBarPageWeb
                aberta={sidebarAberta}
                onFechar={() => setSidebarAberta(false)}
            />

            {/* Overlay para fechar sidebar ao clicar fora */}
            {sidebarAberta && (
                <div
                    className="sidebar-mobile-overlay"
                    onClick={() => setSidebarAberta(false)}
                />
            )}

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