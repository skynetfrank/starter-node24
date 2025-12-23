import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideSplash } from "../slices/splashSlice";
import { MonitorSmartphone } from "lucide-react";

const SplashScreen = () => {
  const isVisible = useSelector((state) => state.splash.isVisible);
  const dispatch = useDispatch();
  // Estado local para controlar la animación de salida
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Tiempo total antes de que comience a desvanecerse:
      // 1.5s (animación de entrada) + 1s (pausa) = 2.5s
      const timeBeforeFadeOut = 2500;

      const fadeOutTimer = setTimeout(() => {
        // 1. Activa la animación de desvanecimiento
        setIsFadingOut(true);

        // 2. Despacha la acción para ocultar el splash DESPUÉS de que termine la animación de salida
        setTimeout(() => {
          dispatch(hideSplash());
        }, 500); // Esta duración debe coincidir con la animación 'fadeOut' en el CSS
      }, timeBeforeFadeOut);

      // Limpieza del temporizador si el componente se desmonta
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isVisible, dispatch]);

  // Si no es visible en el estado de Redux, no renderizamos nada.
  if (!isVisible) return null;

  // Construimos las clases CSS para controlar las animaciones
  const splashClasses = `splash-screen splash-screen-fade-in ${isFadingOut ? "splash-screen-fade-out" : ""}`;

  return (
    <div className={splashClasses}>
      <h1 className="splash-text">i-Catalogo</h1>
      <MonitorSmartphone size={100} className="splash-icon" />
    </div>
  );
};

export default SplashScreen;
