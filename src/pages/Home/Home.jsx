import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../../api/client';
import { SearchIcon, ClockIcon } from '../../icons';
import './Home.css';

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function Home() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    setRecentSearches(JSON.parse(localStorage.getItem('que-sale-recent') || '[]'));

  const fetchRecommended = async () => {
  try {
    const data = await fetchFromApi('/events.json', { size: 20 });
    const allEvents = data._embedded?.events || [];

    // Mezclar al azar y tomar 6
    const shuffled = allEvents.sort(() => Math.random() - 0.5).slice(0, 6);
    setRecommended(shuffled);
  } catch (error) {
    console.error("Error al traer recomendados", error);
  } finally {
    setLoading(false);
  }
};

    fetchRecommended();
  }, []);

  return (
    <div className="home-container">

      <form 
        className="home-search-bar" 
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim()) {
            navigate('/buscar', { state: { keyword: searchQuery } });
          } else {
            navigate('/buscar');
          }
        }}
      >
        <SearchIcon size={18} color="#888" />
        <input 
          type="text" 
          placeholder="Buscar eventos, artistas o ciudades..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '0.95rem', color: '#111' }}
        />
        
        {/* Dropdown Búsquedas Recientes */}
        {showSuggestions && recentSearches.length > 0 && (
          <ul className="search-dropdown">
            <li className="search-dropdown-title">Búsquedas recientes</li>
            {recentSearches.map((term, index) => (
              <li 
                key={index} 
                className="search-dropdown-item"
                onMouseDown={() => {
                  setSearchQuery(term);
                  navigate('/buscar', { state: { keyword: term } });
                }}
              >
                <ClockIcon size={14} color="#888" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        )}
      </form>

      <section className="hero-banner">
        <div className="hero-content">
          <h2>Tu viaje, tus reglas.</h2>
          <p>Descubre y planifica eventos internacionales antes de subir al avión.</p>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h3>CATEGORÍAS DE EVENTOS</h3>
          <ChevronRight />
        </div>

        <div className="horizontal-scroll categories-scroll">
          {[
            { name: "Música", value: "Music", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=150&q=80" },
            { name: "Deporte", value: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80" },
            { name: "Teatro", value: "Arts & Theatre", img: "https://images.unsplash.com/photo-1518834107812-6a31c5188190?auto=format&fit=crop&w=150&q=80" },
            { name: "Familia", value: "Family", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=150&q=80" },
            { name: "Cine", value: "Film", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=150&q=80" }
          ].map((cat, idx) => (
            <div key={idx} className="category-bubble" onClick={() => navigate('/buscar', { state: { category: cat.value } })}>
              <img src={cat.img} alt={cat.name} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h3>RECOMENDADOS</h3>
          <ChevronRight />
        </div>

        {loading ? (
          <p className="loading-text">Buscando los mejores eventos...</p>
        ) : (
          <div className="horizontal-scroll recommended-scroll">
            {recommended.map(event => {
              const image = event.images?.find(img => img.ratio === '3_2' || img.ratio === '4_3') || event.images[0];
              const price = event.priceRanges?.[0];

              return (
                <article key={event.id} className="recommended-card" onClick={() => navigate(`/detalle/${event.id}`)}>
                  <img src={image?.url} alt={event.name} className="recommended-img" />
                  <div className="recommended-info">
                    <span className="recommended-category">{event.classifications?.[0]?.segment?.name || 'Evento'}</span>
                    <h4 className="recommended-name">{event.name}</h4>
                    {price && <span className="recommended-price">${price.min}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}