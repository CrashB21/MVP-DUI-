import { useEffect, useRef, useState } from "react";
import {
  BellRing,
  Check,
  CheckCircle2,
  Mail,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CARRERAS_ALERTAS_USM } from "@/data/eventos";
import {
  useEventosUser,
  type FrecuenciaAlerta,
} from "@/lib/eventos-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AlertasCarreraDialog() {
  const {
    alertas,
    perfil,
    alertasDialogAbierto,
    carreraPreseleccionadaAlerta,
    cerrarAlertasDialog,
    guardarSuscripcionAlertas,
    cancelarTodasLasAlertas,
  } = useEventosUser();

  const [correo, setCorreo] = useState("");
  const [frecuencia, setFrecuencia] = useState<FrecuenciaAlerta>("inmediata");
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState<string[]>(
    [],
  );
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorCarreras, setErrorCarreras] = useState("");
  const [confirmadoReciente, setConfirmadoReciente] = useState(false);
  const estabaAbiertoRef = useRef(false);

  useEffect(() => {
    if (alertasDialogAbierto && !estabaAbiertoRef.current) {
      setCorreo(alertas.correo || perfil.correo || "");
      setFrecuencia(alertas.frecuencia || "inmediata");

      const baseCarreras = new Set(alertas.carreras);
      if (carreraPreseleccionadaAlerta) {
        baseCarreras.add(carreraPreseleccionadaAlerta);
      } else if (baseCarreras.size === 0 && perfil.carrera) {
        baseCarreras.add(perfil.carrera);
      }

      setCarrerasSeleccionadas(Array.from(baseCarreras));
      setErrorCorreo("");
      setErrorCarreras("");
      setConfirmadoReciente(false);
    }
    estabaAbiertoRef.current = alertasDialogAbierto;
  }, [
    alertasDialogAbierto,
    alertas.correo,
    alertas.frecuencia,
    alertas.carreras,
    perfil.correo,
    perfil.carrera,
    carreraPreseleccionadaAlerta,
  ]);

  const alternarCarrera = (carrera: string) => {
    setErrorCarreras("");
    setCarrerasSeleccionadas((prev) =>
      prev.includes(carrera)
        ? prev.filter((item) => item !== carrera)
        : [...prev, carrera],
    );
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valido = true;

    if (!EMAIL_REGEX.test(correo.trim())) {
      setErrorCorreo(
        "Ingresa un correo electrónico válido (ej: javiera.munoz@usm.cl).",
      );
      valido = false;
    } else {
      setErrorCorreo("");
    }

    if (carrerasSeleccionadas.length === 0) {
      setErrorCarreras(
        "Selecciona al menos una carrera para recibir notificaciones relevantes.",
      );
      valido = false;
    } else {
      setErrorCarreras("");
    }

    if (!valido) return;

    guardarSuscripcionAlertas(correo, carrerasSeleccionadas, frecuencia);
    setConfirmadoReciente(true);
    toast.success("¡Suscripción a alertas actualizada!", {
      description: `Recibirás avisos de ${carrerasSeleccionadas.length} carrera(s) en ${correo.trim().toLowerCase()}.`,
    });
  };

  const manejarDesactivarTodo = () => {
    cancelarTodasLasAlertas();
    setCarrerasSeleccionadas([]);
    setConfirmadoReciente(false);
    toast.info("Suscripción a alertas desactivada", {
      description: "Puedes volver a activarla cuando quieras.",
    });
  };

  return (
    <Dialog
      open={alertasDialogAbierto}
      onOpenChange={(open) => {
        if (!open) cerrarAlertasDialog();
      }}
    >
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-xl p-4 sm:p-6">
        <DialogHeader className="text-left">
          <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <BellRing className="h-3.5 w-3.5" />
            Notificaciones personalizadas
          </div>
          <DialogTitle className="text-lg font-bold sm:text-xl">
            Suscripción a alertas por carrera
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed sm:text-sm">
            Recibe en tu correo solo las charlas, talleres y convocatorias de
            las carreras USM que realmente te interesan, sin correo masivo
            irrelevante.
          </DialogDescription>
        </DialogHeader>

        {confirmadoReciente ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-2 space-y-4 rounded-xl border border-success/30 bg-success/10 p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  ¡Suscripción confirmada!
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                  Enviaremos alertas{" "}
                  <strong>
                    {alertas.frecuencia === "inmediata"
                      ? "apenas se publique un nuevo evento"
                      : "en un resumen todos los lunes"}
                  </strong>{" "}
                  al correo:
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 text-xs font-semibold text-foreground shadow-2xs sm:text-sm">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {alertas.correo}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Carreras suscritas ({alertas.carreras.length})
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {alertas.carreras.map((carrera) => (
                  <span
                    key={carrera}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-card px-2.5 py-1 text-xs font-medium text-foreground"
                  >
                    <Sparkles className="h-3 w-3 text-primary" />
                    {carrera}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmadoReciente(false)}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                Editar carreras
              </button>
              <button
                type="button"
                onClick={cerrarAlertasDialog}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Listo, volver a eventos
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={manejarSubmit} noValidate className="mt-1 space-y-4">
            <div>
              <label
                htmlFor="alerta-correo"
                className="block text-sm font-medium text-foreground"
              >
                Correo electrónico institucional{" "}
                <span className="text-destructive">*</span>
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="alerta-correo"
                  type="email"
                  autoComplete="email"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    if (errorCorreo) setErrorCorreo("");
                  }}
                  placeholder="Ej: javiera.munoz@usm.cl"
                  aria-invalid={!!errorCorreo}
                  className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:text-sm"
                />
              </div>
              {errorCorreo && (
                <p role="alert" className="mt-1 text-xs font-medium text-destructive">
                  {errorCorreo}
                </p>
              )}
            </div>

            <div>
              <span className="block text-sm font-medium text-foreground">
                Frecuencia de envío
              </span>
              <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFrecuencia("inmediata")}
                  className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition sm:text-sm ${
                    frecuencia === "inmediata"
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-input bg-card text-foreground hover:bg-accent/50"
                  }`}
                >
                  <span>Inmediata (al publicar)</span>
                  {frecuencia === "inmediata" && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setFrecuencia("semanal")}
                  className={`flex min-h-11 cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition sm:text-sm ${
                    frecuencia === "semanal"
                      ? "border-primary bg-primary/10 font-semibold text-primary"
                      : "border-input bg-card text-foreground hover:bg-accent/50"
                  }`}
                >
                  <span>Resumen semanal (lunes)</span>
                  {frecuencia === "semanal" && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  Carreras de interés{" "}
                  <span className="text-destructive">*</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {carrerasSeleccionadas.length} seleccionada(s)
                </span>
              </div>

              <div className="mt-2 grid max-h-52 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
                {CARRERAS_ALERTAS_USM.map((carrera) => {
                  const activa = carrerasSeleccionadas.includes(carrera);
                  return (
                    <button
                      key={carrera}
                      type="button"
                      onClick={() => alternarCarrera(carrera)}
                      aria-pressed={activa}
                      className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs transition sm:text-sm ${
                        activa
                          ? "border-primary bg-primary/10 font-semibold text-primary"
                          : "border-input bg-card text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <span className="leading-snug">{carrera}</span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          activa
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40 bg-background"
                        }`}
                      >
                        {activa && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {errorCarreras && (
                <p
                  role="alert"
                  className="mt-1.5 text-xs font-medium text-destructive"
                >
                  {errorCarreras}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
              {alertas.carreras.length > 0 ? (
                <button
                  type="button"
                  onClick={manejarDesactivarTodo}
                  className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Desactivar alertas actuales
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cerrarAlertasDialog}
                  className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border border-input bg-card px-4 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <BellRing className="h-4 w-4" />
                Confirmar suscripción
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
