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
            const response = await fetch('https://escaperoom-backend.onrender.com/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (response.ok) {
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

                if (data.usuario.rol === 'admin') {
                    navigate('/inicio'); 
                } else {
                    navigate('/inicio');
                }
            } else {
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

    return (
        <div className="login-page">
            <div className="background">
                <div className="smoke"></div>
            </div>

            <div className="login-container">
                <div className="login-header">
                    <h1>Iniciar Sesión</h1>
                </div>

                <form className="login-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <label>
                        <p>Correo Electrónico</p>
                        <input
                            type="text"
                            name="mail"
                            value={form.mail}
                            onChange={handleChange}
                            placeholder="Introduce tu correo electrónico"
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
                                placeholder="Introduce tu contraseña"
                                disabled={loading}
                            />
                            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} aria-label="Mostrar contraseña" style={{background:'transparent',border:'none'}}>
                                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </label>

                    <p className="forgot">¿Olvidaste tu contraseña?</p>

                    <button type="submit" className="btn-login" disabled={loading}>Iniciar Sesión</button>

<p className="register"> ¿No tienes una cuenta? <span onClick={() => navigate('/registro')} style={{color: '#36e27b', cursor: 'pointer', textDecoration: 'underline'}}>Regístrate</span></p>                </form>
            </div>
        </div>
    );
}