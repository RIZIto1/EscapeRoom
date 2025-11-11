import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
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
            title: 'Iniciando sesión...',
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
        if (!form.mail || !form.contrasenia) {
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

        setLoading(true);
        showLoadingAlert();

        try {
            const response = await fetch('http://localhost:3000/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
                // Login exitoso
                // Guardar token y datos del usuario en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                await Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Hola ${data.usuario.nombre}`,
                    background: '#112117',
                    color: '#ffffff',
                    confirmButtonColor: '#36e27b',
                    iconColor: '#36e27b',
                    timer: 2000,
                    timerProgressBar: true
                });

                // Redirigir según el rol del usuario
                if (data.usuario.rol === 'admin') {
                    navigate('/inicio'); 
                } else {
                    navigate('/inicio');
                }
            } else {
                // Error del servidor
                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar sesión',
                    text: data.error || 'Credenciales incorrectas',
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



export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-page">
            <div className="background">
                <div className="smoke"></div>
            </div>

            <div className="login-container">
                <div className="login-header">
                    <div className="icon-box">
                        <span className="material-symbols-outlined">key</span>
                    </div>
                    <h1>Iniciar Sesión</h1>
                </div>

                <div className="login-form">
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
                        <p>Usuario o Correo Electrónico</p>
                        <input type="text" placeholder="Introduce tu usuario o correo electrónico"/>
                    </label>

                    <label>
                        <p>Contraseña</p>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="contrasenia"
                                value={form.contrasenia}
                                onChange={handleChange}
                                placeholder="Introduce tu contraseña"
                                disabled={loading}
                            />
                            <span
                                className="material-symbols-outlined toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                            <input type={showPassword ? 'text' : 'password'} placeholder="Introduce tu contraseña"/>
                            <span className="material-symbols-outlined toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </div>
                    </label>

                    <p className="forgot">¿Olvidaste tu contraseña?</p>

                    <button
                        onClick={handleSubmit}
                        className="btn-login"
                        disabled={loading}
                    >
                        Iniciar Sesión
                    </button>

                    <p className="register">
                        ¿No tienes una cuenta? <a href="/registro">Regístrate</a>
                    </p>
                    <button className="btn-login">Iniciar Sesión</button>

                    <p className="register"> ¿No tienes una cuenta? <a href="#">Regístrate</a></p>
                </div>
            </div>
        </div>
    );
}