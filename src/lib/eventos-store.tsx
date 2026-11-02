import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FrecuenciaAlerta = "inmediata" | "semanal";

export type InscripcionConfirmada = {
  eventoId: number;
  codigoReserva: string;
  nombre: string;
  correo: string;
  carrera: string;
  campus: string;
  modalidadAsistencia: "Presencial" | "Online";
  fechaInscripcion: string;
  carrerasAlertaActivadas: string[];
};

export type SuscripcionAlertas = {
  correo: string;
  carreras: string[];
  frecuencia: FrecuenciaAlerta;
  actualizadoEn: string;
};

export type PerfilEstudiante = {
  nombre: string;
  correo: string;
  carrera: string;
  campus: string;
};

export type RegistrarInscripcionInput = {
  eventoId: number;
  nombre: string;
  correo: string;
  carrera: string;
  campus: string;
  modalidadAsistencia: "Presencial" | "Online";
  carrerasAlertaSeleccionadas?: string[];
};

type EventosStoreContextValue = {
  hidratado: boolean;
  inscripciones: InscripcionConfirmada[];
  alertas: SuscripcionAlertas;
  perfil: PerfilEstudiante;
  inscribirEvento: (datos: RegistrarInscripcionInput) => InscripcionConfirmada;
  cancelarInscripcion: (eventoId: number) => void;
  obtenerInscripcion: (eventoId: number) => InscripcionConfirmada | undefined;
  guardarSuscripcionAlertas: (
    correo: string,
    carreras: string[],
    frecuencia: FrecuenciaAlerta,
  ) => void;
  activarAlertaRapida: (correo: string, carrera: string) => void;
  quitarCarreraAlerta: (carrera: string) => void;
  cancelarTodasLasAlertas: () => void;
  alertasDialogAbierto: boolean;
  carreraPreseleccionadaAlerta: string | null;
  abrirAlertasDialog: (carreraPreseleccionada?: string) => void;
  cerrarAlertasDialog: () => void;
  misEventosAbierto: boolean;
  abrirMisEventos: () => void;
  cerrarMisEventos: () => void;
};

const STORAGE_KEY = "usm_eventos_mvp_state_v1";

const DEFAULT_ALERTAS: SuscripcionAlertas = {
  correo: "",
  carreras: [],
  frecuencia: "inmediata",
  actualizadoEn: "",
};

const DEFAULT_PERFIL: PerfilEstudiante = {
  nombre: "",
  correo: "",
  carrera: "",
  campus: "",
};

const EventosStoreContext = createContext<EventosStoreContextValue | null>(null);

function generarCodigoReserva(eventoId: number): string {
  const sufijo = Math.floor(1000 + Math.random() * 9000);
  const idPad = String(eventoId).padStart(2, "0");
  return `USM-EV${idPad}-${sufijo}`;
}

export function EventosUserProvider({ children }: { children: ReactNode }) {
  const [hidratado, setHidratado] = useState(false);
  const [inscripciones, setInscripciones] = useState<InscripcionConfirmada[]>([]);
  const [alertas, setAlertas] = useState<SuscripcionAlertas>(DEFAULT_ALERTAS);
  const [perfil, setPerfil] = useState<PerfilEstudiante>(DEFAULT_PERFIL);

  const [alertasDialogAbierto, setAlertasDialogAbierto] = useState(false);
  const [carreraPreseleccionadaAlerta, setCarreraPreseleccionadaAlerta] =
    useState<string | null>(null);
  const [misEventosAbierto, setMisEventosAbierto] = useState(false);

  // Hidratación segura en cliente (evita errores en SSR de TanStack Start)
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const parsed = JSON.parse(guardado) as {
          inscripciones?: InscripcionConfirmada[];
          alertas?: SuscripcionAlertas;
          perfil?: PerfilEstudiante;
        };
        if (Array.isArray(parsed.inscripciones)) {
          setInscripciones(parsed.inscripciones);
        }
        if (parsed.alertas && Array.isArray(parsed.alertas.carreras)) {
          setAlertas(parsed.alertas);
        }
        if (parsed.perfil) {
          setPerfil(parsed.perfil);
        }
      }
    } catch {
      // Ignorar errores de almacenamiento privado o JSON corrupto
    } finally {
      setHidratado(true);
    }
  }, []);

  // Persistencia reactiva tras hidratación
  useEffect(() => {
    if (!hidratado) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ inscripciones, alertas, perfil }),
      );
    } catch {
      // Ignorar cuota excedida
    }
  }, [hidratado, inscripciones, alertas, perfil]);

  const inscribirEvento = useCallback(
    (datos: RegistrarInscripcionInput): InscripcionConfirmada => {
      const correoLimpio = datos.correo.trim().toLowerCase();
      const nombreLimpio = datos.nombre.trim();
      const carrerasNuevas = (datos.carrerasAlertaSeleccionadas ?? []).filter(
        (c) => c && c !== "Todas las carreras",
      );

      const nuevaInscripcion: InscripcionConfirmada = {
        eventoId: datos.eventoId,
        codigoReserva: generarCodigoReserva(datos.eventoId),
        nombre: nombreLimpio,
        correo: correoLimpio,
        carrera: datos.carrera,
        campus: datos.campus,
        modalidadAsistencia: datos.modalidadAsistencia,
        fechaInscripcion: new Date().toISOString(),
        carrerasAlertaActivadas: carrerasNuevas,
      };

      setInscripciones((prev) => [
        ...prev.filter((item) => item.eventoId !== datos.eventoId),
        nuevaInscripcion,
      ]);

      setPerfil({
        nombre: nombreLimpio,
        correo: correoLimpio,
        carrera: datos.carrera,
        campus: datos.campus,
      });

      if (carrerasNuevas.length > 0) {
        setAlertas((prev) => {
          const combinadas = Array.from(
            new Set([...prev.carreras, ...carrerasNuevas]),
          ).sort();
          return {
            correo: correoLimpio || prev.correo,
            carreras: combinadas,
            frecuencia: prev.frecuencia || "inmediata",
            actualizadoEn: new Date().toISOString(),
          };
        });
      }

      return nuevaInscripcion;
    },
    [],
  );

  const cancelarInscripcion = useCallback((eventoId: number) => {
    setInscripciones((prev) => prev.filter((item) => item.eventoId !== eventoId));
  }, []);

  const obtenerInscripcion = useCallback(
    (eventoId: number) =>
      inscripciones.find((item) => item.eventoId === eventoId),
    [inscripciones],
  );

  const guardarSuscripcionAlertas = useCallback(
    (correo: string, carreras: string[], frecuencia: FrecuenciaAlerta) => {
      const correoLimpio = correo.trim().toLowerCase();
      const carrerasLimpias = Array.from(
        new Set(carreras.filter((c) => c && c !== "Todas las carreras")),
      ).sort();

      setAlertas({
        correo: correoLimpio,
        carreras: carrerasLimpias,
        frecuencia,
        actualizadoEn: new Date().toISOString(),
      });

      if (correoLimpio) {
        setPerfil((prev) => ({
          ...prev,
          correo: prev.correo || correoLimpio,
          carrera: prev.carrera || carrerasLimpias[0] || "",
        }));
      }
    },
    [],
  );

  const activarAlertaRapida = useCallback((correo: string, carrera: string) => {
    if (!carrera || carrera === "Todas las carreras") return;
    const correoLimpio = correo.trim().toLowerCase();
    setAlertas((prev) => ({
      correo: correoLimpio || prev.correo,
      carreras: Array.from(new Set([...prev.carreras, carrera])).sort(),
      frecuencia: prev.frecuencia || "inmediata",
      actualizadoEn: new Date().toISOString(),
    }));
  }, []);

  const quitarCarreraAlerta = useCallback((carrera: string) => {
    setAlertas((prev) => ({
      ...prev,
      carreras: prev.carreras.filter((c) => c !== carrera),
      actualizadoEn: new Date().toISOString(),
    }));
  }, []);

  const cancelarTodasLasAlertas = useCallback(() => {
    setAlertas((prev) => ({
      ...prev,
      carreras: [],
      actualizadoEn: new Date().toISOString(),
    }));
  }, []);

  const abrirAlertasDialog = useCallback((carreraPreseleccionada?: string) => {
    setCarreraPreseleccionadaAlerta(
      carreraPreseleccionada && carreraPreseleccionada !== "Todas las carreras"
        ? carreraPreseleccionada
        : null,
    );
    setAlertasDialogAbierto(true);
  }, []);

  const cerrarAlertasDialog = useCallback(() => {
    setAlertasDialogAbierto(false);
    setCarreraPreseleccionadaAlerta(null);
  }, []);

  const abrirMisEventos = useCallback(() => setMisEventosAbierto(true), []);
  const cerrarMisEventos = useCallback(() => setMisEventosAbierto(false), []);

  const value = useMemo<EventosStoreContextValue>(
    () => ({
      hidratado,
      inscripciones,
      alertas,
      perfil,
      inscribirEvento,
      cancelarInscripcion,
      obtenerInscripcion,
      guardarSuscripcionAlertas,
      activarAlertaRapida,
      quitarCarreraAlerta,
      cancelarTodasLasAlertas,
      alertasDialogAbierto,
      carreraPreseleccionadaAlerta,
      abrirAlertasDialog,
      cerrarAlertasDialog,
      misEventosAbierto,
      abrirMisEventos,
      cerrarMisEventos,
    }),
    [
      hidratado,
      inscripciones,
      alertas,
      perfil,
      inscribirEvento,
      cancelarInscripcion,
      obtenerInscripcion,
      guardarSuscripcionAlertas,
      activarAlertaRapida,
      quitarCarreraAlerta,
      cancelarTodasLasAlertas,
      alertasDialogAbierto,
      carreraPreseleccionadaAlerta,
      abrirAlertasDialog,
      cerrarAlertasDialog,
      misEventosAbierto,
      abrirMisEventos,
      cerrarMisEventos,
    ],
  );

  return (
    <EventosStoreContext.Provider value={value}>
      {children}
    </EventosStoreContext.Provider>
  );
}

export function useEventosUser(): EventosStoreContextValue {
  const ctx = useContext(EventosStoreContext);
  if (!ctx) {
    throw new Error("useEventosUser debe usarse dentro de EventosUserProvider");
  }
  return ctx;
}
