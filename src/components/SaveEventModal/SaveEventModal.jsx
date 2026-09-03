import { useState } from 'react';
import { XIcon, PlusIcon } from '../../icons';
import './SaveEventModal.css';

export default function SaveEventModal({ event, onClose }) {
  const [priority, setPriority] = useState(2);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  if (!event) return null;

  const venue = event._embedded?.venues?.[0];

  const image =
    event.images?.find(
      (img) => img.ratio === '16_9' && img.width > 300
    ) || event.images?.[0];

  const price = event.priceRanges?.[0];

  const venueName =
    venue?.name || 'Lugar a confirmar';

  const city =
    venue?.city?.name || '';

  const handleSave = () => {
    if (!category) {
      return;
    }

    const savedEvent = {
      id: event.id,
      name: event.name,

      image: image?.url || '',

      date: event.dates?.start?.localDate || '',
      time: event.dates?.start?.localTime?.slice(0, 5) || '',

      venue: venueName,
      city: city,

      price: price?.min ?? null,

      priority: Number(priority),
      category: category,
      notes: notes,

      savedAt: new Date().toISOString()
    };

    const existingEvents =
      JSON.parse(localStorage.getItem('savedEvents')) || [];

    const alreadySaved = existingEvents.some(
      (item) => item.id === event.id
    );

    if (!alreadySaved) {
      localStorage.setItem(
        'savedEvents',
        JSON.stringify([
          ...existingEvents,
          savedEvent
        ])
      );
    }

    onClose();
  };

  return (
    <div
      className="save-modal-overlay"
      onClick={onClose}
    >
      <div
        className="save-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="save-modal-handle"></div>

        <div className="save-modal-header">
          <h2>Agregar a guardados</h2>

          <button
            className="save-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <XIcon size={16} />
          </button>
        </div>


        {/* Evento */}

        <div className="save-selected-event">

          {image && (
            <img
              src={image.url}
              alt={event.name}
            />
          )}

          <div className="save-selected-event-info">

            <strong>
              {event.name}
            </strong>

            <span>
              {venueName}
            </span>

          </div>

        </div>


        {/* Prioridad */}

        <div className="save-field">

          <div className="save-field-header">
            <label>Prioridad *</label>
            <span>Requerido</span>
          </div>

          <div className="priority-control">

            <input
              type="number"
              min="1"
              value={priority}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (value >= 1) {
                  setPriority(value);
                }
              }}
            />

            <button
              type="button"
              onClick={() =>
                setPriority((prev) => prev + 1)
              }
            >
              <PlusIcon size={17} />
            </button>

          </div>

          <small>
            Ingrese un número de prioridad mayor a 0
          </small>

        </div>


        {/* Categoría */}

        <div className="save-field">

          <div className="save-field-header">
            <label>Categoría *</label>
          </div>

          <div className="save-category-options">

            <button
              type="button"
              className={`morning ${
                category === 'MAÑANA' ? 'active' : ''
              }`}
              onClick={() => setCategory('MAÑANA')}
            >
              MAÑANA
            </button>

            <button
              type="button"
              className={`night ${
                category === 'NOCTURNO' ? 'active' : ''
              }`}
              onClick={() => setCategory('NOCTURNO')}
            >
              NOCTURNO
            </button>

            <button
              type="button"
              className={`midday ${
                category === 'MEDIODIA' ? 'active' : ''
              }`}
              onClick={() => setCategory('MEDIODIA')}
            >
              MEDIODIA
            </button>

            <button
              type="button"
              className={`afternoon ${
                category === 'TARDE' ? 'active' : ''
              }`}
              onClick={() => setCategory('TARDE')}
            >
              TARDE
            </button>

          </div>

        </div>


        {/* Notas */}

        <div className="save-field">

          <div className="save-field-header">

            <label>
              Notas (opcional)
            </label>

            <span>
              {notes.length} / 200
            </span>

          </div>

          <textarea
            maxLength={200}
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            placeholder="texto texto texto"
          />

        </div>


        {/* Guardar */}

        <button
          className="save-confirm-btn"
          onClick={handleSave}
          disabled={!category}
        >
          Agregar a guardados
        </button>


        {/* Cancelar */}

        <button
          className="save-cancel-btn"
          onClick={onClose}
        >
          Cancelar
        </button>

      </div>
    </div>
  );
}