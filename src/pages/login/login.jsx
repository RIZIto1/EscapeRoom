import './login.css';
import { useState } from 'react';
import { loginUser } from '../../services/authService';


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

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <p className="text-red-500 text-sm mb-4 text-center">Error: {error.message}</p>
                    )}
                    <label>
                        <p>Usuario o Correo Electrónico</p>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Introduce tu usuario o correo electrónico" />
                    </label>

                    <label>
                        <p>Contraseña</p>
                        <div className="password-wrapper">
                            <input type={showPassword ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Introduce tu contraseña" />
                            <span className="material-symbols-outlined toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </div>
                    </label>

                    <p className="forgot">¿Olvidaste tu contraseña?</p>

                    <button type="submit" className="btn-login">Iniciar Sesión</button>

                    <p className="register"> ¿No tienes una cuenta? <a href="/registro">Regístrate</a></p>
                </form>
            </div>
        </div>
    );
}