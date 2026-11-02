import { Link } from "@tanstack/react-router";
import { Bell, BellRing, CheckCircle2, GraduationCap } from "lucide-react";

import { useEventosUser } from "@/lib/eventos-store";

export function NavbarUSM() {
  const { inscripciones, alertas, abrirAlertasDialog, abrirMisEventos } =
    useEventosUser();

  const totalAlertas = alertas.carreras.length;
  const totalInscripciones = inscripciones.length;

  return (
    <nav
      aria-label="Navegación principal Eventos USM"
      className="sticky top-0 z-40 border-b border-primary-foreground/15 bg-primary text-primary-foreground shadow-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3">
        <Link
          to="/"
          className="group flex min-h-10 items-center gap-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-foreground/60"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground transition group-hover:bg-primary-foreground/25">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-tight sm:text-base">
              Eventos USM
            </span>
            <span className="hidden text-[11px] opacity-80 sm:block">
              Universidad Técnica Federico Santa María
            </span>
            <span className="block text-[11px] opacity-80 sm:hidden">
              Comunidad UTFSM
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => abrirAlertasDialog()}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition hover:bg-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/60 sm:px-3.5 sm:text-sm"
          >
            {totalAlertas > 0 ? (
              <BellRing className="h-4 w-4 shrink-0" />
            ) : (
              <Bell className="h-4 w-4 shrink-0" />
            )}
            <span className="hidden sm:inline">Alertas por carrera</span>
            <span className="sm:hidden">Alertas</span>
            {totalAlertas > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-success px-1.5 text-[11px] font-bold text-success-foreground">
                {totalAlertas}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={abrirMisEventos}
            className="inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-primary-foreground px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary-foreground/90 focus:outline-none focus:ring-2 focus:ring-primary-foreground/60 sm:px-3.5 sm:text-sm"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Mis inscripciones</span>
            <span className="sm:hidden">Mis cupos</span>
            {totalInscripciones > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {totalInscripciones}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export function FooterUSM() {
  const { abrirAlertasDialog, abrirMisEventos } = useEventosUser();

  return (
    <footer className="mt-12 border-t bg-card text-card-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="max-w-md">
          <p className="text-sm font-bold text-foreground">
            Portal de Eventos y Actividades Estudiantiles USM
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Plataforma universitaria para conectar a estudiantes con charlas,
            talleres, seminarios y ferias en Casa Central Valparaíso, San
            Joaquín, Vitacura, Viña del Mar y Concepción.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Link
            to="/"
            className="inline-flex min-h-10 items-center rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-accent"
          >
            Catálogo de eventos
          </Link>
          <button
            type="button"
            onClick={() => abrirAlertasDialog()}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-accent"
          >
            Suscribir alertas por carrera
          </button>
          <button
            type="button"
            onClick={abrirMisEventos}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-accent"
          >
            Mis inscripciones
          </button>
        </div>
      </div>
    </footer>
  );
}
