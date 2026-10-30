# Catálogo de Eventos USM - MVP

Este repositorio contiene el Producto Mínimo Viable (MVP) del Catálogo de Eventos de la Universidad Técnica Federico Santa María, desarrollado para la asignatura Diseño de Interfaces de Usuario (DIU).

**🤖 Nota sobre el Desarrollo:** 
La interfaz visual y los componentes interactivos de este proyecto fueron generados utilizando **Lovable** (herramienta de desarrollo con Inteligencia Artificial), cumpliendo con la alternativa permitida en la pauta de exportar el código a React. La aplicación funciona sin backend, utilizando exclusivamente datos estáticos (Mock Data) para cumplir las metas del usuario.

## 🛠 Versiones y Entorno de Desarrollo

Para que el proyecto compile y funcione correctamente sin errores de compatibilidad, es estrictamente necesario utilizar las siguientes versiones:

* **Node.js:** v22.x (Se recomienda gestionar la versión usando NVM: `nvm use 22` o `nvm install 22`).
* **npm:** Incluido con Node 22.
* **Framework:** React + Vite (Exportado de Lovable).

---

## 🚀 Instrucciones de Instalación y Ejecución

Sigue estos comandos exactos en tu terminal para levantar el entorno local:

**1. Clonar el repositorio y entrar a la carpeta:**
\`\`\`bash
git clone https://github.com/CrashB21/MVP-DUI-.git
cd MVP-DUI-
\`\`\`
*(Nota: si la carpeta base se llama `frontend-sample-app`, ingresa a esa carpeta en su lugar).*

**2. Instalar las dependencias:**
Es **crucial** utilizar la bandera `--legacy-peer-deps` para que NPM ignore los conflictos de versiones generados por las librerías exportadas desde Lovable.
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

**3. Iniciar el servidor de desarrollo:**
\`\`\`bash
npm run dev
\`\`\`

**4. Visualizar la aplicación:**
Haz clic en el enlace local que arroje la terminal (usualmente `http://localhost:5173` o `http://localhost:8080`) para abrir el catálogo interactivo en tu navegador.