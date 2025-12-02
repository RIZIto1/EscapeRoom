import './register.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        mail: '',
        contrasenia: ''
    });

    // Actualiza el formulario cuando escribe el usuario
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const showLoadingAlert = () => {
        Swal.fire({
            title: 'Registrando...',
            background: '#112117',
            color: '#ffffff',
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            showConfirmButton: false
        });
    };

    // Envía el formulario
    const handleSubmit = async () => {
        if (!form.nombre || !form.apellido || !form.telefono || !form.mail || !form.contrasenia) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b',
                iconColor: '#f59e0b'
            });
            return;
        }

        if (form.contrasenia.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseña débil',
                text: 'La contraseña debe tener al menos 6 caracteres',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b',
                iconColor: '#f59e0b'
            });
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.mail)) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: 'Por favor ingresa un correo electrónico válido',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b',
                iconColor: '#e84a5f'
            });
            return;
        }

        setLoading(true);
        showLoadingAlert();

        try {
            const response = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                await Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente',
                    background: '#112117',
                    color: '#ffffff',
                    confirmButtonColor: '#36e27b',
                    iconColor: '#36e27b',
                    timer: 2000,
                    timerProgressBar: true
                });
                
                navigate('/');
            } else {
                // Error del servidor
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: data.error || 'Ocurrió un error. Intenta nuevamente.',
                    background: '#112117',
                    color: '#ffffff',
                    confirmButtonColor: '#36e27b',
                    iconColor: '#e84a5f'
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Verifica que esté corriendo.',
                background: '#112117',
                color: '#ffffff',
                confirmButtonColor: '#36e27b',
                iconColor: '#e84a5f'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="background">
                <div className="smoke"></div>
            </div>

            <div className="register-container">
                <div className="register-header">
                    <div className="icon-box">
                        <span className="material-symbols-outlined">person_add</span>
                    </div>
                    <h1>Crear Cuenta</h1>
                </div>

                <div className="register-form">
                    <label>
                        <p>Nombre</p>
                        <input 
                            type="text" 
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Juan"
                            disabled={loading}
                        />
                    </label>

                    <label>
                        <p>Apellido</p>
                        <input 
                            type="text" 
                            name="apellido"
                            value={form.apellido}
                            onChange={handleChange}
                            placeholder="Pérez"
                            disabled={loading}
                        />
                    </label>

                    <label>
                        <p>Teléfono</p>
                        <input 
                            type="tel" 
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="1140430332"
                            disabled={loading}
                        />
                    </label>

                    <label>
                        <p>Correo Electrónico</p>
                        <input 
                            type="email" 
                            name="mail"
                            value={form.mail}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            disabled={loading}
                        />
                    </label>

                    <label>
                        <p>Contraseña</p>
                        <div className="password-wrapper">
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                name="contrasenia"
                                value={form.contrasenia}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                disabled={loading}
                            />
                            <span 
                                className="material-symbols-outlined toggle-password" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </div>
                    </label>

                    <button 
                        onClick={handleSubmit}
                        className="btn-register"
                        disabled={loading}
                    >
                        Registrarse
                    </button>

                    <p className="login"> 
                        ¿Ya tienes una cuenta? <a href="/">Inicia sesión</a>
                    </p>
                </div>
            </div>
        </div>
    );
}