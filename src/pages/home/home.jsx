import './home.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [salas, setSalas] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        cargarSalas();
    }, []);
    const cargarSalas = async () => {
        try {
            const response = await fetch('http://localhost:3000/salas/getall');
            const data = await response.json();
            setSalas(data);
            console.log('Salas cargadas:', data);
        } catch (error) {
            console.error('Error al cargar salas:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % salas.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + salas.length) % salas.length);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/');
        setMenuOpen(false);
    };

    const formatPrice = (price) => {
        return Math.round(price).toLocaleString('es-AR');
    };

    useEffect(() => {
        if (!menuOpen) return;
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    if (loading) {
        return (
            <div className="home-loading">
                <div className="spinner"></div>
                <p>Cargando salas...</p>
            </div>
        );
    }

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="header-content" style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src='/images/cubo-b.png' alt="Club Escape Logo" style={{ width: '40px', height: '40px' }} />
                        <h1 style={{ color: '#fff', margin: 0 }}>Club Escape</h1>
                    </div>
                    <div className="user-info" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="user-name">
                            Hola, <strong>{usuario?.nombre}</strong>
                        </span>
                        {usuario?.rol === 'admin' && (
                            <span className="badge-admin">Admin</span>
                        )}
                        <button className='btn-menu' onClick={() => setMenuOpen((v) => !v)}>
                            <img className="img-menu" src='/images/menu.png' alt="Menú" />
                        </button>
                        {menuOpen && (
                            <ul className='list-menu' ref={menuRef}>
                                {usuario?.rol === 'admin' && (
                                    <li onClick={() => { navigate('/admin'); setMenuOpen(false); }}>
                                        Panel Admin
                                    </li>
                                )}
                                <li onClick={() => { navigate('/mis-reservas'); setMenuOpen(false); }}>
                                    Mis Reservas
                                </li>
                                <li onClick={handleLogout}>
                                    Cerrar Sesión
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </header>

            <main className="home-main">
                <div className="intro-section">
                    <h2>Descubre Nuestras Salas</h2>
                    <p>Elige tu aventura y reserva tu experiencia</p>
                </div>

                {salas.length > 0 ? (
                    <div className="carousel-container">
                        <button
                            className="carousel-btn prev"
                            onClick={prevSlide}
                            disabled={salas.length <= 1}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        <div className="carousel-content">
                            <div className="sala-card">
                                <div className="sala-image">
                                    <img
                                        src={`/images/${salas[currentIndex].nombre.replace(/\s+/g, '-').toLowerCase()}.jpg`}
                                        alt={salas[currentIndex].nombre}
                                        onError={(e) => {
                                            e.target.src = '/images/no-image.jpg';
                                        }}
                                    />
                                    <div className="sala-overlay">
                                        <h3>{salas[currentIndex].nombre}</h3>
                                    </div>
                                </div>

                                <div className="sala-details">
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="material-symbols-outlined">group</span>
                                            <span>{salas[currentIndex].capacidad} jugadores</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="material-symbols-outlined">schedule</span>
                                            <span>{salas[currentIndex].tiempo} min</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="material-symbols-outlined">
                                                {salas[currentIndex].dificultad === 'BAJA' ? 'sentiment_satisfied' :
                                                    salas[currentIndex].dificultad === 'MEDIA' ? 'sentiment_neutral' :
                                                        'sentiment_very_dissatisfied'}
                                            </span>
                                            <span>{salas[currentIndex].dificultad}</span>
                                        </div>
                                        <div className="detail-item price">
                                            <span className="material-symbols-outlined">payments</span>
                                            <span>${formatPrice(salas[currentIndex].precio)}</span>
                                        </div>
                                    </div>

                                    <button className="btn-reservar" onClick={() => navigate(`/inicio/sala/${salas[currentIndex].ID_salas}`)}>
                                        Reservar Ahora
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            className="carousel-btn next"
                            onClick={nextSlide}
                            disabled={salas.length <= 1}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                ) : (
                    <div className="no-salas">
                        <p>No hay salas disponibles en este momento</p>
                    </div>
                )}
            </main>
        </div>
    );
}