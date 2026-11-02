import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AlertasCarreraDialog } from "@/components/AlertasCarreraDialog";
import { FormularioInscripcion } from "@/components/FormularioInscripcion";
import { EVENTOS_USM } from "@/data/eventos";
import { EventosUserProvider, useEventosUser } from "@/lib/eventos-store";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement | null = null;
let root: Root | null = null;

function setNativeValue(
  element: HTMLInputElement | HTMLSelectElement,
  value: string,
) {
  const prototype = Object.getPrototypeOf(element);
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  valueSetter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function BotonAbrirAlertas() {
  const { abrirAlertasDialog } = useEventosUser();
  return (
    <button
      type="button"
      id="btn-abrir-alertas"
      onClick={() => abrirAlertasDialog("Ingeniería Civil Informática")}
    >
      Abrir modal alertas
    </button>
  );
}

async function montarConRouter(ui: React.ReactNode) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  const rootRoute = createRootRoute({
    component: () => (
      <EventosUserProvider>
        {ui}
        <AlertasCarreraDialog />
        <Outlet />
      </EventosUserProvider>
    ),
  });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();

  await act(async () => {
    root?.render(<RouterProvider router={router} />);
  });
}

describe("Meta 3: Inscripción con confirmación inmediata y alertas por carrera", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root?.unmount();
      });
      root = null;
    }
    if (container) {
      container.remove();
      container = null;
    }
    window.localStorage.clear();
  });

  it("dispone de los 9 eventos USM completos con propósito e información general diferenciados", () => {
    expect(EVENTOS_USM).toHaveLength(9);
    for (const ev of EVENTOS_USM) {
      expect(ev.proposito.length).toBeGreaterThan(20);
      expect(ev.informacionGeneral.length).toBeGreaterThan(20);
      expect(ev.proposito).not.toBe(ev.informacionGeneral);
      expect(ev.lugar.length).toBeGreaterThan(3);
    }
  });

  it("valida campos obligatorios y confirma inmediatamente la inscripción con suscripción a alertas", async () => {
    const eventoHackathon = EVENTOS_USM[0];
    await montarConRouter(<FormularioInscripcion evento={eventoHackathon} />);

    const submitBtn = container?.querySelector<HTMLButtonElement>(
      'button[type="submit"]',
    );
    expect(submitBtn).not.toBeNull();

    // Envío vacío debe mostrar mensajes de validación
    await act(async () => {
      submitBtn?.click();
    });

    expect(container?.textContent).toContain(
      "Por favor ingresa tu nombre y apellido.",
    );
    expect(container?.textContent).toContain("Ingresa un correo válido");

    // Completar datos válidos de estudiante USM
    const inputNombre =
      container?.querySelector<HTMLInputElement>("#ins-nombre");
    const inputCorreo =
      container?.querySelector<HTMLInputElement>("#ins-correo");
    expect(inputNombre).not.toBeNull();
    expect(inputCorreo).not.toBeNull();

    await act(async () => {
      setNativeValue(inputNombre!, "Javiera Muñoz");
      setNativeValue(inputCorreo!, "javiera.munoz@usm.cl");
    });

    await act(async () => {
      submitBtn?.click();
    });

    // Debe mostrar confirmación inmediata con código y suscripción activa
    expect(container?.textContent).toContain(
      "¡Tu inscripción está confirmada!",
    );
    expect(container?.textContent).toMatch(/USM-EV01-\d{4}/);
    expect(container?.textContent).toContain(
      "Suscripción a alertas por carrera activa",
    );
  });

  it("permite suscribirse directamente a alertas personalizadas por carrera con confirmación inmediata", async () => {
    await montarConRouter(<BotonAbrirAlertas />);

    const btnAbrir =
      container?.querySelector<HTMLButtonElement>("#btn-abrir-alertas");
    await act(async () => {
      btnAbrir?.click();
    });

    const inputCorreo =
      document.querySelector<HTMLInputElement>("#alerta-correo");
    expect(inputCorreo).not.toBeNull();

    await act(async () => {
      setNativeValue(inputCorreo!, "javiera.munoz@sansano.usm.cl");
    });

    const btnSubmitModal = inputCorreo
      ?.closest("form")
      ?.querySelector<HTMLButtonElement>('button[type="submit"]');
    expect(btnSubmitModal).not.toBeNull();

    await act(async () => {
      btnSubmitModal?.click();
    });

    expect(document.body.textContent).toContain("¡Suscripción confirmada!");
    expect(document.body.textContent).toContain("javiera.munoz@sansano.usm.cl");
  });
});
