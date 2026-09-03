import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, BookmarkIcon, BellIcon, UserIcon } from '../../icons';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}>
        <HomeIcon size={24} />
      </Link>

      <Link to="/buscar" className={location.pathname === '/buscar' ? 'nav-item active' : 'nav-item'}>
        <SearchIcon size={24} />
      </Link>

      <Link to="/deseos" className={location.pathname === '/deseos' ? 'nav-item active' : 'nav-item'}>
        <BookmarkIcon size={24} />
      </Link>

      <Link to="/contacto" className={location.pathname === '/contacto' ? 'nav-item active' : 'nav-item'}>
        <BellIcon size={24} />
      </Link>

      <Link to="/perfil" className="nav-item">
        <UserIcon size={24} />
      </Link>
    </nav>
  );
}