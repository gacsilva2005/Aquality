import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";

import { Register } from "./pages/Login/Register";
import { Identifier } from "./pages/Login/Identifier";
import { Team } from "./pages/Login/Team";
import { Athlete } from "./pages/Login/Athlete";

import { PageWeb } from "./pages/PaginasSite/PageWeb";
import { Atletas } from "./pages/PaginasSite/Atletas";
import { Dashboard } from "./pages/PaginasSite/Dashboard";
import { InicioWeb } from "./pages/PaginasSite/InicioWeb";
import { Equipes } from "./pages/PaginasSite/Equipes";
import { RelatorioEquipe } from "./pages/PaginasSite/RelatorioEquipe";
import { Relatorios } from "./pages/PaginasSite/Relatorios";
import { Configuracoes } from "./pages/PaginasSite/Configuracoes";
import { Recovery } from "./pages/Login/Recovery";
import { Code } from "./pages/Login/Code";
import { Password } from "./pages/Login/Password";
import { Number } from "./pages/Login/Number";
import { Confirmation } from './pages/Login/Confirmation';

function App() {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/identificador" element={<Identifier />} />
            <Route path="/equipe" element={<Team />} />
            <Route path="/atleta" element={<Athlete />} />
            <Route path="/recuperar-senha" element={<Recovery />} />
            <Route path="/codigo" element={<Code />} />
            <Route path="/atualizar-senha" element={<Password />} />
            <Route path="/recuperar-celular" element={<Number />} />
            <Route path="/confirmacao" element={<Confirmation />} />

            {/* Rotas do Painel Web */}
            <Route path="/PageWeb" element={<PageWeb />}>
                <Route index element={<InicioWeb />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="atletas" element={<Atletas />} />
                <Route path="equipes" element={<Equipes />} />
                <Route path="equipes/relatorio" element={<RelatorioEquipe />} />
                <Route path="relatorios" element={<Relatorios />} />
                <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
        </Routes>
    );
}

export default App;