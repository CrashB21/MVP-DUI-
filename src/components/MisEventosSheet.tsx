import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  MapPin,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  EVENTOS_USM,
  descargarCalendarioICS,
  formatFechaCorta,
} from "@/data/eventos";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventosUser } from "@/lib/eventos-store";

export function MisEventosSheet() {
  const isMobile = useIsMobile();
  const {
    inscripciones,
    alertas,
    misEventosAbierto,
    cerrarMisEventos,
    cancelarInscripcion,
    quitarCarreraAlerta,
    abrirAlertasDialog,
  } = useEventosUser();

  const manejarCancelar = (eventoId: number, titulo: string) => {
    cancelarInscripcion(eventoId);
    toast.info("Inscripción cancelada", {
      description: `Se liberó tu cupo para "${titulo}".`,
    });
  };

  return (
    <Sheet
      open={misEventosAbierto}
      onOpenChange={(open) => {
        if (!open) cerrarMisEventos();
      }}
    >
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "max-h-[85dvh] overflow-y-auto rounded-t-2xl p-4"
            : "w-full overflow-y-auto sm:max-w-md p-6"
        }
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-bold">
            Mis inscripciones y alertas
          </SheetTitle>
          <SheetDescription className="text-xs sm:text-sm">
            Revisa tus cupos confirmados y las carreras USM de las que recibes
            notificaciones.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-6">
          {/* Sección 1: Inscripciones confirmadas */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Eventos inscritos ({inscripciones.length})
              </h3>
            </div>

            {inscripciones.length === 0 ? (
              <div className="mt-2.5 rounded-xl border border-dashed bg-muted/40 p-4 text-center">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Aún no tienes inscripciones activas. Selecciona un evento del
                  catálogo para reservar tu cupo con confirmación inmediata.
                </p>
              </div>
            ) : (
              <div className="mt-2.5 space-y-3">
                {inscripciones.map((ins) => {
                  const evento = EVENTOS_USM.find((e) => e.id === ins.eventoId);
                  if (!evento) return null;

                  return (
                    <div
                      key={ins.eventoId}
                      className="rounded-xl border bg-card p-3.5 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center rounded-md bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                          Confirmado • {ins.codigoReserva}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {ins.modalidadAsistencia}
                        </span>
                      </div>

                      <h4 className="mt-2 text-sm font-semibold text-foreground">
                        {evento.titulo}
                      </h4>

                      <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                          {formatFechaCorta(evento.fecha)} • {evento.hora} hrs
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          {evento.campus}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-2.5">
                        <Link
                          to="/evento/$id"
                          params={{ id: String(evento.id) }}
                          onClick={cerrarMisEventos}
                          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                        >
                          Ver comprobante
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            descargarCalendarioICS(evento, ins.codigoReserva)
                          }
                          title="Descargar evento para calendario"
                          className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-md border border-input bg-secondary px-2.5 text-xs font-medium text-secondary-foreground transition hover:bg-accent"
                        >
                          <CalendarPlus className="h-3.5 w-3.5" />
                          .ics
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            manejarCancelar(evento.id, evento.titulo)
                          }
                          title="Cancelar inscripción"
                          className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-md border border-destructive/25 px-2.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sección 2: Alertas por carrera */}
          <section className="border-t pt-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <BellRing className="h-4 w-4 text-primary" />
                Alertas por carrera ({alertas.carreras.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  cerrarMisEventos();
                  abrirAlertasDialog();
                }}
                className="cursor-pointer text-xs font-semibold text-primary hover:underline"
              >
                {alertas.carreras.length > 0 ? "Editar" : "Configurar"}
              </button>
            </div>

            {alertas.carreras.length === 0 ? (
              <div className="mt-2.5 rounded-xl border border-dashed bg-muted/40 p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  No tienes alertas activas por carrera.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    cerrarMisEventos();
                    abrirAlertasDialog();
                  }}
                  className="mt-2.5 inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <BellRing className="h-3.5 w-3.5" />
                  Activar alertas por carrera
                </button>
              </div>
            ) : (
              <div className="mt-2.5 rounded-xl border bg-primary/5 p-3.5">
                <p className="text-xs text-muted-foreground">
                  Enviando notificaciones (
                  {alertas.frecuencia === "inmediata"
                    ? "inmediatas"
                    : "resumen semanal"}
                  ) a:{" "}
                  <strong className="text-foreground">{alertas.correo}</strong>
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {alertas.carreras.map((carrera) => (
                    <span
                      key={carrera}
                      className="inline-flex items-center gap-1 rounded-full border bg-card pl-2.5 pr-1 py-1 text-xs font-medium text-foreground"
                    >
                      {carrera}
                      <button
                        type="button"
                        onClick={() => {
                          quitarCarreraAlerta(carrera);
                          toast.info(`Alerta desactivada para ${carrera}`);
                        }}
                        aria-label={`Quitar alerta de ${carrera}`}
                        className="inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/15 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
