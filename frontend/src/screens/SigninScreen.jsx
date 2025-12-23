import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import { useSigninUserMutation } from "../api/usersApi";
import Button from "../components/Button";
import { userSignin as signinAction } from "../slices/userSlice";
import useApiNotification from "../hooks/useApiNotification"; // 1. Importar el hook de notificación
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function SigninScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@admin.com");
  const [password, setPassword] = useState("1234");
  const [showPassword, setShowPassword] = useState(false);

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const dispatch = useDispatch();

  // 2. Usar el hook de la mutación y obtener el estado completo
  const [signinUser, mutationState] = useSigninUserMutation();
  const { isLoading } = mutationState;

  // Obtenemos userInfo del estado global para saber si ya hay una sesión
  const { userInfo } = useSelector((state) => state.userSignin);

  // 3. Instanciar el hook de notificaciones
  useApiNotification(
    mutationState,
    {
      loading: "Iniciando sesión...",
      success: "¡Bienvenido Administrador!",
      error: (err) => err?.data?.message || "Ocurrió un error al iniciar sesión.",
    },
    () => navigate(redirect), // 4. Callback para redirigir en caso de éxito
    // 5. Opciones adicionales para las notificaciones
    {
      success: {
        timer: 1000, // La alerta se cerrará después de 2 segundos
        timerProgressBar: true, // Muestra una barra de progreso
        showConfirmButton: false, // Oculta el botón "OK"
      },
    }
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Sanitización básica en el frontend:
      // - Eliminar espacios en blanco al inicio y al final del email.
      const sanitizedEmail = email.trim();

      const userData = await signinUser({ email: sanitizedEmail, password }).unwrap();
      // 5. Si el login es exitoso, despachamos la acción para guardar los datos en el store
      dispatch(signinAction(userData));
      // La redirección ahora es manejada por el callback onSuccess del hook
    } catch (err) {
      // La notificación de error es manejada por el hook useApiNotification
      console.error("Failed to sign in:", err);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={submitHandler}>
        <h2>Administrador</h2>
        {/* 6. El mensaje de error ahora es manejado por la notificación, por lo que se elimina de aquí */}

        <div className="input-group">
          <Mail className="input-icon" />
          <input
            type="email"
            placeholder="Correo Electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="form-actions">
          <Button type="submit" size="large" disabled={isLoading} className="btn-with-icon">
            {isLoading ? <div className="spinner"></div> : <LogIn />}
            <span>{isLoading ? "Iniciando..." : "Iniciar Sesión"}</span>
          </Button>
        </div>

        {/* --- INICIO DE CORRECCIONES --- */}
        {/* Se ha eliminado el enlace de auto-registro para que solo los administradores
            puedan crear nuevos usuarios desde el panel de administración.
            Si en el futuro se desea reactivar el auto-registro, se puede descomentar este bloque.
        
        <div className="signin-footer"> ... </div>

        --- FIN DE CORRECCIONES --- */}
      </form>
    </div>
  );
}
