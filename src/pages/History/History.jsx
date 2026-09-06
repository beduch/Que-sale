import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { CalendarIcon, MapPinIcon, SearchIcon, XIcon } from '../../icons';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('que-sale-history') || '[]');
    setHistory(savedHistory);
  }, []);

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
        <h3 className="history-title">Historial de Eventos Visitados</h3>
        
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
            {results.map((event) => (
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
          </ul>
        )}
      </div>
    </div>
  );
}