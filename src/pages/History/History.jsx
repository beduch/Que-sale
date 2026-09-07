import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { CalendarIcon, MapPinIcon, SearchIcon, XIcon } from '../../icons';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('que-sale-history') || '[]');
    setHistory(savedHistory);
  }, []);

    const [showConfirm, setShowConfirm] = useState(false);

    const clearHistory = () => {
      localStorage.removeItem('que-sale-history');
      setHistory([]);
      setShowConfirm(false);
    };

  useEffect(() => {
  setCurrentPage(1);
  }, [searchQuery]);

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
          <div className="avatar-placeholder">MP</div>
        </div>
        <div className="profile-info">
          <h2>Mi Perfil</h2>
          <p>mi.perfil@quesale.com</p>
        </div>
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
              <button 
                type="button" 
                className="history-search-clear" 
                onClick={() => setSearchQuery('')}
              >
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
                      {event.timeStr && ` • ${event.timeStr.slice(0, 5)}`}
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
            {totalPages > 1 && (
              <div className="history-pagination">
                <button
                  className="history-page-btn"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                <span className="history-page-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="history-page-btn"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </ul>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>¿Limpiar historial?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>
              <button className="confirm-delete" onClick={clearHistory}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}