import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Detail from './pages/Detail/Detail';
import Wishlist from './pages/Wishlist/Wishlist';
import History from './pages/History/History';
import Contact from './pages/Contact/Contact';

import './styles/global.css';
import './styles/layout.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buscar" element={<Search />} />
            <Route path="/detalle/:id" element={<Detail />} />
            <Route path="/deseos" element={<Wishlist />} />
            <Route path="/historial" element={<History />} />
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;