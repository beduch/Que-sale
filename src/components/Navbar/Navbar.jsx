import { Link, useLocation } from 'react-router-dom';

import {
  HomeIcon,
  SearchIcon,
  BookmarkIcon,
  MailIcon,
  UserIcon
} from '../../icons';

import './Navbar.css';

import logoUrl from '../../assets/Logo_QueSale.png';

export default function Navbar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <nav className={`bottom-nav ${collapsed ? 'collapsed' : ''}`}>
      <div className="nav-logo desktop-only">
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#14b8a6',
            fontWeight: '800',
            fontSize: collapsed ? '0' : '1.4rem'
          }}
        >
          <img
            src={logoUrl}
            alt="Que-Sale Logo"
            style={{
              width: collapsed ? '36px' : '40px',
              height: collapsed ? '36px' : '40px',
              borderRadius: '10px'
            }}
          />

          {!collapsed && <span>Que-Sale</span>}
        </Link>

        <button
          onClick={onToggle}
          className="sidebar-toggle"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? '>>' : '<<'}
        </button>
      </div>

      <div className="nav-links">
        <Link
          to="/"
          className={
            location.pathname === '/'
              ? 'nav-item active'
              : 'nav-item'
          }
        >
          <HomeIcon size={24} />
          <span className="nav-label desktop-only">Inicio</span>
        </Link>

        <Link
          to="/buscar"
          className={
            location.pathname === '/buscar'
              ? 'nav-item active'
              : 'nav-item'
          }
        >
          <SearchIcon size={24} />
          <span className="nav-label desktop-only">Buscar</span>
        </Link>

        <Link
          to="/deseos"
          className={
            location.pathname === '/deseos'
              ? 'nav-item active'
              : 'nav-item'
          }
        >
          <BookmarkIcon size={24} />
          <span className="nav-label desktop-only">Guardados</span>
        </Link>

        <Link
          to="/contacto"
          className={
            location.pathname === '/contacto'
              ? 'nav-item active'
              : 'nav-item'
          }
        >
          <MailIcon size={24} />
        </Link>

        <Link
          to="/perfil"
          className={
            location.pathname === '/perfil'
              ? 'nav-item active'
              : 'nav-item'
          }
        >
          <UserIcon size={24} />
          <span className="nav-label desktop-only">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}