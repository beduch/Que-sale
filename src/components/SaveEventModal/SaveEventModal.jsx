import { useState } from 'react';
import { XIcon, PlusIcon } from '../../icons';
import './SaveEventModal.css';

// Función que calcula la categoría según el horario
const getCategoryFromTime = (timeStr) => {
  if (!timeStr) return '';
  const hour = parseInt(timeStr.slice(0, 2), 10);
  if (hour >= 6 && hour < 12) return 'MAÑANA';
  if (hour >= 12 && hour < 15) return 'MEDIODIA';
  if (hour >= 15 && hour < 20) return 'TARDE';
  return 'NOCTURNO';
};

export default function SaveEventModal({ event, onClose }) {
  const timeStr = event?.dates?.start?.localTime || '';
  const autoCategory = getCategoryFromTime(timeStr);
  
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

  const countryName =
    venue?.country?.name || '';

  const handleSave = () => {
  if (!category && !autoCategory) {
    return;
  }

  const finalCategory = category || autoCategory;

  const savedEvent = {
    id: event.id,
    name: event.name,
    image: image?.url || '',
    date: event.dates?.start?.localDate || '',
    time: event.dates?.start?.localTime?.slice(0, 5) || '',
    venue: venueName,
    city: city,
    country: countryName,
    price: price?.min ?? null,
    priority: Number(priority),
    category: finalCategory,
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
      JSON.stringify([...existingEvents, savedEvent])
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
            {['MAÑANA', 'NOCTURNO', 'MEDIODIA', 'TARDE'].map((cat) => {
              const classMap = {
                'MAÑANA': 'morning',
                'NOCTURNO': 'night',
                'MEDIODIA': 'midday',
                'TARDE': 'afternoon'
              };
              return (
                <button
                  key={cat}
                  type="button"
                  className={`${classMap[cat]} ${category === cat ? 'active' : ''}`}
                  disabled
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <small style={{ color: '#aaa', fontSize: '0.72rem', marginTop: '4px', display: 'block' }}>
          Categoría asignada automáticamente según el horario del evento.
          </small>

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
          disabled={!category && !autoCategory}
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