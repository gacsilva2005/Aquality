import { User } from 'lucide-react';
import logo from '../../assets/icone_petala.png';

interface HeaderPageWebProps {
    usuario?: any;
    onPerfilClick: () => void;
}

export function HeaderPageWeb({ usuario, onPerfilClick }: HeaderPageWebProps) {
    return (
        <header className="hydro-header">
            <div className="hydro-header-logo-container">
                <img src={logo} alt="Logo HydraSense" className="hydro-header-logo-img" />
                <h1 className="hydro-header-title">HydraSense</h1>
            </div>
            <nav>
                <ul>
                    <li><input type="text"
                        placeholder="Buscar..."
                        className="hydro-header-search" />
                    </li>
                    <li onClick={onPerfilClick}><User size={18} /> Perfil</li>
                </ul>
            </nav>
        </header>
    )
}