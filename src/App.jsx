import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Detail from './pages/Detail/Detail';
import Wishlist from './pages/Wishlist/Wishlist';
import History from './pages/History/History';
import Contact from './pages/Contact/Contact';

import './styles/global.css';
import './styles/layout.css';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('que-sale-user');
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/buscar" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/detalle/:id" element={<ProtectedRoute><Detail /></ProtectedRoute>} />
            <Route path="/deseos" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/contacto" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;