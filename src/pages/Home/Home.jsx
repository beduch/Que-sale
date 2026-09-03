import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../../api/client';
import { SearchIcon } from '../../icons';
import './Home.css';

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function Home() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await fetchFromApi('/events.json', { city: 'Miami', size: 5, sort: 'random' });
        setRecommended(data._embedded?.events || []);
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

      <header className="home-search-bar" onClick={() => navigate('/buscar')}>
        <SearchIcon size={18} color="#888" />
        <span>Buscar eventos, artistas o ciudades...</span>
      </header>

      <section className="hero-banner">
        <div className="hero-content">
          <h2>Tu viaje, tus reglas.</h2>
          <p>Descubre y planifica eventos internacionales antes de subir al avión.</p>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h3>EVENTOS (Miami)</h3>
          <ChevronRight />
        </div>

        <div className="horizontal-scroll categories-scroll">
          {[
            { name: "Música", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=150&q=80" },
            { name: "Deportes", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=150&q=80" },
            { name: "Teatro", img: "https://images.unsplash.com/photo-1507676184212-d0330a151f84?auto=format&fit=crop&w=150&q=80" },
            { name: "Familia", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=150&q=80" }
          ].map((cat, idx) => (
            <div key={idx} className="category-bubble" onClick={() => navigate('/buscar')}>
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