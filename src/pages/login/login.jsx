import './login.css';
import { useState } from 'react';



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
                        <p>Usuario o Correo Electrónico</p>
                        <input type="text" placeholder="Introduce tu usuario o correo electrónico"/>
                    </label>

                    <label>
                        <p>Contraseña</p>
                        <div className="password-wrapper">
                            <input type={showPassword ? 'text' : 'password'} placeholder="Introduce tu contraseña"/>
                            <span className="material-symbols-outlined toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                        </div>
                    </label>

                    <p className="forgot">¿Olvidaste tu contraseña?</p>

                    <button className="btn-login">Iniciar Sesión</button>

                    <p className="register"> ¿No tienes una cuenta? <a href="#">Regístrate</a></p>
                </div>
            </div>
        </div>
    );
}