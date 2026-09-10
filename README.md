# Qué Sale

Aplicación web mobile-first para explorar eventos internacionales, orientada a viajeros que quieren planificar actividades en su próximo destino.

## Demo

https://beduch.github.io/Que-sale/

---

## Requisitos para levantar el proyecto

- Node.js v18 o superior
- Git

```bash
git clone https://github.com/beduch/Que-sale.git
cd Que-sale
npm install
npm run dev
```

Crear un archivo `.env` en la raíz con la API key de Ticketmaster:

```
VITE_TICKETMASTER_KEY=tu_api_key_aqui
```

La key se obtiene registrándose gratuitamente en [developer.ticketmaster.com](https://developer.ticketmaster.com). El archivo `.env` no está incluido en el repositorio por razones de seguridad. La aplicación corre en `http://localhost:5173`.

---

## Stack y decisiones técnicas

**React + Vite** como framework de desarrollo. La navegación entre vistas se maneja con React Router en modo SPA, sin recargas de página.

**Ticketmaster Discovery API** como fuente de datos. El cliente HTTP está centralizado en `src/api/client.js` usando Fetch API nativa, con la API key inyectada desde variables de entorno para no exponerla en el repositorio.

**localStorage y sessionStorage** para persistencia del lado del cliente. Los favoritos, historial y sesión de usuario van a localStorage; el estado de la búsqueda (filtros y resultados) se guarda en sessionStorage para restaurarse al volver desde el detalle de un evento.

**Fuse.js** para autocompletado difuso de ciudades y países sobre un JSON local, evitando requests adicionales a la API por cada tecla presionada.

**React-Leaflet con OpenStreetMap** para los mapas interactivos en la vista de detalle y en contacto, sin depender de la API de Google Maps.

El diseño responsivo está implementado con CSS propio sin ninguna librería de UI, siguiendo un enfoque mobile-first con breakpoints en 481px, 768px, 1024px, 1440px y 1920px. En mobile y tablet la navegación es una barra inferior fija; en desktop se reemplaza por una sidebar lateral desplegable.

---

## Estructura del proyecto

src/
├── api/ # Cliente HTTP centralizado
├── assets/ # Recursos estáticos
├── components/ # Componentes reutilizables (Navbar, SaveEventModal)
├── data/ # JSON de ciudades y países para autocompletado local
├── pages/ # Una carpeta por vista con su JSX y CSS
├── icons/ # SVGs como componentes React
└── styles/ # Estilos globales y layout