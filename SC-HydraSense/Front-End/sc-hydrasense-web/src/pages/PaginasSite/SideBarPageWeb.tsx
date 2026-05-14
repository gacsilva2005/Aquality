import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
    { label: 'Início', path: '/PageWeb' },
    { label: 'Dashboard', path: '/PageWeb/dashboard' },
    { label: 'Atletas', path: '/PageWeb/atletas' },
    { label: 'Equipes', path: '/PageWeb/equipes' }
];

export function SideBarPageWeb() {
    const navigate = useNavigate();
    const location = useLocation();

    const checkIsActive = (path: string) => {
        if (path === '/PageWeb') {
            return location.pathname === '/PageWeb' || location.pathname === '/PageWeb/';
        }
        return location.pathname.includes(path);
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <aside className="hydro-sidebar">
            <nav>
                <ul className="hydro-sidebar-menu">
                    {menuItems.map((item) => (
                        <li
                            key={item.label}
                            className={checkIsActive(item.path) ? 'active' : ''}
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="hydro-sidebar-footer">
                <button type="button" className="btn-logout" onClick={handleLogout}>
                    Sair da Conta
                </button>
            </div>
        </aside>
    );
}