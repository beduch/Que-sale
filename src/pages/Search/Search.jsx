import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../../api/client';
import './Search.css';
import { SearchIcon, XIcon, BookmarkIcon, CalendarIcon, MapPinIcon } from '../../icons';
import SaveEventModal from '../../components/SaveEventModal/SaveEventModal';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [eventToSave, setEventToSave] = useState(null);
  const navigate = useNavigate();

  const search = async (pageNumber = 0) => {
    if (!keyword && !category && !city) {
      setError('Completá al menos un filtro para buscar.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const params = { size: 10, page: pageNumber };
      if (keyword) params.keyword = keyword;
      if (category) params.classificationName = category;
      if (city) params.city = city;

      const data = await fetchFromApi('/events.json', params);
      const eventList = data._embedded?.events || [];
      setEvents(eventList);
      setPage(pageNumber);
      setTotalPages(data.page?.totalPages || 0);
    } catch {
      setError('Error al buscar eventos. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    search(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha a confirmar';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-AR', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
  <div className="search-container">
    <h1 className="search-title"><span>Buscar</span> Eventos</h1>
    
    <form className="search-form" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <SearchIcon size={18} color="#999" />
        <input
          type="text"
          placeholder="¿A dónde vas? Buscá eventos..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button type="button" className="search-clear" onClick={() => setKeyword('')}><XIcon size={16} /></button>
        )}
      </div>

<div className="search-filters">
  <div className="filter-chip-teal">
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">Categoría ▾</option>
      <option value="Music">Música</option>
      <option value="Sports">Deportes</option>
      <option value="Arts & Theatre">Teatro y Arte</option>
      <option value="Family">Familia</option>
    </select>
  </div>

  <div className="filter-chip-outline">
    <input
      type="text"
      placeholder="Ciudad ▾"
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />
  </div>
</div>

      <button type="submit" className="search-btn" disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>

    {error && <p className="search-error">{error}</p>}

    {events.length > 0 && (
      <>
        <div className="search-results-header">
          <p className="search-count">{events.length} Eventos encontrados</p>
          <select className="search-sort">
            <option>Popularidad ▾</option>
            <option>Fecha</option>
            <option>Precio</option>
          </select>
        </div>

        <ul className="events-list">
          {events.map((event) => {
            const image = event.images?.find(img => img.ratio === '16_9' && img.width > 300);
            const venue = event._embedded?.venues?.[0];
            const price = event.priceRanges?.[0];
            const dateStr = event.dates?.start?.localDate;
            const timeStr = event.dates?.start?.localTime?.slice(0, 5);

            return (
              <li key={event.id} className="event-card">
                {image && (
                  <img src={image.url} alt={event.name} className="event-card-img" />
                )}
                <div className="event-card-info">
                  <div className="event-card-top">
                    <h3 className="event-card-name">{event.name}</h3>
                    <button className="event-card-bookmark" aria-label="Guardar evento" onClick={(e) => {e.stopPropagation();setEventToSave(event);}}><BookmarkIcon size={16} /></button>
                  </div>
                  <p className="event-card-meta">
                    <span className="event-card-meta-date">
                      <CalendarIcon size={13} />
                      {formatDate(dateStr)}{timeStr && ` • ${timeStr}`}
                    </span>
                    {venue && (
                      <span className="event-card-meta-venue">
                        <MapPinIcon size={13} />
                        {venue.city?.name || venue.name}
                      </span>
                    )}
                  </p>
                  <div className="event-card-bottom">
                    {price ? (
                      <p className="event-card-price">${price.min?.toFixed(2)}</p>
                    ) : (
                      <p className="event-card-price" style={{color: '#888', fontWeight: 500}}>—</p>
                    )}
                    <button
                      className="event-card-detail-btn"
                      onClick={() => navigate(`/detalle/${event.id}`)}
                    >
                      Detalles
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="pagination">
          <button onClick={() => search(page - 1)} disabled={page === 0} className="page-btn">
            ← Anterior
          </button>
          <span>Página {page + 1} de {totalPages}</span>
          <button onClick={() => search(page + 1)} disabled={page + 1 >= totalPages} className="page-btn">
            Siguiente →
          </button>
        </div>
      </>
    )}

    {eventToSave && (
      <SaveEventModal
        event={eventToSave}
        onClose={() => setEventToSave(null)}
      />
    )}
  </div>
);
}