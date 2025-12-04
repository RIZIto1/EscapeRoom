import './misReservas.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function MisReservas() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);
    const [formEditar, setFormEditar] = useState({
        jugadores: 0,
        fecha: '',
        FK_ID_horarios: 0
    });
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        if (!usuario) {
            navigate('/');
            return;
        }
        cargarReservas();
    }, []);

    const cargarReservas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://escaperoom-backend.onrender.com/reservas/getall/${usuario.id}`);
            const data = await response.json();
            
            const reservasConDetalles = await Promise.all(
                data.map(async (reserva) => {
                    const resSala = await fetch('https://escaperoom-backend.onrender.com/salas/getall');
                    const salas = await resSala.json();
                    const sala = salas.find(s => s.ID_salas === reserva.FK_ID_salas);
                    
                    const resHorario = await fetch(`https://escaperoom-backend.onrender.com/horarios/getHorario/${reserva.FK_ID_horarios}`);
                    const horario = await resHorario.json();
                    
                    return {
                        ...reserva,
                        sala: sala,
                        horario: horario
                    };
                })
            );
            
            setReservas(reservasConDetalles);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las reservas',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b'
            });
        } finally {
            setLoading(false);
        }
    };

    const eliminarReserva = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e84a5f',
            cancelButtonColor: '#36e27b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#112117',
            color: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`https://escaperoom-backend.onrender.com/reservas/delete/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Reserva eliminada',
                        text: 'Tu reserva ha sido cancelada',
                        background: '#112117',
                        color: '#ffffff',
                        confirmButtonColor: '#36e27b',
                        timer: 2000
                    });
                    cargarReservas();
                } else {
                    throw new Error('Error al eliminar');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la reserva',
                    background: '#112117',
                    color: '#ffffff',
                    confirmButtonColor: '#36e27b'
                });
            }
        }
    };

    const iniciarEdicion = (reserva) => {
        setEditando(reserva.ID_reservas);
        setFormEditar({
            jugadores: reserva.jugadores,
            fecha: reserva.fecha.split('T')[0],
            FK_ID_horarios: reserva.FK_ID_horarios
        });
    };

    const cancelarEdicion = () => {
        setEditando(null);
        setFormEditar({
            jugadores: 0,
            fecha: '',
            FK_ID_horarios: 0
        });
    };

    const guardarEdicion = async (reserva) => {
        try {
            const response = await fetch(`https://escaperoom-backend.onrender.com/reservas/update/${reserva.ID_reservas}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    FK_ID_horarios: formEditar.FK_ID_horarios,
                    FK_ID_salas: reserva.FK_ID_salas,
                    FK_ID_usuarios: reserva.FK_ID_usuarios,
                    fecha: formEditar.fecha,
                    jugadores: formEditar.jugadores,
                    estado: reserva.estado
                })
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Reserva actualizada',
                    text: 'Los cambios han sido guardados',
                    background: '#112117',
                    color: '#ffffff',
                    confirmButtonColor: '#36e27b',
                    timer: 2000
                });
                cancelarEdicion();
                cargarReservas();
            } else {
                throw new Error('Error al actualizar');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la reserva',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b'
            });
        }
    };

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="mis-reservas-loading">
                <div className="spinner"></div>
                <p>Cargando tus reservas...</p>
            </div>
        );
    }

    return (
        <div className="mis-reservas-page">
            <header className="mis-reservas-header">
                <div className="header-content-reservas" style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => navigate('/inicio')} className="btn-back" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: '1.5rem' }}>
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 style={{ color: '#fff', margin: 0 }}>Mis Reservas</h1>
                    </div>
                </div>
            </header>

            <main className="mis-reservas-main">
                {reservas.length === 0 ? (
                    <div className="no-reservas">
                        <span className="material-symbols-outlined">event_busy</span>
                        <h2>No tienes reservas</h2>
                        <p>Cuando reserves una sala, aparecerá aquí</p>
                        <button onClick={() => navigate('/inicio')} className="btn-reservar-ahora">
                            Explorar Salas
                        </button>
                    </div>
                ) : (
                    <div className="reservas-grid">
                        {reservas.map((reserva) => (
                            <div key={reserva.ID_reservas} className="reserva-card">
                                {editando === reserva.ID_reservas ? (
                                    <div className="reserva-editar">
                                        <h3>{reserva.sala?.nombre}</h3>
                                        
                                        <div className="form-editar">
                                            <label>
                                                <span>Fecha:</span>
                                                <input
                                                    type="date"
                                                    value={formEditar.fecha}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => setFormEditar({
                                                        ...formEditar,
                                                        fecha: e.target.value
                                                    })}
                                                />
                                            </label>

                                            <label>
                                                <span>Jugadores:</span>
                                                <div className="jugadores-edit">
                                                    <button
                                                        onClick={() => setFormEditar({
                                                            ...formEditar,
                                                            jugadores: Math.max(1, formEditar.jugadores - 1)
                                                        })}
                                                    >
                                                        <span className="material-symbols-outlined">remove</span>
                                                    </button>
                                                    <span>{formEditar.jugadores}</span>
                                                    <button
                                                        onClick={() => setFormEditar({
                                                            ...formEditar,
                                                            jugadores: Math.min(reserva.sala.capacidad, formEditar.jugadores + 1)
                                                        })}
                                                    >
                                                        <span className="material-symbols-outlined">add</span>
                                                    </button>
                                                </div>
                                            </label>

                                            <div className="acciones-editar">
                                                <button onClick={() => guardarEdicion(reserva)} className="btn-guardar">
                                                    <span className="material-symbols-outlined">check</span>
                                                    Guardar
                                                </button>
                                                <button onClick={cancelarEdicion} className="btn-cancelar">
                                                    <span className="material-symbols-outlined">close</span>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="reserva-imagen">
                                            <img
                                                src={`/images/${reserva.sala?.nombre.replace(/\s+/g, '-').toLowerCase()}.jpg`}
                                                alt={reserva.sala?.nombre}
                                                onError={(e) => {
                                                    e.target.src = '/images/no-image.jpg';
                                                }}
                                            />
                                        </div>

                                        <div className="reserva-info">
                                            <h3>{reserva.sala?.nombre}</h3>
                                            
                                            <div className="reserva-detalles">
                                                <p>
                                                    <span className="material-symbols-outlined">calendar_today</span>
                                                    <span className="detalle-texto">{formatearFecha(reserva.fecha)}</span>
                                                </p>
                                                <p>
                                                    <span className="material-symbols-outlined">schedule</span>
                                                    <span className="detalle-texto">{reserva.horario?.hora_inicio?.substring(0, 5)}</span>
                                                </p>
                                                <p>
                                                    <span className="material-symbols-outlined">group</span>
                                                    <span className="detalle-texto">{reserva.jugadores} jugadores</span>
                                                </p>
                                                <p>
                                                    <span className="material-symbols-outlined">payments</span>
                                                    <span className="detalle-texto">${reserva.precio_total}</span>
                                                </p>
                                                <p className="estado">
                                                    <span className={`badge-estado ${reserva.estado}`}>
                                                        {reserva.estado}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="reserva-acciones">
                                                <button 
                                                    onClick={() => iniciarEdicion(reserva)}
                                                    className="btn-editar"
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                    Editar
                                                </button>
                                                <button 
                                                    onClick={() => eliminarReserva(reserva.ID_reservas)}
                                                    className="btn-eliminar"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}