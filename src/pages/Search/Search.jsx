import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import { fetchFromApi } from '../../api/client';
import './Search.css';
import { SearchIcon, XIcon, BookmarkIcon, CalendarIcon, MapPinIcon, ClockIcon } from '../../icons';
import SaveEventModal from '../../components/SaveEventModal/SaveEventModal';
import citiesJson from '../../data/cities.json';
import countriesJson from '../../data/countries.json';

export default function Search() {
  const location = useLocation();
  const initialCategory = location.state?.category || '';
  const initialKeyword = location.state?.keyword || '';

  const [keyword, setKeyword] = useState(() => {
    if (initialKeyword) return initialKeyword;
    return sessionStorage.getItem('search-keyword') || '';
  });

  const [category, setCategory] = useState(() => {
    if (initialCategory) return initialCategory;
    return sessionStorage.getItem('search-category') || '';
  });
  const [city, setCity] = useState(() => sessionStorage.getItem('search-city') || '');
  const [countryName, setCountryName] = useState(() => sessionStorage.getItem('search-country-name') || '');
  const [countryCode, setCountryCode] = useState(() => sessionStorage.getItem('search-country-code') || '');
  const [events, setEvents] = useState(() => {
    const saved = sessionStorage.getItem('search-results');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(() => Number(sessionStorage.getItem('search-page')) || 0);
  const [totalPages, setTotalPages] = useState(() => Number(sessionStorage.getItem('search-total-pages')) || 0);
  const [eventToSave, setEventToSave] = useState(null);
  
  // Estados para Búsquedas Recientes
  const [recentSearches, setRecentSearches] = useState([]);
  const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
  
  // Estados para Autocompletado de Ciudades
  const [customCities, setCustomCities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Estados para Autocompletado de Países
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setRecentSearches(JSON.parse(localStorage.getItem('que-sale-recent') || '[]'));
    
    // Cargar custom-cities y adaptarlas al nuevo formato si eran solo strings
    const storedCities = JSON.parse(localStorage.getItem('que-sale-custom-cities') || '[]');
    const normalizedCustomCities = storedCities.map(c => 
      typeof c === 'string' ? { name: c, countryCode: null } : c
    );
    setCustomCities(normalizedCustomCities);
  }, []);

  const fuseCountry = useMemo(() => {
    return new Fuse(countriesJson, { keys: ['name'], threshold: 0.4 });
  }, []);

  const fuseCity = useMemo(() => {
    // Unir JSON y custom, evitando duplicados por nombre
    const map = new Map();
    citiesJson.forEach(c => map.set(c.name.toLowerCase(), c));
    customCities.forEach(c => map.set(c.name.toLowerCase(), c));
    const allCities = Array.from(map.values());

    let listToSearch = allCities;
    
    // Filtrar la lista de ciudades si hay un país seleccionado o tipeado
    let activeCountryCode = countryCode;
    if (!activeCountryCode && countryName) {
      const match = countriesJson.find(c => c.name.toLowerCase() === countryName.toLowerCase());
      if (match) activeCountryCode = match.code;
    }

    if (activeCountryCode) {
      // Incluimos las null por compatibilidad con ciudades viejas sin país
      listToSearch = allCities.filter(c => c.countryCode === activeCountryCode || c.countryCode === null);
    }

    return new Fuse(listToSearch, { keys: ['name'], threshold: 0.4 });
  }, [customCities, countryCode, countryName]);

  useEffect(() => {
    if (city) {
      setCitySuggestions(fuseCity.search(city).map(r => r.item.name).slice(0, 5));
    } else {
      setCitySuggestions([]);
    }
  }, [city, fuseCity]);

  useEffect(() => {
    if (countryName) {
      setCountrySuggestions(fuseCountry.search(countryName).map(r => r.item).slice(0, 5));
    } else {
      setCountrySuggestions([]);
      setCountryCode('');
    }
  }, [countryName, fuseCountry]);

  useEffect(() => {
  sessionStorage.setItem('search-keyword', keyword);
  sessionStorage.setItem('search-category', category);
  sessionStorage.setItem('search-city', city);
  sessionStorage.setItem('search-country-name', countryName);
  sessionStorage.setItem('search-country-code', countryCode);
  sessionStorage.setItem('search-results', JSON.stringify(events));
  sessionStorage.setItem('search-page', String(page));
  sessionStorage.setItem('search-total-pages', String(totalPages));
}, [keyword, category, city, countryName, countryCode, events, page, totalPages]);

  const search = async (pageNumber = 0) => {
    if (!keyword && !category && !city && !countryName) {
      setError('Por favor, completá al menos un filtro para buscar.');
      return;
    }
    
    // Validación contra inyección de código (caracteres no permitidos)
    const hasDangerousChars = (str) => /[<>{}[\]\\]/.test(str);
    if (hasDangerousChars(keyword) || hasDangerousChars(city) || hasDangerousChars(countryName)) {
      setError('Caracteres no permitidos detectados (ej: <, >, {, }). Por seguridad no podés usar esos símbolos.');
      return;
    }
    
    let resolvedCountryCode = countryCode;
    if (countryName && !resolvedCountryCode) {
      const match = countriesJson.find(c => c.name.toLowerCase() === countryName.toLowerCase());
      if (match) resolvedCountryCode = match.code;
    }

    setError('');
    setLoading(true);
    setShowKeywordSuggestions(false);
    setShowCitySuggestions(false);
    setShowCountrySuggestions(false);
    
    try {
      const params = { size: 10, page: pageNumber };
      if (keyword) params.keyword = keyword;
      if (category) params.classificationName = category;
      if (city) params.city = city;
      if (resolvedCountryCode) params.countryCode = resolvedCountryCode;

      const data = await fetchFromApi('/events.json', params);
      const eventList = data._embedded?.events || [];
      setEvents(eventList);
      setPage(pageNumber);
      setTotalPages(data.page?.totalPages || 0);

      if (eventList.length > 0) {
        if (keyword && !recentSearches.includes(keyword)) {
          const updated = [keyword, ...recentSearches].slice(0, 8);
          setRecentSearches(updated);
          localStorage.setItem('que-sale-recent', JSON.stringify(updated));
        }

        const cityExists = citiesJson.some(c => c.name.toLowerCase() === city.toLowerCase()) || 
                           customCities.some(c => c.name.toLowerCase() === city.toLowerCase());

        if (city && !cityExists) {
          const normalizedCityName = city.charAt(0).toUpperCase() + city.slice(1);
          const newCityObj = { name: normalizedCityName, countryCode: resolvedCountryCode || null };
          const updatedCities = [...customCities, newCityObj];
          setCustomCities(updatedCities);
          localStorage.setItem('que-sale-custom-cities', JSON.stringify(updatedCities));
        }
      }
    } catch {
      setError('Error al buscar eventos. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (location.state?.category !== undefined) {
      setCategory(location.state.category);
      setEvents([]);
      search(0);
    }
    if (location.state?.keyword !== undefined) {
      setKeyword(location.state.keyword);
    }
  }, [location.state]);

  useEffect(() => {
    if (initialCategory || initialKeyword) {
      search(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    search(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha a confirmar';
    const date = new Date(`${dateStr}T00:00:00`);
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
          placeholder="¿A dónde vas? Buscá eventos, artistas..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setShowKeywordSuggestions(true)}
          onBlur={() => setTimeout(() => setShowKeywordSuggestions(false), 200)}
        />
        {keyword && (
          <button type="button" className="search-clear" onClick={() => setKeyword('')}>
            <XIcon size={16} />
          </button>
        )}
        
        {showKeywordSuggestions && recentSearches.length > 0 && (
          <ul className="search-dropdown">
            <li className="search-dropdown-title">Búsquedas recientes</li>
            {recentSearches.map((term, index) => (
              <li 
                key={index} 
                className="search-dropdown-item"
                onMouseDown={() => setKeyword(term)}
              >
                <ClockIcon size={14} color="#888" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

<div className="search-filters">
  <div className="filter-chip-teal">
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">Categoría ▾</option>
      <option value="Music">Música</option>
      <option value="Sports">Deporte</option>
      <option value="Arts & Theatre">Teatro</option>
      <option value="Family">Familia</option>
      <option value="Film">Cine</option>
    </select>
  </div>

  <div className="filter-chip-outline" style={{ position: 'relative' }}>
    <input
      type="text"
      placeholder="País ▾"
      value={countryName}
      onChange={(e) => {
        setCountryName(e.target.value);
        setCountryCode(''); // Reset code if user types manually
      }}
      onFocus={() => setShowCountrySuggestions(true)}
      onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 200)}
      style={{ width: '80px' }}
    />
    
    {showCountrySuggestions && countrySuggestions.length > 0 && (
      <ul className="search-dropdown country-dropdown">
        {countrySuggestions.map((country, index) => (
          <li 
            key={index} 
            className="search-dropdown-item"
            onMouseDown={() => {
              setCountryName(country.name);
              setCountryCode(country.code);
            }}
          >
            <MapPinIcon size={14} color="#888" />
            <span>{country.name}</span>
          </li>
        ))}
      </ul>
    )}
  </div>

  <div className="filter-chip-outline" style={{ position: 'relative' }}>
    <input
      type="text"
      placeholder="Ciudad ▾"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onFocus={() => setShowCitySuggestions(true)}
      onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
      style={{ width: '90px' }}
    />
    
    {showCitySuggestions && citySuggestions.length > 0 && (
      <ul className="search-dropdown city-dropdown">
        {citySuggestions.map((suggestion, index) => (
          <li 
            key={index} 
            className="search-dropdown-item"
            onMouseDown={() => setCity(suggestion)}
          >
            <MapPinIcon size={14} color="#888" />
            <span>{suggestion}</span>
          </li>
        ))}
      </ul>
    )}
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
                      {formatDate(dateStr)}{timeStr && ` • ${timeStr} hs`}
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