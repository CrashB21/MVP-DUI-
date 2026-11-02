import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  BellRing,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Info,
  ListChecks,
  MapPin,
  Monitor,
  Radio,
  Target,
  Users,
} from "lucide-react";

import { FormularioInscripcion } from "@/components/FormularioInscripcion";
import { EVENTOS_USM, formatFechaLarga } from "@/data/eventos";
import { useEventosUser } from "@/lib/eventos-store";

export const Route = createFileRoute("/evento/$id")({
  component: EventDetail,
});

function IconoModalidad({ modalidad }: { modalidad: string }) {
  if (modalidad === "Online") {
    return <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-primary" />;
  }
  if (modalidad === "Híbrida") {
    return <Radio className="mt-0.5 h-5 w-5 shrink-0 text-primary" />;
  }
  return <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />;
}

function EventDetail() {
  const { id } = Route.useParams();
  const evento = EVENTOS_USM.find((e) => e.id === Number(id));

  const { obtenerInscripcion, alertas, abrirAlertasDialog } = useEventosUser();
  const inscripcion = evento ? obtenerInscripcion(evento.id) : undefined;
  const inscrito = Boolean(inscripcion);

  if (!evento) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Evento no encontrado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          El evento solicitado no se encuentra disponible en el catálogo actual.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const cuposMostrados =
    evento.cuposDisponibles != null
      ? Math.max(0, evento.cuposDisponibles - (inscrito ? 1 : 0))
      : null;

  const carreraEspecifica =
    evento.carrera !== "Todas las carreras" ? evento.carrera : undefined;
  const suscritoACarreraEvento = carreraEspecifica
    ? alertas.carreras.includes(carreraEspecifica)
    : false;

  const irAInscripcion = () => {
    const seccion = document.getElementById("seccion-inscripcion");
    if (seccion) {
      seccion.scrollIntoView?.({ behavior: "smooth", block: "start" });
      const primerCampo = seccion.querySelector<HTMLElement>("input, select");
      if (primerCampo && !inscrito) {
        setTimeout(() => primerCampo.focus({ preventScroll: true }), 350);
      }
    }
  };

  return (
    <div className="bg-background pb-24 lg:pb-10">
      {/* Encabezado contextual del evento */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
          <Link
            to="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2 -ml-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo de eventos
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <GraduationCap className="h-3.5 w-3.5" />
              {evento.carrera}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {evento.campus}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              <Monitor className="h-3.5 w-3.5" />
              {evento.modalidad}
            </span>
            {inscrito && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-bold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Inscripción confirmada ({inscripcion?.codigoReserva})
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {evento.titulo}
          </h1>

          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
            <Building2 className="h-4 w-4 shrink-0 text-primary" />
            Organiza: <span className="text-foreground">{evento.organizador}</span>
          </p>
        </div>
      </div>

      {/* Contenido principal con orden de lectura optimizado para móvil y escritorio */}
      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* 1. PROPÓSITO DEL EVENTO (Claramente diferenciado de la información general) */}
          <section
            aria-labelledby="heading-proposito"
            className="rounded-2xl border border-l-4 border-l-primary bg-card p-5 shadow-xs sm:p-7 lg:col-span-8"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Target className="h-4 w-4" />
              Objetivo formativo y valor para tu carrera
            </div>
            <h2
              id="heading-proposito"
              className="mt-1.5 text-lg font-bold text-foreground sm:text-xl"
            >
              Propósito del evento
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {evento.proposito}
            </p>
          </section>

          {/* 2. FICHA RESUMEN (Segunda en móvil para consulta rápida; columna derecha fija en escritorio) */}
          <aside
            aria-labelledby="heading-ficha-resumen"
            className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-1 lg:sticky lg:top-20"
          >
            <h2
              id="heading-ficha-resumen"
              className="border-b pb-3 text-base font-bold text-foreground sm:text-lg"
            >
              Ficha resumen del evento
            </h2>

            <div className="mt-4 space-y-4">
              {/* Modalidad */}
              <div className="flex items-start gap-3">
                <IconoModalidad modalidad={evento.modalidad} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Modalidad
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {evento.modalidad}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {evento.modalidad === "Presencial"
                      ? "Asistencia en campus USM"
                      : evento.modalidad === "Online"
                        ? "Transmisión virtual en vivo"
                        : "Asistencia en sala o vía streaming"}
                  </p>
                </div>
              </div>

              {/* Fecha y Horario */}
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Fecha y horario
                  </p>
                  <p className="text-sm font-semibold capitalize text-foreground">
                    {formatFechaLarga(evento.fecha)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {evento.hora} a {evento.horaTermino} hrs
                  </p>
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ubicación
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {evento.campus}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {evento.lugar}
                  </p>
                </div>
              </div>

              {/* Cupos (si requiere inscripción) */}
              {cuposMostrados != null && (
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Disponibilidad
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {cuposMostrados} de {evento.cuposTotales} cupos libres
                    </p>
                  </div>
                </div>
              )}

              <hr className="border-border" />

              {/* Requisitos de inscripción explícitos */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Requisitos de inscripción
                </p>

                {inscrito ? (
                  <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/15 px-3.5 py-2.5 text-sm font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Cupo reservado ({inscripcion?.codigoReserva})</span>
                  </div>
                ) : evento.requiereInscripcion ? (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/12 px-3.5 py-2.5 text-sm font-semibold text-amber-800 dark:text-amber-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Requiere inscripción previa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-3.5 py-2.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Acceso liberado (sin inscripción)</span>
                  </div>
                )}

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {evento.requisitosDetalle}
                </p>
              </div>

              {/* Botón de acción directa desde la Ficha Resumen */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={irAInscripcion}
                  className={`flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                    inscrito
                      ? "border border-success/40 bg-success/15 text-success hover:bg-success/20"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {inscrito ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Ver mi comprobante
                    </>
                  ) : evento.requiereInscripcion ? (
                    <>
                      Ir al formulario de inscripción
                      <ArrowDown className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Opciones de recordatorio y alertas
                      <ArrowDown className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => abrirAlertasDialog(carreraEspecifica)}
                  className="flex min-h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-input bg-secondary px-3 text-xs font-medium text-secondary-foreground transition hover:bg-accent"
                >
                  <BellRing className="h-3.5 w-3.5 text-primary" />
                  {suscritoACarreraEvento
                    ? `Alertas activas: ${carreraEspecifica}`
                    : carreraEspecifica
                      ? `Alertas de ${carreraEspecifica}`
                      : "Configurar alertas por carrera"}
                </button>
              </div>
            </div>
          </aside>

          {/* 3. INFORMACIÓN GENERAL Y CONTENIDOS */}
          <section
            aria-labelledby="heading-info-general"
            className="rounded-2xl border bg-card p-5 shadow-xs sm:p-7 lg:col-span-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Info className="h-4 w-4 text-primary" />
              Descripción y desarrollo de la jornada
            </div>
            <h2
              id="heading-info-general"
              className="mt-1.5 text-lg font-bold text-foreground sm:text-xl"
            >
              Información general
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {evento.informacionGeneral}
            </p>

            <div className="mt-6 rounded-xl border bg-muted/35 p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ListChecks className="h-4 w-4 text-primary" />
                Contenidos y actividades principales
              </h3>
              <ul className="mt-3 space-y-2">
                {evento.temas.map((tema) => (
                  <li
                    key={tema}
                    className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/90 sm:text-sm"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{tema}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 4. FORMULARIO DE INSCRIPCIÓN CON CONFIRMACIÓN INMEDIATA Y SUSCRIPCIÓN A ALERTAS (META 3) */}
          <div className="lg:col-span-8">
            <FormularioInscripcion evento={evento} />
          </div>
        </div>
      </main>

      {/* Barra inferior fija exclusiva para dispositivos móviles (< lg) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 px-4 py-2.5 shadow-lg backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-foreground">
              {inscrito
                ? "Inscripción confirmada"
                : evento.requiereInscripcion
                  ? `${cuposMostrados ?? "Cupos"} cupos disponibles`
                  : "Acceso liberado"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {inscrito
                ? `Código ${inscripcion?.codigoReserva}`
                : `${evento.modalidad} • ${evento.campus}`}
            </p>
          </div>

          <button
            type="button"
            onClick={irAInscripcion}
            className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-2xs transition ${
              inscrito
                ? "border border-success/40 bg-success/15 text-success"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {inscrito ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Ver comprobante
              </>
            ) : evento.requiereInscripcion ? (
              "Inscribirme ahora"
            ) : (
              "Alertas y calendario"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
