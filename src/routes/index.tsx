import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertCircle,
  BellRing,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  GraduationCap,
  MapPin,
  Monitor,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

import {
  CAMPUS_CATALOGO,
  CARRERAS_CATALOGO,
  EVENTOS_USM,
  MODALIDADES_CATALOGO,
  formatFechaLarga,
  normalizarTexto,
} from "@/data/eventos";
import { useEventosUser } from "@/lib/eventos-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo de Eventos USM" },
      {
        name: "description",
        content:
          "Descubre charlas, talleres y actividades universitarias de la Universidad Técnica Federico Santa María.",
      },
      { property: "og:title", content: "Catálogo de Eventos USM" },
      {
        property: "og:description",
        content: "Eventos universitarios para estudiantes de la USM.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function TagButton({
  icon: Icon,
  children,
  tone,
  onClick,
  title,
}: {
  icon: typeof MapPin;
  children: string;
  tone: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-left text-xs font-medium transition hover:opacity-85 ${tone}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="line-clamp-1">{children}</span>
    </button>
  );
}

const tones = {
  carrera: "bg-primary/10 text-primary",
  campus: "bg-accent text-accent-foreground",
  modalidad: "bg-muted text-muted-foreground",
};

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label
      htmlFor={id}
      className="flex flex-col gap-1.5 text-sm font-medium text-foreground"
    >
      {label}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-lg border border-input bg-card px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:h-10 sm:text-sm"
      >
        <option value="Todos">Todos</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Index() {
  const [busqueda, setBusqueda] = useState("");
  const [carrera, setCarrera] = useState("Todos");
  const [campus, setCampus] = useState("Todos");
  const [modalidad, setModalidad] = useState("Todos");
  const [filtrosMovilAbiertos, setFiltrosMovilAbiertos] = useState(false);

  const { obtenerInscripcion, alertas, abrirAlertasDialog } = useEventosUser();

  const cantidadFiltrosActivos =
    (carrera !== "Todos" ? 1 : 0) +
    (campus !== "Todos" ? 1 : 0) +
    (modalidad !== "Todos" ? 1 : 0);

  const filtrados = useMemo(
    () =>
      EVENTOS_USM.filter((e) => {
        const termino = normalizarTexto(busqueda);
        const coincideTexto =
          !termino ||
          normalizarTexto(e.titulo).includes(termino) ||
          normalizarTexto(e.resumen).includes(termino) ||
          normalizarTexto(e.carrera).includes(termino);

        return (
          coincideTexto &&
          (carrera === "Todos" || e.carrera === carrera) &&
          (campus === "Todos" || e.campus === campus) &&
          (modalidad === "Todos" || e.modalidad === modalidad)
        );
      }),
    [busqueda, carrera, campus, modalidad],
  );

  const limpiar = () => {
    setBusqueda("");
    setCarrera("Todos");
    setCampus("Todos");
    setModalidad("Todos");
  };

  const carreraEspecificaSeleccionada =
    carrera !== "Todos" && carrera !== "Todas las carreras"
      ? carrera
      : undefined;

  const alertaCarreraActiva = carreraEspecificaSeleccionada
    ? alertas.carreras.includes(carreraEspecificaSeleccionada)
    : alertas.carreras.length > 0;

  return (
    <div className="bg-background">
      {/* Encabezado Hero responsive sin colisión con el buscador */}
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-18 sm:pt-10">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-85 sm:text-sm">
            Agenda Académica y Estudiantil
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:mt-2 sm:text-4xl lg:text-5xl">
            Catálogo de Eventos USM
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed opacity-90 sm:text-base">
            Encuentra charlas, talleres y ferias según tu carrera y campus,
            inscríbete con confirmación inmediata y activa alertas
            personalizadas.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        {/* Panel de búsqueda y filtros adaptado a móvil y escritorio */}
        <section
          aria-label="Buscador y filtros de eventos"
          className="-mt-8 rounded-2xl border bg-card p-4 shadow-lg sm:-mt-10 sm:p-6"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por título, tema o carrera..."
                aria-label="Buscar evento"
                className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-9 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Botón colapsable de filtros solo en móvil (< sm) */}
            <button
              type="button"
              onClick={() => setFiltrosMovilAbiertos((prev) => !prev)}
              aria-expanded={filtrosMovilAbiertos}
              className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-input bg-secondary px-3 text-xs font-semibold text-secondary-foreground transition hover:bg-accent sm:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Filtros</span>
              {cantidadFiltrosActivos > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                  {cantidadFiltrosActivos}
                </span>
              )}
              {filtrosMovilAbiertos ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          {/* Acceso rápido a modalidad en móvil */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 sm:hidden">
            {(["Todos", ...MODALIDADES_CATALOGO] as const).map((mod) => {
              const activo = modalidad === mod;
              return (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setModalidad(mod)}
                  className={`inline-flex min-h-8 shrink-0 cursor-pointer items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
                    activo
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mod === "Todos" ? "Todas" : mod}
                </button>
              );
            })}
          </div>

          {/* Selectores completos: siempre visibles desde sm:, colapsables en móvil */}
          <div
            className={`mt-4 grid-cols-1 gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:items-end ${
              filtrosMovilAbiertos ? "grid" : "hidden"
            }`}
          >
            <SelectField
              id="filtro-carrera"
              label="Carrera"
              value={carrera}
              onChange={setCarrera}
              options={CARRERAS_CATALOGO}
            />
            <SelectField
              id="filtro-campus"
              label="Campus"
              value={campus}
              onChange={setCampus}
              options={CAMPUS_CATALOGO}
            />
            <SelectField
              id="filtro-modalidad"
              label="Modalidad"
              value={modalidad}
              onChange={setModalidad}
              options={MODALIDADES_CATALOGO}
            />
            <button
              type="button"
              onClick={limpiar}
              className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-secondary px-4 text-sm font-medium text-secondary-foreground transition hover:bg-accent sm:h-10"
            >
              <RotateCcw className="h-4 w-4" />
              Limpiar filtros
            </button>
          </div>

          {/* Chips de filtros activos para visibilidad inmediata del estado */}
          {(cantidadFiltrosActivos > 0 || busqueda.trim() !== "") && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t pt-3">
              <span className="text-xs font-medium text-muted-foreground">
                Filtros activos:
              </span>
              {carrera !== "Todos" && (
                <button
                  type="button"
                  onClick={() => setCarrera("Todos")}
                  className="inline-flex min-h-7 cursor-pointer items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  {carrera}
                  <X className="h-3 w-3" />
                </button>
              )}
              {campus !== "Todos" && (
                <button
                  type="button"
                  onClick={() => setCampus("Todos")}
                  className="inline-flex min-h-7 cursor-pointer items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground hover:opacity-80"
                >
                  {campus}
                  <X className="h-3 w-3" />
                </button>
              )}
              {modalidad !== "Todos" && (
                <button
                  type="button"
                  onClick={() => setModalidad("Todos")}
                  className="inline-flex min-h-7 cursor-pointer items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground hover:opacity-80"
                >
                  {modalidad}
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={limpiar}
                className="ml-auto cursor-pointer text-xs font-semibold text-primary hover:underline"
              >
                Restablecer todo
              </button>
            </div>
          )}
        </section>

        {/* Banner contextual de Suscripción a Alertas por Carrera */}
        <section
          aria-label="Suscripción a alertas por carrera"
          className="mt-5 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <BellRing className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-foreground sm:text-base">
                {carreraEspecificaSeleccionada
                  ? `Alertas de eventos para ${carreraEspecificaSeleccionada}`
                  : "Recibe alertas de eventos según tu carrera"}
              </h2>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {alertaCarreraActiva
                  ? `Suscripción activa en ${alertas.correo} (${alertas.carreras.length} carrera(s) configurada(s)).`
                  : "Suscríbete con tu correo USM para enterarte de nuevas charlas, talleres y convocatorias de tu área."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => abrirAlertasDialog(carreraEspecificaSeleccionada)}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-2xs transition hover:bg-primary/90 sm:text-sm"
          >
            <BellRing className="h-4 w-4" />
            {alertaCarreraActiva
              ? "Gestionar mis alertas"
              : carreraEspecificaSeleccionada
                ? "Activar alertas de esta carrera"
                : "Suscribirme a alertas"}
          </button>
        </section>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            {filtrados.length} evento(s) encontrado(s)
          </p>
        </div>

        {filtrados.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed bg-card p-8 text-center sm:p-12">
            <p className="text-base font-semibold text-foreground">
              No encontramos eventos con esos criterios
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
              Prueba limpiando alguno de los filtros activos o suscríbete a
              alertas por carrera para recibir un correo cuando se publique una
              nueva actividad.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={limpiar}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-accent"
              >
                <RotateCcw className="h-4 w-4" />
                Mostrar todos los eventos
              </button>
              <button
                type="button"
                onClick={() =>
                  abrirAlertasDialog(carreraEspecificaSeleccionada)
                }
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <BellRing className="h-4 w-4" />
                Crear alerta por carrera
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((e) => {
              const inscripcion = obtenerInscripcion(e.id);
              const inscrito = Boolean(inscripcion);

              return (
                <article
                  key={e.id}
                  className="flex flex-col rounded-2xl border bg-card p-5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Indicador superior de requisito / estado de inscripción */}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    {inscrito ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Inscrito(a)
                      </span>
                    ) : e.requiereInscripcion ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Requiere inscripción
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Acceso liberado
                      </span>
                    )}

                    {e.requiereInscripcion && e.cuposDisponibles != null && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {Math.max(0, e.cuposDisponibles - (inscrito ? 1 : 0))}{" "}
                        cupos
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold leading-snug text-card-foreground">
                    {e.titulo}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {e.resumen}
                  </p>

                  <div className="mt-3.5 space-y-1.5 text-xs text-muted-foreground sm:text-sm">
                    <p className="flex items-center gap-2 capitalize">
                      <Calendar className="h-4 w-4 shrink-0 text-primary" />
                      <span>{formatFechaLarga(e.fecha)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-primary" />
                      <span>
                        {e.hora} a {e.horaTermino} hrs
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <TagButton
                      icon={GraduationCap}
                      tone={tones.carrera}
                      onClick={() => setCarrera(e.carrera)}
                      title={`Filtrar por ${e.carrera}`}
                    >
                      {e.carrera}
                    </TagButton>
                    <TagButton
                      icon={MapPin}
                      tone={tones.campus}
                      onClick={() => setCampus(e.campus)}
                      title={`Filtrar por campus ${e.campus}`}
                    >
                      {e.campus}
                    </TagButton>
                    <TagButton
                      icon={Monitor}
                      tone={tones.modalidad}
                      onClick={() => setModalidad(e.modalidad)}
                      title={`Filtrar por modalidad ${e.modalidad}`}
                    >
                      {e.modalidad}
                    </TagButton>
                  </div>

                  <Link
                    to="/evento/$id"
                    params={{ id: String(e.id) }}
                    className={`mt-5 flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:mt-auto ${
                      inscrito
                        ? "border border-success/40 bg-success/15 text-success hover:bg-success/20"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {inscrito
                      ? "Ver mi comprobante"
                      : e.requiereInscripcion
                        ? "Ver detalles e inscribirme"
                        : "Ver detalles del evento"}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
