import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, SearchIcon, XIcon } from '../../icons';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('que-sale-history') || '[]');
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const clearHistory = () => {
    localStorage.removeItem('que-sale-history');
    setHistory([]);
    setShowConfirm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('que-sale-user');
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha a confirmar';
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString('es-AR', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const results = searchQuery
    ? history.filter(event => event.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : history;

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="profile-container">
      <h1 className="profile-title"><span>Mi</span> Perfil</h1>

      <div className="profile-header-card">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {(localStorage.getItem('que-sale-user') || 'MP').slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h2>{localStorage.getItem('que-sale-user') || 'Mi Perfil'}</h2>
          <p>{localStorage.getItem('que-sale-email') || 'Bienvenido a Qué Sale'}</p>
        </div>
          <button className="logout-btn" onClick={() => setShowLogoutConfirm(true)}>
            Cerrar sesión
          </button>
      </div>

      <div className="history-section">
        <div className="history-section-header">
          <h3 className="history-title">Historial de Eventos Visitados</h3>
          {history.length > 0 && (
            <button className="history-clear-btn" onClick={() => setShowConfirm(true)}>
              Limpiar
            </button>
          )}
        </div>

        {history.length > 0 && (
          <div className="history-search-wrapper">
            <SearchIcon size={18} color="#999" />
            <input
              type="text"
              placeholder="Buscar en tu historial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="history-search-clear" onClick={() => setSearchQuery('')}>
                <XIcon size={16} />
              </button>
            )}
          </div>
        )}

        {history.length === 0 ? (
          <div className="history-empty">
            <p>Aún no has visitado ningún evento.</p>
            <button onClick={() => navigate('/buscar')} className="history-explore-btn">
              Explorar eventos
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="history-empty">
            <p>No se encontraron resultados para "{searchQuery}".</p>
          </div>
        ) : (
          <ul className="history-list">
            {paginatedResults.map((event) => (
              <li
                key={event.id}
                className="history-card"
                onClick={() => navigate(`/detalle/${event.id}`)}
              >
                {event.image ? (
                  <img src={event.image} alt={event.name} className="history-card-img" />
                ) : (
                  <div className="history-card-img-placeholder">Sin imagen</div>
                )}
                <div className="history-card-info">
                  <h4 className="history-card-name">{event.name}</h4>
                  <p className="history-card-meta">
                    <span className="history-card-meta-item">
                      <CalendarIcon size={13} />
                      {formatDate(event.dateStr)}
                      {event.timeStr && ` • ${event.timeStr.slice(0, 5)} hs`}
                    </span>
                    <span className="history-card-meta-item">
                      <MapPinIcon size={13} />
                      {event.venueName}
                    </span>
                  </p>
                  <div className="history-card-bottom">
                    <span className="history-card-price">
                      {event.price ? `$${event.price.toFixed(2)}` : 'Consultar'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="history-pagination">
            <button className="history-page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
              ← Anterior
            </button>
            <span className="history-page-info">{currentPage} / {totalPages}</span>
            <button className="history-page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>¿Limpiar historial?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button className="confirm-delete" onClick={clearHistory}>Limpiar</button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="confirm-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>¿Cerrar sesión?</h3>
            <p>¿Seguro que querés salir de tu cuenta?</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowLogoutConfirm(false)}>
                Cancelar
              </button>
              <button className="confirm-delete" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}