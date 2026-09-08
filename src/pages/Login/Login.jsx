import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/Logo_QueSale.png';
import './Login.css';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();
  const nombreFinal = nombre.trim() || 'Usuario';
  localStorage.setItem('que-sale-user', nombreFinal);
  navigate('/');
};

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logoImg} alt="Qué Sale" className="login-logo" />
        <h1 className="login-title">Bienvenido a <span>Qué Sale</span></h1>
        <p className="login-subtitle">Descubrí eventos en cualquier ciudad del mundo.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="nombre">¿Cómo te llamás?</label>
            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre..."
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setError('');
              }}
              maxLength={30}
            />
            {error && <p className="login-error">{error}</p>}
          </div>

            <div className="login-field">
                <label htmlFor="email">Tu correo electrónico</label>
                <input
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}