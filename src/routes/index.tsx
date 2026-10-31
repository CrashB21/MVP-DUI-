import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Calendar, Clock, GraduationCap, MapPin, Monitor, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catálogo de Eventos USM" },
      { name: "description", content: "Descubre los eventos universitarios de la Universidad Técnica Federico Santa María." },
      { property: "og:title", content: "Catálogo de Eventos USM" },
      { property: "og:description", content: "Eventos universitarios para estudiantes de la USM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Evento = {
  id: number; titulo: string; fecha: string; hora: string;
  carrera: string; campus: string; modalidad: string; descripcion: string;
};

const mockEvents: Evento[] = [
  { id: 1, titulo: "Hackathon USM 2026", fecha: "2026-11-14", hora: "09:00", carrera: "Ingeniería Civil Informática", campus: "Casa Central Valparaíso", modalidad: "Presencial", descripcion: "Competencia de 24 horas donde equipos desarrollan soluciones tecnológicas a desafíos reales propuestos por empresas asociadas." },
  { id: 2, titulo: "Charla: Energías Renovables en Chile", fecha: "2026-11-05", hora: "11:30", carrera: "Ingeniería Civil Eléctrica", campus: "San Joaquín", modalidad: "Híbrida", descripcion: "Expertos del sector energético analizan el futuro de la energía solar y eólica en el norte del país." },
  { id: 3, titulo: "Taller de Robótica Básica", fecha: "2026-11-08", hora: "15:00", carrera: "Ingeniería Civil Electrónica", campus: "Vitacura", modalidad: "Presencial", descripcion: "Aprende a construir y programar un robot seguidor de línea usando Arduino. Materiales incluidos." },
  { id: 4, titulo: "Feria Laboral de Ingeniería", fecha: "2026-11-20", hora: "10:00", carrera: "Todas las carreras", campus: "Casa Central Valparaíso", modalidad: "Presencial", descripcion: "Más de 40 empresas presentan ofertas de práctica y empleo para estudiantes y titulados." },
  { id: 5, titulo: "Webinar: Introducción a Machine Learning", fecha: "2026-11-03", hora: "18:00", carrera: "Ingeniería Civil Informática", campus: "San Joaquín", modalidad: "Online", descripcion: "Sesión introductoria sobre modelos de aprendizaje automático con ejemplos prácticos en Python." },
  { id: 6, titulo: "Seminario de Minería Sustentable", fecha: "2026-11-12", hora: "16:00", carrera: "Ingeniería Civil de Minas", campus: "Concepción", modalidad: "Híbrida", descripcion: "Investigadores presentan avances en tecnologías para reducir el impacto ambiental de la minería." },
  { id: 7, titulo: "Concurso de Diseño de Puentes", fecha: "2026-11-25", hora: "14:00", carrera: "Ingeniería Civil", campus: "Casa Central Valparaíso", modalidad: "Presencial", descripcion: "Equipos diseñan y prueban puentes a escala hechos de madera de balsa. Premios para los tres primeros lugares." },
  { id: 8, titulo: "Taller de Finanzas Personales", fecha: "2026-11-18", hora: "12:00", carrera: "Ingeniería Comercial", campus: "Vitacura", modalidad: "Online", descripcion: "Aprende a organizar tu presupuesto, ahorrar e invertir de manera responsable durante tu vida universitaria." },
  { id: 9, titulo: "Jornada de Química Aplicada", fecha: "2026-11-27", hora: "10:30", carrera: "Ingeniería Civil Química", campus: "Concepción", modalidad: "Presencial", descripcion: "Demostraciones de laboratorio y charlas sobre procesos químicos industriales." },
];

const unique = (k: keyof Evento) => Array.from(new Set(mockEvents.map((e) => e[k] as string))).sort();
const normalizar = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const formatFecha = (f: string) =>
  new Date(f + "T00:00:00").toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

function Tag({ icon: Icon, children, tone }: { icon: typeof MapPin; children: string; tone: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      <Icon className="h-3.5 w-3.5" />{children}
    </span>
  );
}
const tones = { carrera: "bg-primary/10 text-primary", campus: "bg-accent text-accent-foreground", modalidad: "bg-muted text-muted-foreground" };

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-foreground">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="Todos">Todos</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Index() {
  const [busqueda, setBusqueda] = useState("");
  const [carrera, setCarrera] = useState("Todos");
  const [campus, setCampus] = useState("Todos");
  const [modalidad, setModalidad] = useState("Todos");

  const filtrados = useMemo(() => mockEvents.filter((e) =>
    normalizar(e.titulo).includes(normalizar(busqueda)) &&
    (carrera === "Todos" || e.carrera === carrera) &&
    (campus === "Todos" || e.campus === campus) &&
    (modalidad === "Todos" || e.modalidad === modalidad)
  ), [busqueda, carrera, campus, modalidad]);

  const limpiar = () => { setBusqueda(""); setCarrera("Todos"); setCampus("Todos"); setModalidad("Todos"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Universidad Técnica Federico Santa María</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Catálogo de Eventos USM</h1>
          <p className="mt-3 max-w-2xl opacity-90">Encuentra charlas, talleres y actividades para tu vida universitaria.</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="-mt-16 rounded-xl border bg-card p-4 shadow-lg sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar evento por título..."
              className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <Select label="Carrera" value={carrera} onChange={setCarrera} options={unique("carrera")} />
            <Select label="Campus" value={campus} onChange={setCampus} options={unique("campus")} />
            <Select label="Modalidad" value={modalidad} onChange={setModalidad} options={unique("modalidad")} />
            <button onClick={limpiar} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-accent">
              <RotateCcw className="h-4 w-4" /> Limpiar filtros
            </button>
          </div>
        </section>

        <p className="mt-6 text-sm text-muted-foreground">{filtrados.length} evento(s) encontrado(s)</p>

        {filtrados.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed p-10 text-center text-muted-foreground">No se encontraron eventos con esos filtros.</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((e) => (
              <article key={e.id} className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h2 className="text-lg font-semibold text-card-foreground">{e.titulo}</h2>
                <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2 capitalize"><Calendar className="h-4 w-4 text-primary" />{formatFecha(e.fecha)}</p>
                  <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{e.hora} hrs</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Tag icon={GraduationCap} tone={tones.carrera}>{e.carrera}</Tag>
                  <Tag icon={MapPin} tone={tones.campus}>{e.campus}</Tag>
                  <Tag icon={Monitor} tone={tones.modalidad}>{e.modalidad}</Tag>
                </div>
                <Link to="/evento/$id" params={{ id: String(e.id) }} className="mt-5 flex w-full items-center justify-center rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:mt-auto sm:translate-y-0">
                  Ver detalles
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
