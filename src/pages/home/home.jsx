import './home.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [salas, setSalas] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        cargarSalas();
    }, []);

    const cargarSalas = async () => {
        try {
            // Usar tu endpoint /salas/getall
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
    };

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
            {/* Header */}
            <header className="home-header">
                <div className="header-content">
                    <h1>Club Escape</h1>
                    <div className="user-info">
                        <span className="user-name">
                            Hola, <strong>{usuario?.nombre}</strong>
                        </span>
                        {usuario?.rol === 'admin' && (
                            <span className="badge-admin">Admin</span>
                        )}
                        <button onClick={handleLogout} className="btn-logout">
                            Cerrar Sesión
                        </button>
                        <button className='btn-menu'><img className="img-menu" src='/images/menu.png'></img></button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-main">
                <div className="intro-section">
                    <h2>Descubre Nuestras Salas</h2>
                    <p>Elige tu aventura y reserva tu experiencia</p>
                </div>

                {/* Carrusel de Salas */}
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
                                    {console.log(`./images/${salas[currentIndex].nombre.replace(/\s+/g, '-').toLowerCase()}.jpg`)}
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
                                            <span>${salas[currentIndex].precio}</span>
                                        </div>
                                    </div>

                                    <button className="btn-reservar">
                                        Reservar Ahora
                                    </button>
                                </div>
                            </div>

                            {/* Indicadores */}
                            <div className="carousel-indicators">
                                {salas.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
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