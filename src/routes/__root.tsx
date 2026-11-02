import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { AlertasCarreraDialog } from "@/components/AlertasCarreraDialog";
import { MisEventosSheet } from "@/components/MisEventosSheet";
import { FooterUSM, NavbarUSM } from "@/components/NavbarUSM";
import { Toaster } from "@/components/ui/sonner";
import { EventosUserProvider } from "@/lib/eventos-store";
import { reportLovableError } from "../lib/lovable-error-reporting";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-primary sm:text-7xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Página no encontrada
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La dirección que buscas no existe o el evento fue movido del catálogo.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al catálogo USM
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          No pudimos cargar esta sección
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocurrió un inconveniente inesperado. Puedes reintentar o regresar al
          catálogo principal de eventos.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reintentar
          </button>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { title: "Eventos USM | Catálogo e Inscripciones" },
        {
          name: "description",
          content:
            "Catálogo de eventos, inscripción con confirmación inmediata y alertas por carrera para estudiantes de la Universidad Técnica Federico Santa María.",
        },
        { name: "author", content: "Equipo DIU - USM" },
        {
          property: "og:title",
          content: "Eventos USM | Catálogo e Inscripciones",
        },
        {
          property: "og:description",
          content:
            "Explora charlas, talleres y actividades estudiantiles de la USM.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <EventosUserProvider>
        <div className="flex min-h-screen flex-col">
          <NavbarUSM />
          <div className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </div>
          <FooterUSM />
        </div>
        <AlertasCarreraDialog />
        <MisEventosSheet />
        <Toaster position="top-center" richColors />
      </EventosUserProvider>
    </QueryClientProvider>
  );
}
