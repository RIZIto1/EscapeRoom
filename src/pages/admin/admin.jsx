import './admin.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../config';

export default function Admin() {
    const navigate = useNavigate();
    const [salas, setSalas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        capacidad: '',
        tiempo: '',
        dificultad: 'MEDIA',
        precio: '',
        imagen: ''
    });

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        if (!usuario || usuario.rol !== 'admin') {
            navigate('/inicio');
            return;
        }
        cargarSalas();
    }, []);

    const cargarSalas = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3000/salas/getall');
            const data = await res.json();
            setSalas(data);
        } catch (error) {
            console.error('Error al cargar salas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las salas',
                background: '#0a0a0a',
                color: '#ffffff',
                confirmButtonColor: '#22c55e'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            capacidad: '',
            tiempo: '',
            dificultad: 'MEDIA',
            precio: '',
            imagen: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (sala) => {
        setFormData({
            nombre: sala.nombre,
            capacidad: sala.capacidad,
            tiempo: sala.tiempo,
            dificultad: sala.dificultad,
            precio: sala.precio,
            imagen: sala.imagen
        });
        setEditingId(sala.ID_salas);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.capacidad || !formData.tiempo || !formData.precio || !formData.imagen) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor completa todos los campos',
                background: '#0a0a0a',
                color: '#ffffff',
                confirmButtonColor: '#22c55e'
            });
            return;
        }

        try {
            const salaData = {
                nombre: formData.nombre,
                capacidad: parseInt(formData.capacidad),
                tiempo: parseInt(formData.tiempo),
                dificultad: formData.dificultad,
                precio: parseFloat(formData.precio),
                imagen: formData.imagen
            };

            let res;
            if (editingId) {
                res = await fetch(`http://localhost:3000/salas/update/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(salaData)
                });
            } else {
                res = await fetch('http://localhost:3000/salas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(salaData)
                });
            }

            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: editingId ? 'Sala actualizada' : 'Sala creada',
                    text: editingId ? 'La sala se ha actualizado exitosamente' : 'La sala se ha creado exitosamente',
                    background: '#0a0a0a',
                    color: '#ffffff',
                    confirmButtonColor: '#22c55e'
                });
                resetForm();
                cargarSalas();
            } else {
                const error = await res.json();
                throw new Error(error.error || 'Error al procesar la sala');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                background: '#0a0a0a',
                color: '#ffffff',
                confirmButtonColor: '#22c55e'
            });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar sala?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            background: '#0a0a0a',
            color: '#ffffff',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#555',
            showCancelButton: true,
            confirmButtonText: 'Eliminar'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:3000/salas/delete/${id}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminada',
                        background: '#0a0a0a',
                        color: '#ffffff',
                        confirmButtonColor: '#22c55e'
                    });
                    cargarSalas();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    if (loading) {
        return <div className="admin-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="admin-header-content" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigate('/inicio')} className="btn-back" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: '1.5rem' }}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h1>Admin</h1>
                </div>
            </header>

            <main className="admin-main">
                <div className="admin-toolbar">
                    <h2>Tus Salas</h2>
                    <button 
                        className="btn-crear"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <span className="material-symbols-outlined">add</span>
                        Nueva Sala
                    </button>
                </div>

                {showForm && (
                    <div className="form-container">
                        <h3>{editingId ? 'Editar Sala' : 'Nueva Sala'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre de la sala"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="capacidad"
                                placeholder="Capacidad (ej: 6)"
                                value={formData.capacidad}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="number"
                                name="tiempo"
                                placeholder="Tiempo (minutos)"
                                value={formData.tiempo}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="dificultad"
                                value={formData.dificultad}
                                onChange={handleChange}
                            >
                                <option value="BAJA">Baja</option>
                                <option value="MEDIA">Media</option>
                                <option value="ALTA">Alta</option>
                            </select>
                            <input
                                type="number"
                                name="precio"
                                placeholder="Precio por persona"
                                value={formData.precio}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                            <input
                                type="text"
                                name="imagen"
                                placeholder="URL de la imagen"
                                value={formData.imagen}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-buttons">
                                <button type="submit" className="btn-guardar">
                                    {editingId ? 'Actualizar' : 'Guardar'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-cancelar"
                                    onClick={resetForm}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="salas-grid">
                    {salas.map(sala => (
                        <div key={sala.ID_salas} className="sala-card">
                            <div className="sala-img">
                                <img 
                                    src={sala.imagen} 
                                    alt={sala.nombre}
                                    onError={(e) => {
                                        e.target.src = '/images/no-image.jpg';
                                    }}
                                />
                            </div>
                            <div className="sala-details">
                                <h3>{sala.nombre}</h3>
                                <p className="capacidad">
                                    <span className="material-symbols-outlined">group</span>
                                    {sala.capacidad} jugadores
                                </p>
                                <p className="tiempo">
                                    <span className="material-symbols-outlined">schedule</span>
                                    {sala.tiempo} min
                                </p>
                                <p className="precio">${sala.precio}/persona</p>
                                <div className="sala-buttons">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => handleEdit(sala)}
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                        Editar
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(sala.ID_salas)}
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}