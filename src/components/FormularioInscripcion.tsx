import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CalendarPlus,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Mail,
  MapPin,
  Monitor,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  CAMPUS_USM,
  CARRERAS_ALERTAS_USM,
  descargarCalendarioICS,
  formatFechaLarga,
  type EventoUSM,
} from "@/data/eventos";
import { useEventosUser } from "@/lib/eventos-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ErroresFormulario = {
  nombre?: string;
  correo?: string;
  carrera?: string;
  campus?: string;
};

export function FormularioInscripcion({ evento }: { evento: EventoUSM }) {
  const {
    perfil,
    alertas,
    obtenerInscripcion,
    inscribirEvento,
    cancelarInscripcion,
    activarAlertaRapida,
    abrirAlertasDialog,
  } = useEventosUser();

  const inscripcionActual = obtenerInscripcion(evento.id);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const carreraPorDefecto =
    evento.carrera !== "Todas las carreras" ? evento.carrera : "";

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [carrera, setCarrera] = useState(carreraPorDefecto);
  const [campus, setCampus] = useState(evento.campus);
  const [modalidadAsistencia, setModalidadAsistencia] = useState<
    "Presencial" | "Online"
  >(evento.modalidad === "Online" ? "Online" : "Presencial");
  const [suscribirAlertas, setSuscribirAlertas] = useState(true);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);

  // Pre-rellenar con datos guardados del estudiante cuando existan (Heurística: Eficiencia de uso)
  useEffect(() => {
    setNombre((prev) => prev || perfil.nombre || "");
    setCorreo((prev) => prev || perfil.correo || alertas.correo || "");
    setCarrera(
      (prev) => prev || perfil.carrera || carreraPorDefecto || "",
    );
    setCampus((prev) => prev || perfil.campus || evento.campus);
  }, [
    perfil.nombre,
    perfil.correo,
    perfil.carrera,
    perfil.campus,
    alertas.correo,
    carreraPorDefecto,
    evento.campus,
  ]);

  // Reiniciar modalidad al cambiar de evento
  useEffect(() => {
    setModalidadAsistencia(
      evento.modalidad === "Online" ? "Online" : "Presencial",
    );
    setConfirmandoCancelacion(false);
    setErrores({});
  }, [evento.id, evento.modalidad]);

  // Carreras candidatas para suscripción automática desde este formulario
  const carrerasObjetivoAlerta = useMemo(() => {
    const lista = new Set<string>();
    if (evento.carrera && evento.carrera !== "Todas las carreras") {
      lista.add(evento.carrera);
    }
    if (carrera && carrera !== "Todas las carreras") {
      lista.add(carrera);
    }
    return Array.from(lista);
  }, [evento.carrera, carrera]);

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: ErroresFormulario = {};

    if (nombre.trim().length < 3) {
      nuevosErrores.nombre = "Por favor ingresa tu nombre y apellido.";
    }
    if (!EMAIL_REGEX.test(correo.trim())) {
      nuevosErrores.correo =
        "Ingresa un correo válido (ej: javiera.munoz@usm.cl).";
    }
    if (!carrera) {
      nuevosErrores.carrera = "Selecciona tu carrera USM.";
    }
    if (!campus) {
      nuevosErrores.campus = "Selecciona tu campus o sede.";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const comprobante = inscribirEvento({
      eventoId: evento.id,
      nombre,
      correo,
      carrera,
      campus,
      modalidadAsistencia,
      carrerasAlertaSeleccionadas: suscribirAlertas
        ? carrerasObjetivoAlerta
        : [],
    });

    toast.success("¡Inscripción confirmada inmediatamente!", {
      description: `Código ${comprobante.codigoReserva} • ${evento.titulo}`,
    });

    // Desplazar suavemente hacia el comprobante en móviles para visibilidad inmediata
    requestAnimationFrame(() => {
      contenedorRef.current?.scrollIntoView?.({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };

  // ============================================================================
  // CASO 1: EVENTO CON ACCESO LIBERADO (SIN INSCRIPCIÓN OBLIGATORIA)
  // ============================================================================
  if (!evento.requiereInscripcion) {
    const carreraSugerida =
      evento.carrera !== "Todas las carreras" ? evento.carrera : undefined;
    const yaSuscritoSugerida =
      carreraSugerida && alertas.carreras.includes(carreraSugerida);

    return (
      <section
        id="seccion-inscripcion"
        ref={contenedorRef}
        aria-labelledby="titulo-acceso-liberado"
        className="scroll-mt-20 rounded-2xl border bg-card p-5 shadow-xs sm:p-7"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div>
              <h2
                id="titulo-acceso-liberado"
                className="text-lg font-bold text-foreground sm:text-xl"
              >
                Evento de Acceso Liberado
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Esta actividad no requiere inscripción previa. Solo debes
                asistir directamente en la fecha y ubicación indicadas en la
                ficha resumen.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              descargarCalendarioICS(evento);
              toast.success("Archivo de calendario descargado (.ics)");
            }}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:bg-accent"
          >
            <CalendarPlus className="h-4 w-4 text-primary" />
            Agendar en mi calendario
          </button>
        </div>

        {/* Bloque de suscripción a alertas por carrera incluso en eventos liberados */}
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  {yaSuscritoSugerida
                    ? `Ya recibes alertas de ${carreraSugerida}`
                    : "¿Quieres recibir alertas de próximos eventos de tu carrera?"}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {yaSuscritoSugerida
                    ? `Enviaremos avisos de nuevas actividades a ${alertas.correo}.`
                    : "Configura notificaciones personalizadas por carrera en tu correo institucional USM."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => abrirAlertasDialog(carreraSugerida)}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <BellRing className="h-4 w-4" />
              {yaSuscritoSugerida
                ? "Gestionar alertas"
                : carreraSugerida
                  ? `Suscribir alertas de ${carreraSugerida}`
                  : "Suscribirme a alertas por carrera"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================================
  // CASO 2: INSCRIPCIÓN YA CONFIRMADA (CONFIRMACIÓN INMEDIATA)
  // ============================================================================
  if (inscripcionActual) {
    const carreraRelevante =
      evento.carrera !== "Todas las carreras"
        ? evento.carrera
        : inscripcionActual.carrera;
    const tieneAlertaCarrera = alertas.carreras.includes(carreraRelevante);

    return (
      <section
        id="seccion-inscripcion"
        ref={contenedorRef}
        role="status"
        aria-live="polite"
        aria-labelledby="titulo-confirmacion-inmediata"
        className="scroll-mt-20 overflow-hidden rounded-2xl border-2 border-success/40 bg-card shadow-sm"
      >
        {/* Cabecera de confirmación inmediata */}
        <div className="bg-success/12 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground shadow-xs">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <div>
                <span className="inline-block rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-bold text-success">
                  Confirmación inmediata
                </span>
                <h2
                  id="titulo-confirmacion-inmediata"
                  className="mt-1 text-lg font-bold text-foreground sm:text-xl"
                >
                  ¡Tu inscripción está confirmada!
                </h2>
              </div>
            </div>

            <div className="rounded-lg border border-success/30 bg-card px-3.5 py-2 text-left sm:text-right">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Código de reserva
              </span>
              <span className="font-mono text-sm font-bold text-foreground">
                {inscripcionActual.codigoReserva}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-foreground/85 sm:text-sm">
            {inscripcionActual.modalidadAsistencia === "Online" ? (
              <>
                Tu acceso en modalidad <strong>Online</strong> quedó registrado.
                Enviamos el comprobante y el enlace de conexión a{" "}
                <strong>{inscripcionActual.correo}</strong>.
              </>
            ) : (
              <>
                Tu cupo <strong>Presencial</strong> está reservado en{" "}
                <strong>
                  {evento.lugar} ({evento.campus})
                </strong>
                . Enviamos una copia del comprobante a{" "}
                <strong>{inscripcionActual.correo}</strong>.
              </>
            )}
          </p>
        </div>

        {/* Cuerpo del comprobante */}
        <div className="space-y-5 p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-3.5 rounded-xl border bg-muted/35 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Estudiante inscrito(a)
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {inscripcionActual.nombre}
              </p>
              <p className="text-xs text-muted-foreground">
                {inscripcionActual.correo}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Carrera y Campus
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {inscripcionActual.carrera}
              </p>
              <p className="text-xs text-muted-foreground">
                Campus {inscripcionActual.campus}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Fecha y horario
              </p>
              <p className="mt-0.5 text-sm font-semibold capitalize text-foreground">
                {formatFechaLarga(evento.fecha)}
              </p>
              <p className="text-xs text-muted-foreground">
                {evento.hora} a {evento.horaTermino} hrs
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Modalidad registrada
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {inscripcionActual.modalidadAsistencia === "Online" ? (
                  <Monitor className="h-4 w-4 text-primary" />
                ) : (
                  <MapPin className="h-4 w-4 text-primary" />
                )}
                {inscripcionActual.modalidadAsistencia}
              </p>
              <p className="text-xs text-muted-foreground">{evento.lugar}</p>
            </div>
          </div>

          {/* Estado de suscripción a alertas por carrera */}
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
            {tieneAlertaCarrera ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <BellRing className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Suscripción a alertas por carrera activa
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Recibirás alertas en{" "}
                      <strong>{alertas.correo || inscripcionActual.correo}</strong>{" "}
                      sobre nuevos eventos de{" "}
                      <strong>{alertas.carreras.join(", ")}</strong>.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => abrirAlertasDialog(carreraRelevante)}
                  className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-card px-3.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  Gestionar alertas
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      ¿Te gustaría recibir avisos de próximos eventos de{" "}
                      {carreraRelevante}?
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Activa alertas con un clic usando tu correo{" "}
                      <strong>{inscripcionActual.correo}</strong>.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    activarAlertaRapida(
                      inscripcionActual.correo,
                      carreraRelevante,
                    );
                    toast.success(
                      `Alertas activadas para ${carreraRelevante}`,
                    );
                  }}
                  className="inline-flex min-h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Activar alertas con 1 clic
                </button>
              </div>
            )}
          </div>

          {/* Acciones post-confirmación */}
          <div className="flex flex-col gap-2.5 border-t pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  descargarCalendarioICS(
                    evento,
                    inscripcionActual.codigoReserva,
                  );
                  toast.success("Evento descargado para tu calendario (.ics)");
                }}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <CalendarPlus className="h-4 w-4" />
                Agregar a mi calendario
              </button>

              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-input bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:bg-accent"
              >
                Explorar más eventos
              </Link>
            </div>

            {!confirmandoCancelacion ? (
              <button
                type="button"
                onClick={() => setConfirmandoCancelacion(true)}
                className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10"
              >
                Cancelar mi inscripción
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                <span className="flex items-center gap-1 text-xs font-medium text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  ¿Liberar tu cupo?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    cancelarInscripcion(evento.id);
                    setConfirmandoCancelacion(false);
                    toast.info("Tu inscripción fue cancelada.");
                  }}
                  className="inline-flex min-h-8 cursor-pointer items-center rounded-md bg-destructive px-2.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmandoCancelacion(false)}
                  className="inline-flex min-h-8 cursor-pointer items-center rounded-md border bg-card px-2.5 text-xs font-medium text-foreground hover:bg-accent"
                >
                  Conservar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ============================================================================
  // CASO 3: FORMULARIO DE INSCRIPCIÓN + SUSCRIPCIÓN A ALERTAS POR CARRERA
  // ============================================================================
  const cuposRestantes = evento.cuposDisponibles ?? 20;

  return (
    <section
      id="seccion-inscripcion"
      ref={contenedorRef}
      aria-labelledby="titulo-formulario-inscripcion"
      className="scroll-mt-20 rounded-2xl border bg-card p-5 shadow-xs sm:p-7"
    >
      <div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <ClipboardCheck className="h-4 w-4" />
            Reserva de cupo estudiantil
          </div>
          <h2
            id="titulo-formulario-inscripcion"
            className="mt-1 text-xl font-bold text-foreground sm:text-2xl"
          >
            Inscripción al evento
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Completa tus datos para obtener tu confirmación inmediata en
            pantalla.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <UserCheck className="h-3.5 w-3.5" />
          {cuposRestantes} cupos disponibles
        </span>
      </div>

      <form onSubmit={manejarSubmit} noValidate className="mt-5 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nombre completo */}
          <div>
            <label
              htmlFor="ins-nombre"
              className="block text-sm font-medium text-foreground"
            >
              Nombre y apellido <span className="text-destructive">*</span>
            </label>
            <input
              id="ins-nombre"
              type="text"
              autoComplete="name"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errores.nombre)
                  setErrores((prev) => ({ ...prev, nombre: undefined }));
              }}
              placeholder="Ej: Javiera Muñoz"
              aria-invalid={!!errores.nombre}
              className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
            />
            {errores.nombre && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-destructive"
              >
                {errores.nombre}
              </p>
            )}
          </div>

          {/* Correo USM */}
          <div>
            <label
              htmlFor="ins-correo"
              className="block text-sm font-medium text-foreground"
            >
              Correo electrónico USM <span className="text-destructive">*</span>
            </label>
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="ins-correo"
                type="email"
                autoComplete="email"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (errores.correo)
                    setErrores((prev) => ({ ...prev, correo: undefined }));
                }}
                placeholder="Ej: javiera.munoz@usm.cl"
                aria-invalid={!!errores.correo}
                className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
              />
            </div>
            {errores.correo ? (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-destructive"
              >
                {errores.correo}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Acepta correo institucional (@usm.cl / @sansano.usm.cl) o
                personal.
              </p>
            )}
          </div>

          {/* Carrera */}
          <div>
            <label
              htmlFor="ins-carrera"
              className="block text-sm font-medium text-foreground"
            >
              Carrera <span className="text-destructive">*</span>
            </label>
            <select
              id="ins-carrera"
              value={carrera}
              onChange={(e) => {
                setCarrera(e.target.value);
                if (errores.carrera)
                  setErrores((prev) => ({ ...prev, carrera: undefined }));
              }}
              aria-invalid={!!errores.carrera}
              className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
            >
              <option value="">Selecciona tu carrera...</option>
              {CARRERAS_ALERTAS_USM.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errores.carrera && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-destructive"
              >
                {errores.carrera}
              </p>
            )}
          </div>

          {/* Campus */}
          <div>
            <label
              htmlFor="ins-campus"
              className="block text-sm font-medium text-foreground"
            >
              Campus o sede <span className="text-destructive">*</span>
            </label>
            <select
              id="ins-campus"
              value={campus}
              onChange={(e) => {
                setCampus(e.target.value);
                if (errores.campus)
                  setErrores((prev) => ({ ...prev, campus: undefined }));
              }}
              aria-invalid={!!errores.campus}
              className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
            >
              <option value="">Selecciona tu campus...</option>
              {CAMPUS_USM.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errores.campus && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-destructive"
              >
                {errores.campus}
              </p>
            )}
          </div>
        </div>

        {/* Selector de modalidad de asistencia si el evento es Híbrido */}
        {evento.modalidad === "Híbrida" && (
          <div>
            <span className="block text-sm font-medium text-foreground">
              ¿Cómo asistirás a este evento híbrido?
            </span>
            <div className="mt-1.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setModalidadAsistencia("Presencial")}
                className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition ${
                  modalidadAsistencia === "Presencial"
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-input bg-background text-foreground hover:bg-accent/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Presencial en {evento.campus}
                </span>
                {modalidadAsistencia === "Presencial" && (
                  <Check className="h-4 w-4 shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setModalidadAsistencia("Online")}
                className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition ${
                  modalidadAsistencia === "Online"
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-input bg-background text-foreground hover:bg-accent/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 shrink-0" />
                  Online vía transmisión Zoom
                </span>
                {modalidadAsistencia === "Online" && (
                  <Check className="h-4 w-4 shrink-0" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Suscripción integrada a alertas por carrera */}
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
          <label
            htmlFor="ins-suscribir-alerta"
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              id="ins-suscribir-alerta"
              type="checkbox"
              checked={suscribirAlertas}
              onChange={(e) => setSuscribirAlertas(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-input accent-primary"
            />
            <div className="flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <BellRing className="h-4 w-4 text-primary" />
                Suscribirme a alertas de nuevos eventos por carrera
              </span>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {carrerasObjetivoAlerta.length > 0 ? (
                  <>
                    Te notificaremos por correo cuando se publiquen próximas
                    charlas o talleres de{" "}
                    <strong className="text-foreground">
                      {carrerasObjetivoAlerta.join(" y ")}
                    </strong>
                    .
                  </>
                ) : (
                  <>
                    Selecciona tu carrera arriba para activar notificaciones
                    automáticas de nuevas actividades relacionadas.
                  </>
                )}
              </p>
            </div>
          </label>
        </div>

        {/* Botón de envío */}
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Los campos marcados con <span className="text-destructive">*</span>{" "}
            son obligatorios.
          </p>

          <button
            type="submit"
            className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirmar inscripción
          </button>
        </div>
      </form>
    </section>
  );
}
