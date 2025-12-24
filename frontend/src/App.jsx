import { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { userSignout } from "./slices/userSlice"; // 1. Importar la nueva acción desde el slice
import SplashScreen from "./components/SplashScreen";
import ProfileMenu from "./components/ProfileMenu";
import Swal from "sweetalert2";
import { Sun, Moon, ShieldUser, MonitorSmartphone, Instagram, Facebook, Mail, HelpCircle, Menu, X } from "lucide-react";
import wassapIcon from "./assets/whatsapp.svg";

//version del 22 de Diciembre de 2025 para enviar a Rony para comercializar

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  const guestMenuRef = useRef(null);
  const userSignin = useSelector((state) => state.userSignin);
  const isSplashVisible = useSelector((state) => state.splash.isVisible);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (guestMenuRef.current && !guestMenuRef.current.contains(event.target)) {
        setIsGuestMenuOpen(false);
      }
    };

    if (isGuestMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGuestMenuOpen]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const signoutHandler = () => {
    dispatch(userSignout());

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: "success",
      title: "Sesión cerrada correctamente",
    });
  };

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <>
      <div className="grid-container">
        <header className="app-header">
          <Link to="/" className="header-logo-link" aria-label="Ir a la página de inicio">
            <MonitorSmartphone className="header-splash-icon" />
            <h1 className="header-splash-text">Starter-Node24</h1>
          </Link>
          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle-button"
              aria-label={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
            >
              <Sun className="theme-icon sun-icon" />
              <Moon className="theme-icon moon-icon" />
            </button>

            {userInfo ? (
              <ProfileMenu userInfo={userInfo} onSignout={signoutHandler} />
            ) : (
              <div className="profile-menu-container" ref={guestMenuRef}>
                <button
                  className={`header-icon-link ${isGuestMenuOpen ? "menu-active" : ""}`}
                  onClick={() => setIsGuestMenuOpen(!isGuestMenuOpen)}
                  aria-label={isGuestMenuOpen ? "Cerrar menú" : "Abrir menú"}
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  {isGuestMenuOpen ? <X /> : <Menu />}
                </button>
                <div className={`profile-menu ${isGuestMenuOpen ? "open" : ""}`}>
                  <Link to="/signin" onClick={() => setIsGuestMenuOpen(false)}>
                    <ShieldUser size={18} />
                    Administrador
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <div className="footer-content">
            <div className="company-info">
              <h4>Tu Empresa Aqui</h4>
              <p>RIF: J-12345678-9</p>
              <p>
                Av. Francisco Miranda, Urb. Los Cortijos de Lourdes, Edificio Don Manuel, Local p-05, Caracas, Venezuela
              </p>
            </div>
            <div className="social-links-column">
              <p>Siguenos en nuestras redes sociales</p>
              <div className="social-icons">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                {/* Para TikTok, puedes usar un SVG o un ícono de otra librería si lo prefieres */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="tiktok-icon"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-1.06-.6-1.9-1.44-2.46-2.45-1.2-2.14-1.28-4.88-.16-7.18.65-1.31 1.62-2.38 2.86-3.15.24-.15.5-.27.76-.37.04-1.5.04-2.99.04-4.49.01-1.56-.01-3.12.01-4.68.85-.28 1.68-.59 2.49-.9.09-.03.17-.07.26-.1.01.7.01 1.4.01 2.1.02 1.51.02 3.02.01 4.53-.31.02-.61.05-.92.08-.43.04-.86.12-1.28.25-.9.28-1.7.79-2.33 1.5-.79.89-1.11 2.05-1.01 3.2.11 1.2.63 2.31 1.46 3.11.9.88 2.09 1.36 3.33 1.37 1.31.01 2.59-.52 3.53-1.48.81-.82 1.26-1.9 1.23-3.05-.02-1.17-.48-2.26-1.26-3.08-.25-.26-.53-.48-.83-.66-.01-.76.01-1.53.01-2.29z" />
                  </svg>
                </a>
                <a href="mailto:contacto@icatalogo.com" aria-label="Correo Electrónico">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      {/* Botón flotante de WhatsApp */}
      <a
        href="https://wa.me/584142729853?text=Buenos%20Dias"
        className="floating-whatsapp-btn"
        aria-label="Contactar por WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={wassapIcon} alt="WhatsApp" className="wassap-icon" />
      </a>
    </>
  );
}

export default App;
