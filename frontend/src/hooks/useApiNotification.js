import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { showNotification } from "../utils/notification";

/**
 * Hook personalizado para manejar notificaciones automáticas para mutaciones de RTK Query.
 *
 * @param {object} mutationState - El objeto de estado devuelto por un hook de mutación de RTK Query.
 * @param {boolean} mutationState.isLoading - Estado de carga de la mutación.
 * @param {boolean} mutationState.isSuccess - Estado de éxito de la mutación.
 * @param {boolean} mutationState.isError - Estado de error de la mutación.
 * @param {object} mutationState.error - El objeto de error si isError es true.
 * @param {object} messages - Mensajes personalizados para cada estado.
 * @param {string} [messages.loading] - Mensaje para el estado de carga.
 * @param {string} messages.success - Mensaje para el estado de éxito.
 * @param {string|function} [messages.error] - Mensaje base para el estado de error, o una función que recibe el error y devuelve un string.
 * @param {object} [options] - Opciones adicionales.
 * @param {object} [options.success] - Opciones extra para la notificación de éxito (e.g., { timer: 2000 }).
 * @param {boolean} [options.showLoading=true] - Si es `false`, no se mostrará la notificación de carga.
 * @param {function} [onSuccess] - Callback a ejecutar cuando la mutación es exitosa.
 */
const useApiNotification = (
  { isLoading, isSuccess, isError, error },
  { loading: loadingMsg, success: successMsg, error: errorMsg = "Ocurrió un error." },
  onSuccess,
  options = {}
) => {
  // Extraemos las opciones con valores por defecto.
  const { showLoading = true, success: successOptions } = options;

  // Usamos una ref para evitar que las notificaciones se disparen múltiples veces
  // en un ciclo de vida de la mutación.
  const notificationShownRef = useRef(false);

  useEffect(() => {
    // 1. Mostrar notificación de carga
    if (isLoading && !notificationShownRef.current && showLoading) {
      notificationShownRef.current = true; // Marcamos que hemos iniciado el ciclo
      Swal.fire({
        title: loadingMsg || "Procesando...",
        text: "Por favor, espera.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    }

    // 2. Mostrar notificación de éxito
    if (isSuccess && notificationShownRef.current) {
      Swal.close(); // Cerramos la alerta de carga

      // --- INICIO DE CORRECCIONES ---
      // Mostramos la notificación de éxito y hacemos que se cierre sola.
      showNotification({
        type: "success",
        title: "¡Éxito!",
        text: successMsg,
        // Opciones por defecto para una notificación de éxito fluida
        timer: 1500,
        showConfirmButton: false,
        ...successOptions,
      });
      // Ejecutamos el callback de éxito inmediatamente después.
      if (onSuccess) onSuccess();
      // --- FIN DE CORRECCIONES ---

      notificationShownRef.current = false; // Reseteamos para la próxima mutación
    }

    // 3. Mostrar notificación de error
    if (isError && notificationShownRef.current) {
      Swal.close(); // Cerramos la alerta de carga
      let apiError = errorMsg;
      if (typeof errorMsg === "function") {
        // Si el mensaje de error es una función, la ejecutamos con el error
        apiError = errorMsg(error);
      } else {
        // De lo contrario, usamos el mensaje de la API o el default
        apiError = error?.data?.message || errorMsg;
      }
      showNotification({ type: "error", title: "¡Error!", text: apiError });
      notificationShownRef.current = false; // Reseteamos para la próxima mutación
    }
  }, [isLoading, isSuccess, isError, error, successMsg, errorMsg, loadingMsg, onSuccess, showLoading, successOptions]);
};

export default useApiNotification;
