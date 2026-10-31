import { createFileRoute, Link } from '@tanstack/react-router';
import { Calendar, MapPin, MonitorPlay, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';


const eventosData = [
  {
    id: 1,
    titulo: "Hackathon USM 2026",
    descripcion: "Únete a la maratón de programación más grande de la universidad. Durante 48 horas, equipos multidisciplinarios buscarán resolver problemas reales de sustentabilidad usando tecnología.\n\nEl propósito es fomentar el trabajo en equipo, la innovación y poner en práctica tus conocimientos en un entorno de alta presión pero muy colaborativo.",
    modalidad: "Presencial",
    fecha: "14 de Noviembre 2026",
    hora: "09:00 hrs",
    ubicacion: "Casa Central Valparaíso",
    requiereInscripcion: true
  },
  
];

export const Route = createFileRoute('/evento/$id')({
  component: EventDetail,
});

function EventDetail() {
 
  const { id } = Route.useParams();
  
  const evento = eventosData.find(e => e.id === parseInt(id));

  if (!evento) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Evento no encontrado</h2>
        <Link to="/" className="text-blue-600 hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 mt-6">
      {/* Botón de retroceso */}
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-800 mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al catálogo
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* BLOQUE 1: ÁREA PRINCIPAL (Propósito y Descripción) */}
        <div className="flex-1 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{evento.titulo}</h1>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Propósito del evento</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
              {evento.descripcion}
            </p>
          </div>
        </div>

        {/* BLOQUE 2: FICHA TÉCNICA RESUMEN (Datos duros destacados) */}
        <div className="w-full md:w-80 bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-200 pb-3">Ficha Técnica</h3>
          
          <div className="space-y-5">
            {/* Modalidad */}
            <div className="flex items-start gap-3">
              {evento.modalidad === 'Online' ? (
                <MonitorPlay className="w-5 h-5 text-blue-600 mt-0.5" />
              ) : (
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">Modalidad</p>
                <p className="text-sm text-gray-600">{evento.modalidad}</p>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Fecha y Hora</p>
                <p className="text-sm text-gray-600">{evento.fecha} • {evento.hora}</p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Ubicación</p>
                <p className="text-sm text-gray-600">{evento.ubicacion}</p>
              </div>
            </div>

            <hr className="border-slate-200 my-5" />

            {/* Requisito de Acceso (BADGE EXPLÍCITO) */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">Requisito de acceso</p>
              {evento.requiereInscripcion ? (
                <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-2.5 rounded-md font-medium text-sm border border-orange-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Requiere Inscripción Previa</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2.5 rounded-md font-medium text-sm border border-green-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Acceso Liberado</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}