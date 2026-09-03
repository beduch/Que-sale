import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Contact.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Contact() {
  // Catedral de La Plata
  const position = [-34.9215, -57.9536];

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contacto</h1>
      </header>

      <address className="contact-card">
        <h3>Desarrollo Web</h3>
        <p><strong>Desarrolladores:</strong> Franco y Benjamin</p>
        <p><strong>Email:</strong> <a href="mailto:Email@gmail.com">Email@gmail.com</a></p>
        <p><strong>Teléfono:</strong> <a href="tel:+542215550123">+54 221 555-0123</a></p>
      </address>

      <div className="map-wrapper">
        <h3 className="map-title">Nuestra Ubicación</h3>
        <MapContainer center={position} zoom={16} scrollWheelZoom={false} className="leaflet-map" style={{ zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <strong>Nuestra Oficina</strong> <br /> Catedral de La Plata.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}