import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../assets/js/api';
import { setCurrentUser } from '../assets/js/session';
import { validarRut, validarEmail, validarTelefonoChile, setFieldError, formatearTelefonoChile, formatearRut } from '../assets/js/validaciones';

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  return (
<main className="flex-grow-1 main">
  <section id="auth-section" className="starter-section auth-section section auth-container">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="auth-form">
            {!isRegister ? (
              <h2 id="formTitle" className="text-center mb-4">Iniciar Sesión</h2>
            ) : (
              <h3 id="registerTitle" className="text-center mb-4">Crear Cuenta</h3>
            )}
            {/* Formulario de Login */}
            {!isRegister && (
            <form id="loginForm" onSubmit={async (e) => {
              e.preventDefault();
              setLoginError('');
              const email = document.getElementById('username').value.trim();
              const password = document.getElementById('password').value;
              try {
                const users = await Api.users();
                // Regla simple: si encuentra email, loguea; si es admin@example.com => role admin
                const user = users.find(u => u.email === email);
                if (!user) {
                  setLoginError('Usuario no encontrado');
                  return;
                }
                if (user.contrasena !== password) {
                  setLoginError('Contraseña incorrecta');
                  return;
                }
                setCurrentUser(user);
                if (user.rol === 'admin') navigate('/admin'); else navigate('/');
              } catch (err) {
                setLoginError('Error de autenticación');
              }
            }}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Usuario o Email</label>
                <input type="text" className="form-control" id="username" required />
                <div id="usernameError" className="error-message" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="password" required />
              </div>
              <div id="passwordError" className="error-message text-danger small">{loginError}</div>
              <div className="d-grid gap-2 d-md-flex justify-content-center">
                <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">Ingresar</button>
                <button type="button" id="showRegister" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold" onClick={() => setIsRegister(true)}>Crear Cuenta</button>
              </div>
            </form>
            )}
            {/* Formulario de Registro */}
            {isRegister && (
            <form id="registerForm" noValidate onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const rut = form.querySelector('#rut');
              const email = form.querySelector('#email');
              const tel = form.querySelector('#telefono');
              const pass = form.querySelector('#newPassword');
              const pass2 = form.querySelector('#confirmPassword');
              const rutError = form.querySelector('#rutError');
              const emailError = form.querySelector('#emailError');
              const telError = form.querySelector('#telefonoError');
              const passError = form.querySelector('#newPasswordError');
              const pass2Error = form.querySelector('#confirmPasswordError');
              let ok = true;
              // RUT
              if (rut.value) rut.value = formatearRut(rut.value);
              if (!validarRut(rut.value)) { setFieldError(rut, rutError, 'RUT inválido'); ok = false; } else { setFieldError(rut, rutError, ''); }
              // Email
              if (!validarEmail(email.value)) { setFieldError(email, emailError, 'Correo inválido'); ok = false; } else { setFieldError(email, emailError, ''); }
              // Teléfono
              if (tel.value) tel.value = formatearTelefonoChile(tel.value);
              if (!validarTelefonoChile(tel.value)) { setFieldError(tel, telError, 'Formato: 9 1234 5678'); ok = false; } else { setFieldError(tel, telError, ''); }
              // Password
              if (!pass.value || pass.value.length < 8) { setFieldError(pass, passError, 'Mínimo 8 caracteres'); ok = false; } else { setFieldError(pass, passError, ''); }
              if (pass2.value !== pass.value) { setFieldError(pass2, pass2Error, 'Las contraseñas no coinciden'); ok = false; } else { setFieldError(pass2, pass2Error, ''); }
              if (!ok) return;
              form.reset();
              setIsRegister(false);
            }}>
              <div className="mb-3">
                <label htmlFor="newUsername" className="form-label">Nombre de Usuario</label>
                <input type="text" className="form-control" id="newUsername" required />
                <div id="usernameError" className="error-message text-danger small" style={{display: 'none'}} />
              </div>
              <div className="mb-3">
                <label htmlFor="rut" className="form-label">RUT</label>
                <input type="text" className="form-control" id="rut" required placeholder="12.345.678-9" />
                <div id="rutError" className="error-message text-danger small" style={{display: 'none'}} />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" required autoComplete="email" placeholder="correo@ejemplo.com" />
                <div id="emailError" className="error-message text-danger small" style={{display: 'none'}} />
              </div>
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">Contraseña</label>
                <input type="password" className="form-control" id="newPassword" required placeholder="Mínimo 8 caracteres" />
                <div id="newPasswordError" className="error-message text-danger small" style={{display: 'none'}} />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                <input type="password" className="form-control" id="confirmPassword" required placeholder="Repite la contraseña" />
                <div id="confirmPasswordError" className="error-message text-danger small" style={{display: 'none'}} />
              </div>
              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input type="text" className="form-control" id="telefono" required placeholder="9 1234 5678" />
                <div id="telefonoError" className="error-message text-danger small" style={{display: 'none'}} />
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-center">
                <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">Registrarse</button>
                <button type="button" id="showLogin" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold" onClick={() => setIsRegister(false)}>Volver a Login</button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

  );
}

export default Auth;
