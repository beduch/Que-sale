import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../../api/client';
import { SearchIcon, ClockIcon } from '../../icons';
import './Home.css';
import logoImg from '../../assets/Logo_QueSale.png';

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
  const [error, setError] = useState('');
  
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
    <main className="home-container">

      <div style={{ width: '100%' }}>
        <form 
          className="home-search-bar" 
          onSubmit={(e) => {
            e.preventDefault();
            const hasDangerousChars = (str) => /[<>{}[\]\\]/.test(str);
            if (hasDangerousChars(searchQuery)) {
              setError('Caracteres no permitidos (ej: <, >, {).');
              return;
            }
            setError('');
            
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
        {error && <p style={{ color: '#ff4d4f', fontSize: '0.85rem', textAlign: 'center', marginTop: '8px' }}>{error}</p>}
      </div>

      {/* Carrusel */}
      <div className="hero-carousel">
        {[
          {
            title: "Planificá tu viaje deseado",
            text: "Explorá eventos en cualquier ciudad del mundo antes de hacer las valijas.",
            bg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"
          },
          {
            title: "¿Quiénes somos?",
            text: "Dos desarrolladores que creamos Qué Sale para que siempre tengas un plan.",
            bg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
            isAbout: true
          },
          {
            title: "¿Hablamos?",
            text: "Escribinos a Email@gmail.com o visitá nuestra oficina en La Plata.",
            bg: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=600&q=80"
          }
        ].map((slide, idx) => (
          <div
            key={idx}
            className={`hero-slide ${activeSlide === idx ? 'active' : ''} ${slide.isAbout ? 'hero-slide-about' : ''}`}
            style={slide.bg ? { backgroundImage: `url(${slide.bg})` } : {}}
          >
            {slide.isAbout && (
              <img src={logoImg} alt="Qué Sale" className="hero-logo" />
            )}
            <div className="hero-content">
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
            </div>
          </div>
        ))}
        <div className="hero-dots">
          {[0, 1, 2].map(i => (
            <button
              key={i}
              className={`hero-dot ${activeSlide === i ? 'active' : ''}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <section className="home-section">
        <div className="section-header">
          <h3>CATEGORÍAS DE EVENTOS</h3>
          <ChevronRight />
        </div>

        <div className="horizontal-scroll categories-scroll">
          {[
            { name: "Música", value: "Music", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=150&q=80" },
            { name: "Deporte", value: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80" },
            { name: "Teatro", value: "Arts & Theatre", img: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=150&q=80" },
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
          <div className="horizontal-scroll recommended-scroll">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="recommended-card skeleton-card">
                <div className="skeleton-img skeleton-pulse"></div>
                <div className="recommended-info">
                  <div className="skeleton-text skeleton-category skeleton-pulse"></div>
                  <div className="skeleton-text skeleton-title skeleton-pulse"></div>
                  <div className="skeleton-text skeleton-price skeleton-pulse"></div>
                </div>
              </article>
            ))}
          </div>
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

    </main>
  );
}