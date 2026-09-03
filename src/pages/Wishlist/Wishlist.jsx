import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookmarkIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowLeftIcon
} from '../../icons';
import './Wishlist.css';

export default function Wishlist() {
  const navigate = useNavigate();

  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    loadSavedEvents();
  }, []);

  const loadSavedEvents = () => {
    const events =
      JSON.parse(localStorage.getItem('savedEvents')) || [];

    events.sort(
      (a, b) => a.priority - b.priority
    );

    setSavedEvents(events);
  };

  const removeEvent = (id) => {
    const updatedEvents =
      savedEvents.filter(
        (event) => event.id !== id
      );

    localStorage.setItem(
      'savedEvents',
      JSON.stringify(updatedEvents)
    );

    setSavedEvents(updatedEvents);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return 'Fecha a confirmar';
    }

    const date =
      new Date(`${dateStr}T00:00:00`);

    return date.toLocaleDateString('es-AR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case 'MAÑANA':
        return 'saved-category morning';

      case 'NOCTURNO':
        return 'saved-category night';

      case 'MEDIODIA':
        return 'saved-category midday';

      case 'TARDE':
        return 'saved-category afternoon';

      default:
        return 'saved-category';
    }
  };

  return (
    <div className="saved-container">

      {/* Header */}

      <header className="saved-header">

        <button
          className="saved-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeftIcon size={18} />
        </button>

        <h1>
          Guardados
        </h1>

        <div className="saved-header-space"></div>

      </header>


      {/* Contenido */}

      {savedEvents.length === 0 ? (

        <div className="saved-empty">

          <BookmarkIcon size={42} />

          <h2>
            No tenés eventos guardados
          </h2>

          <p>
            Guardá eventos que te interesen
            para agregarlos a tu itinerario.
          </p>

        </div>

      ) : (

        <main className="saved-list">

          {savedEvents.map((event) => (

            <article
              key={event.id}
              className="saved-card"
            >

              {/* Categoría + prioridad */}

              <div className="saved-card-labels">

                {event.category && (
                  <span
                    className={getCategoryClass(
                      event.category
                    )}
                  >
                    {event.category}
                  </span>
                )}

                <span className="saved-priority">
                  P{event.priority}
                </span>

              </div>


              {/* Información */}

              <div className="saved-card-content">

                {event.image && (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="saved-card-img"
                    onClick={() =>
                      navigate(
                        `/detalle/${event.id}`
                      )
                    }
                  />
                )}

                <div className="saved-card-info">

                  <h2
                    onClick={() =>
                      navigate(
                        `/detalle/${event.id}`
                      )
                    }
                  >
                    {event.name}
                  </h2>

                  <p className="saved-meta">

                    <CalendarIcon size={11} />

                    {formatDate(event.date)}

                    {event.time &&
                      ` • ${event.time}`}

                  </p>

                  <p className="saved-meta saved-location">

                    <MapPinIcon size={11} />

                    {event.venue ||
                      event.city ||
                      'Ubicación a confirmar'}

                  </p>

                  {event.notes && (
                    <p className="saved-notes">
                      "{event.notes}"
                    </p>
                  )}

                </div>


                {/* Eliminar */}

                <button
                  className="saved-remove-btn"
                  onClick={() =>
                    removeEvent(event.id)
                  }
                  aria-label="Eliminar evento"
                >
                  ×
                </button>

              </div>

            </article>

          ))}

        </main>

      )}

    </div>
  );
}