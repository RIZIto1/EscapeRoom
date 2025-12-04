import './reservarSala.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function ReservarSala() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sala, setSala] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [reservasExistentes, setReservasExistentes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHorario, setSelectedHorario] = useState(null);
    const [jugadores, setJugadores] = useState(2);
    const [loading, setLoading] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        cargarDatos();
    }, [id]);

    useEffect(() => {
        if (selectedDate) {
            cargarReservas();
        }
    }, [selectedDate]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            const resSalas = await fetch('https://escaperoom-backend.onrender.com/salas/getall');
            const salas = await resSalas.json();
            const salaEncontrada = salas.find(s => s.ID_salas === parseInt(id));
            setSala(salaEncontrada);

            const resHorarios = await fetch(`https://escaperoom-backend.onrender.com/horarios/sala/${id}`);
            const horariosData = await resHorarios.json();
            setHorarios(horariosData);

        } catch (error) {
            console.error('Error al cargar datos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los datos',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b'
            });
        } finally {
            setLoading(false);
        }
    };

    const cargarReservas = async () => {
        try {
            const res = await fetch('https://escaperoom-backend.onrender.com/reservas/getall');
            const todasReservas = await res.json();
            
            const fechaSeleccionada = selectedDate.toISOString().split('T')[0];
            const reservasFiltradas = todasReservas.filter(r => 
                r.FK_ID_salas === parseInt(id) && 
                r.fecha.startsWith(fechaSeleccionada)
            );
            
            setReservasExistentes(reservasFiltradas);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
        }
    };

    const getDiaSemana = (fecha) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[fecha.getDay()];
    };

    const horariosDisponibles = horarios.filter(h => h.dia === getDiaSemana(selectedDate));

    const isHorarioReservado = (horario) => {
        return reservasExistentes.some(r => r.FK_ID_horarios === horario.ID_horarios);
    };

    const handleReservar = async () => {
        if (!selectedHorario) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona un horario',
                text: 'Por favor selecciona un horario disponible',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b'
            });
            return;
        }

        if (jugadores < 1 || jugadores > sala.capacidad) {
            Swal.fire({
                icon: 'warning',
                title: 'Número de jugadores inválido',
                text: `Debe ser entre 1 y ${sala.capacidad}`,
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b'
            });
            return;
        }

        const fechaReserva = selectedDate.toISOString().split('T')[0];

        const reservaData = {
            FK_ID_horarios: selectedHorario.ID_horarios,
            FK_ID_salas: parseInt(id),
            FK_ID_usuarios: usuario.id,
            fecha: fechaReserva,
            jugadores: jugadores,
            estado: 'confirmada'
        };

        try {
            const response = await fetch('https://escaperoom-backend.onrender.com/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaData)
            });

            const data = await response.json();

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Reserva exitosa!',
                    text: `Tu reserva para ${fechaReserva} a las ${selectedHorario.hora_inicio} ha sido confirmada`,
                    background: '#112117',
                    color: '#ffffff',
                    confirmButtonColor: '#36e27b',
                    iconColor: '#36e27b'
                });
                navigate('/inicio');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al reservar',
                    text: data.error || 'No se pudo completar la reserva',
                    background: '#112117',
                    color: '#ffffff',
                    confirmButtonColor: '#36e27b'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b'
            });
        }
    };

    const formatearFecha = (fecha) => {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return fecha.toLocaleDateString('es-ES', opciones);
    };

    if (loading) {
        return (
            <div className="reservar-loading">
                <div className="spinner"></div>
                <p>Cargando sala...</p>
            </div>
        );
    }

    if (!sala) {
        return (
            <div className="reservar-error">
                <p>Sala no encontrada</p>
                <button onClick={() => navigate('/inicio')} className="btn-back">
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="reservar-page">
            <header className="reservar-header">
                <button onClick={() => navigate('/inicio')} className="btn-back-header">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver
                </button>
                <h1>Reservar Sala</h1>
            </header>

            <main className="reservar-main">
                <section className="sala-info-card">
                    <div className="sala-img-container">
                        <img 
                            src={`/images/${sala.nombre.replace(/\s+/g, '-').toLowerCase()}.jpg`}
                            alt={sala.nombre}
                            onError={(e) => {
                                e.target.src = '/images/no-image.jpg';
                            }}
                        />
                    </div>
                    
                    <div className="sala-info-content">
                        <h2>{sala.nombre}</h2>
                        <div className="sala-specs">
                            <div className="spec-item">
                                <span className="material-symbols-outlined">group</span>
                                <span>Hasta {sala.capacidad} jugadores</span>
                            </div>
                            <div className="spec-item">
                                <span className="material-symbols-outlined">schedule</span>
                                <span>{sala.tiempo} minutos</span>
                            </div>
                            <div className="spec-item">
                                <span className="material-symbols-outlined">
                                    {sala.dificultad === 'BAJA' ? 'sentiment_satisfied' : 
                                     sala.dificultad === 'MEDIA' ? 'sentiment_neutral' : 
                                     'sentiment_very_dissatisfied'}
                                </span>
                                <span>Dificultad {sala.dificultad}</span>
                            </div>
                            <div className="spec-item price-spec">
                                <span className="material-symbols-outlined">payments</span>
                                <span>${sala.precio} por persona</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="fecha-jugadores-container">
                    <section className="fecha-section">
                        <p className="fecha-label">Fecha</p>
                        <p className="fecha-actual">{formatearFecha(selectedDate)}</p>
                        
                        <button 
                            className="btn-cambiar-fecha"
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            <span className="material-symbols-outlined">calendar_month</span>
                            Cambiar
                        </button>

                        {showCalendar && (
                            <div className="calendar-picker">
                                <input 
                                    type="date" 
                                    value={selectedDate.toISOString().split('T')[0]}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        setSelectedDate(new Date(e.target.value + 'T12:00:00'));
                                        setShowCalendar(false);
                                        setSelectedHorario(null);
                                    }}
                                />
                            </div>
                        )}
                    </section>

                    <section className="jugadores-section">
                        <p className="jugadores-label">Jugadores</p>
                        <div className="jugadores-control">
                            <button 
                                onClick={() => setJugadores(Math.max(1, jugadores - 1))}
                                disabled={jugadores <= 1}
                            >
                                <span className="material-symbols-outlined">remove</span>
                            </button>
                            <span className="jugadores-number">{jugadores}</span>
                            <button 
                                onClick={() => setJugadores(Math.min(sala.capacidad, jugadores + 1))}
                                disabled={jugadores >= sala.capacidad}
                            >
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </section>
                </div>

                <section className="horarios-section">
                    <h3>Horarios disponibles - {getDiaSemana(selectedDate)}</h3>
                    
                    {horariosDisponibles.length === 0 ? (
                        <p className="no-horarios">No hay horarios disponibles para este día</p>
                    ) : (
                        <div className="horarios-grid">
                            {horariosDisponibles.map(horario => {
                                const reservado = isHorarioReservado(horario);
                                const seleccionado = selectedHorario?.ID_horarios === horario.ID_horarios;
                                
                                return (
                                    <button
                                        key={horario.ID_horarios}
                                        className={`horario-card ${reservado ? 'reservado' : 'disponible'} ${seleccionado ? 'seleccionado' : ''}`}
                                        onClick={() => !reservado && setSelectedHorario(horario)}
                                        disabled={reservado}
                                    >
                                        <span className="material-symbols-outlined">
                                            {reservado ? 'lock' : seleccionado ? 'check_circle' : 'schedule'}
                                        </span>
                                        <span className="horario-time">
                                            {horario.hora_inicio.substring(0, 5)}
                                        </span>
                                        <span className="horario-status">
                                            {reservado ? 'Reservado' : 'Disponible'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="resumen-section">
                    <div className="resumen-card">
                        <h3>Tu Reserva</h3>
                        <div className="resumen-details">
                            <p><strong>{sala.nombre}</strong></p>
                            <p>{formatearFecha(selectedDate)} {selectedHorario ? selectedHorario.hora_inicio.substring(0, 5) : '—'} • {jugadores} jugadores</p>
                            <p className="resumen-total">${sala.precio * jugadores}</p>
                        </div>
                        
                        <button 
                            className="btn-confirmar-reserva"
                            onClick={handleReservar}
                            disabled={!selectedHorario}
                        >
                            Confirmar Reserva
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}