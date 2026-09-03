import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFromApi } from '../../api/client';
import {
  BookmarkIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon,
  DollarIcon,
  ClockIcon
} from '../../icons';
import './Detail.css';

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getEvent = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchFromApi(`/events/${id}.json`);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError('No pudimos cargar el evento. Intentá de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEvent();
    }
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Fecha a confirmar';

    const date = new Date(`${dateStr}T00:00:00`);

    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'Horario a confirmar';

    return timeStr.slice(0, 5);
  };

  const getImage = () => {
    return (
      event?.images?.find(
        (img) => img.ratio === '16_9' && img.width > 1000
      ) ||
      event?.images?.find(
        (img) => img.ratio === '16_9'
      ) ||
      event?.images?.[0]
    );
  };

  if (loading) {
    return (
      <div className="detail-container detail-state">
        <p>Cargando evento...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="detail-container detail-state">
        <p className="detail-error">
          {error || 'Evento no encontrado.'}
        </p>

        <button
          className="detail-back-btn-state"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    );
  }

  const image = getImage();
  const venue = event._embedded?.venues?.[0];

  const dateStr = event.dates?.start?.localDate;
  const timeStr = event.dates?.start?.localTime;

  const price = event.priceRanges?.[0];

  const category =
    event.classifications?.[0]?.segment?.name ||
    event.classifications?.[0]?.genre?.name ||
    'EVENTO';

  const description =
    event.info ||
    event.description ||
    event.pleaseNote ||
    'No hay una descripción disponible para este evento.';

  const venueName =
    venue?.name ||
    'Lugar a confirmar';

  const city =
    venue?.city?.name || '';

  const country =
    venue?.country?.name || '';

  const address =
    venue?.address?.line1 || '';

  const fullLocation = [city, country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="detail-container">

      {/* ───────── Imagen principal ───────── */}

      <div className="detail-hero">

        {image ? (
          <img
            src={image.url}
            alt={event.name}
            className="detail-hero-img"
          />
        ) : (
          <div className="detail-hero-placeholder">
            Sin imagen
          </div>
        )}

        <button
          className="detail-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeftIcon size={20} />
        </button>

      </div>


      {/* ───────── Contenido ───────── */}

      <main className="detail-content">

        <span className="detail-category">
          {category}
        </span>

        <h1 className="detail-title">
          {event.name}
        </h1>


        {/* ───────── Información ───────── */}

        <section className="detail-info-card">

          {/* Fecha */}

          <div className="detail-info-row">

            <div className="detail-info-icon detail-info-icon-calendar">
              <CalendarIcon size={19} />
            </div>

            <div className="detail-info-text">
              <strong>
                {formatDate(dateStr)}
              </strong>

              {timeStr && (
                <span>
                  {formatTime(timeStr)}
                </span>
              )}
            </div>

          </div>


          {/* Lugar */}

          <div className="detail-info-row">

            <div className="detail-info-icon detail-info-icon-location">
              <MapPinIcon size={19} />
            </div>

            <div className="detail-info-text">

              <strong>
                {venueName}
              </strong>

              {address && (
                <span>
                  {address}
                </span>
              )}

              {fullLocation && (
                <span>
                  {fullLocation}
                </span>
              )}

            </div>

          </div>


          {/* Precio */}

          <div className="detail-info-row">

            <div className="detail-info-icon detail-info-icon-price">
              <DollarIcon size={19} />
            </div>

            <div className="detail-info-text">

              {price ? (
                <>
                  <strong>
                    ${price.min?.toFixed(2)}
                    {price.currency
                      ? ` ${price.currency}`
                      : ''}
                  </strong>

                  {price.max &&
                    price.max !== price.min && (
                      <span>
                        Hasta ${price.max.toFixed(2)}
                      </span>
                    )}
                </>
              ) : (
                <>
                  <strong>
                    Precio a confirmar
                  </strong>
                </>
              )}

            </div>

          </div>

        </section>


        {/* ───────── Sobre el evento ───────── */}

        <section className="detail-section">

          <h2>
            Sobre el evento
          </h2>

          <p className="detail-description">
            {description}
          </p>

        </section>


        {/* ───────── Mapa ───────── */}

        <section className="detail-section">

          <h2>
            Mapa
          </h2>

          <div className="detail-map">

            {venue?.location?.latitude &&
            venue?.location?.longitude ? (
              <iframe
                title={`Mapa de ${venueName}`}
                src={`https://www.google.com/maps?q=${venue.location.latitude},${venue.location.longitude}&output=embed`}
                loading="lazy"
              />
            ) : (
              <div className="detail-map-placeholder">
                <MapPinIcon size={28} />
                <span>
                  Ubicación no disponible
                </span>
              </div>
            )}

          </div>

        </section>

      </main>


      {/* ───────── Barra inferior ───────── */}

      <div className="detail-bottom-bar">

        <div className="detail-total">

          <span>
            Precio Total
          </span>

          <strong>
            {price
              ? `$${price.min?.toFixed(2)}`
              : 'Consultar'}
          </strong>

        </div>

        <button
          className="detail-favorite-btn"
          onClick={() => {
            // Acá después pueden implementar favoritos
            console.log('Agregar a favoritos', event.id);
          }}
        >
          <span className="detail-plus">
            +
          </span>

          Agregar a Favoritos
        </button>

      </div>

    </div>
  );
}