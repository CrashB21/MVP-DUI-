export type ModalidadEvento = "Presencial" | "Online" | "Híbrida";

export type EventoUSM = {
  id: number;
  titulo: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  horaTermino: string; // HH:MM
  carrera: string;
  campus: string;
  lugar: string;
  modalidad: ModalidadEvento;
  organizador: string;
  resumen: string;
  proposito: string;
  informacionGeneral: string;
  temas: string[];
  requiereInscripcion: boolean;
  requisitosDetalle: string;
  cuposTotales?: number;
  cuposDisponibles?: number;
};

export const EVENTOS_USM: EventoUSM[] = [
  {
    id: 1,
    titulo: "Hackathon USM 2026",
    fecha: "2026-11-14",
    hora: "09:00",
    horaTermino: "18:00",
    carrera: "Ingeniería Civil Informática",
    campus: "Casa Central Valparaíso",
    lugar: "Salón de Honor y Laboratorios Edificio F",
    modalidad: "Presencial",
    organizador: "Departamento de Informática USM",
    resumen:
      "Competencia intensiva donde equipos multidisciplinarios desarrollan soluciones tecnológicas a desafíos reales propuestos por empresas asociadas.",
    proposito:
      "Fomentar la innovación aplicada, el trabajo colaborativo bajo presión y la vinculación temprana con la industria tecnológica, permitiendo que estudiantes pongan a prueba sus habilidades de desarrollo y diseño de software frente a problemas reales de sustentabilidad.",
    informacionGeneral:
      "Durante la jornada, los equipos contarán con mentorías técnicas de docentes y profesionales de la industria, alimentación incluida y espacios de trabajo equipados. Al finalizar, cada equipo presentará un prototipo funcional (pitch de 5 minutos) ante un jurado académico e industrial.",
    temas: [
      "Desarrollo rápido de prototipos y arquitectura de software",
      "Soluciones digitales para eficiencia hídrica y energética",
      "Mentorías de diseño UX/UI y validación de producto",
      "Presentación de pitch final y premiación a los 3 primeros lugares",
    ],
    requiereInscripcion: true,
    requisitosDetalle:
      "Requiere inscripción previa con correo institucional USM. Puedes inscribirte de forma individual (se asignará equipo) o con tu grupo ya conformado.",
    cuposTotales: 60,
    cuposDisponibles: 14,
  },
  {
    id: 2,
    titulo: "Charla: Energías Renovables en Chile",
    fecha: "2026-11-05",
    hora: "11:30",
    horaTermino: "13:00",
    carrera: "Ingeniería Civil Eléctrica",
    campus: "San Joaquín",
    lugar: "Auditorio Edificio F + Transmisión Zoom USM",
    modalidad: "Híbrida",
    organizador: "Departamento de Ingeniería Eléctrica",
    resumen:
      "Expertos del sector energético analizan el futuro de la energía solar, almacenamiento BESS y energía eólica en el Sistema Eléctrico Nacional.",
    proposito:
      "Conectar los contenidos teóricos de conversión y transmisión de energía con los proyectos reales de descarbonización que hoy lideran la transición energética en Chile, orientando a estudiantes sobre áreas de especialización y memorias de título.",
    informacionGeneral:
      "La actividad contará con dos exposiciones de ingenieros senior del Coordinador Eléctrico Nacional e investigadores USM, seguidas de un panel abierto de preguntas tanto para quienes asistan en sala como conectados vía streaming.",
    temas: [
      "Integración de parques solares y eólicos a gran escala en el norte y sur",
      "Sistemas de almacenamiento en baterías (BESS) y estabilidad de red",
      "Oportunidades de prácticas profesionales y temas de memoria 2027",
    ],
    requiereInscripcion: true,
    requisitosDetalle:
      "Inscripción previa requerida para reservar asiento en el auditorio o recibir automáticamente el enlace de Zoom en tu correo.",
    cuposTotales: 90,
    cuposDisponibles: 27,
  },
  {
    id: 3,
    titulo: "Taller de Robótica Básica",
    fecha: "2026-11-08",
    hora: "15:00",
    horaTermino: "17:30",
    carrera: "Ingeniería Civil Electrónica",
    campus: "Vitacura",
    lugar: "Laboratorio de Robótica, Pabellón B (Sala B-204)",
    modalidad: "Presencial",
    organizador: "Rama Estudiantil IEEE USM & Depto. de Electrónica",
    resumen:
      "Aprende a construir, cablear y programar desde cero un robot seguidor de línea utilizando Arduino y sensores infrarrojos. Materiales incluidos.",
    proposito:
      "Acercar la electrónica práctica y los sistemas embebidos a estudiantes de primeros años y entusiastas, entregando experiencia experimental directa con microcontroladores, sensores y control de motores sin requerir experiencia previa.",
    informacionGeneral:
      "El taller es 100% práctico y guiado paso a paso por ayudantes del laboratorio. Se facilitará un kit completo de Arduino, chasis, puente H y sensores por cada pareja de trabajo durante toda la sesión.",
    temas: [
      "Fundamentos de microcontroladores Arduino y lectura de sensores IR",
      "Control de velocidad de motores DC mediante modulación PWM",
      "Calibración en pista de prueba y mini competencia amistosa de cierre",
    ],
    requiereInscripcion: true,
    requisitosDetalle:
      "Cupos estrictamente limitados por disponibilidad de kits de laboratorio. Traer computador portátil (opcional, hay equipos en sala).",
    cuposTotales: 24,
    cuposDisponibles: 6,
  },
  {
    id: 4,
    titulo: "Feria Laboral de Ingeniería",
    fecha: "2026-11-20",
    hora: "10:00",
    horaTermino: "16:30",
    carrera: "Todas las carreras",
    campus: "Casa Central Valparaíso",
    lugar: "Patio Central y Gimnasio Universitario",
    modalidad: "Presencial",
    organizador: "Dirección de Vinculación con el Medio y Red de Exalumnos",
    resumen:
      "Más de 40 empresas nacionales e internacionales presentan ofertas de práctica industrial, práctica profesional y primer empleo para sansanos.",
    proposito:
      "Facilitar el contacto directo entre estudiantes USM y reclutadores de empresas líderes en ingeniería, tecnología, minería y servicios, reduciendo las barreras para conseguir prácticas de verano e inserción laboral temprana.",
    informacionGeneral:
      "Durante todo el día podrás recorrer los stands corporativos, dejar tu currículum digital mediante código QR, participar en entrevistas breves de reclutamiento y asistir a cápsulas de revisión express de CV.",
    temas: [
      "Stands de más de 40 empresas con vacantes de práctica y empleo joven",
      "Revisión gratuita de CV y perfil de LinkedIn con orientadores laborales",
      "Charlas breves de empleabilidad y procesos de selección técnica",
    ],
    requiereInscripcion: false,
    requisitosDetalle:
      "Acceso liberado durante toda la jornada para estudiantes y titulados USM presentando TUI (Tarjeta Universitaria Inteligente).",
  },
  {
    id: 5,
    titulo: "Webinar: Introducción a Machine Learning",
    fecha: "2026-11-03",
    hora: "18:00",
    horaTermino: "19:30",
    carrera: "Ingeniería Civil Informática",
    campus: "San Joaquín",
    lugar: "Sala Virtual Zoom Institucional USM",
    modalidad: "Online",
    organizador: "Laboratorio de Inteligencia Artificial Aplicada USM",
    resumen:
      "Sesión introductoria sobre modelos supervisados de aprendizaje automático con demostraciones interactivas en Python y Google Colab.",
    proposito:
      "Desmitificar los conceptos esenciales de Machine Learning para que cualquier estudiante con nociones básicas de programación comprenda cómo entrenar, evaluar e interpretar un modelo predictivo real.",
    informacionGeneral:
      "La sesión se dictará en vivo por Zoom e incluirá un cuaderno de Google Colab descargable para seguir los ejercicios en tiempo real sin necesidad de instalar librerías localmente.",
    temas: [
      "Flujo de trabajo de ciencia de datos: limpieza, entrenamiento y validación",
      "Modelos de clasificación y regresión con scikit-learn en Python",
      "Métricas clave para evitar sobreajuste (overfitting) en casos reales",
    ],
    requiereInscripcion: true,
    requisitosDetalle:
      "Inscripción gratuita obligatoria para recibir el enlace de acceso a la sala Zoom y el material de Google Colab.",
    cuposTotales: 150,
    cuposDisponibles: 42,
  },
  {
    id: 6,
    titulo: "Seminario de Minería Sustentable",
    fecha: "2026-11-12",
    hora: "16:00",
    horaTermino: "17:45",
    carrera: "Ingeniería Civil de Minas",
    campus: "Concepción",
    lugar: "Aula Magna Sede Concepción + Streaming Institucional",
    modalidad: "Híbrida",
    organizador: "Departamento de Ingeniería Metalúrgica y de Materiales",
    resumen:
      "Investigadores y especialistas de la industria presentan tecnologías limpias para reducir la huella hídrica y ambiental en operaciones mineras.",
    proposito:
      "Analizar críticamente los desafíos ambientales de la minería chilena hacia 2030 y dar a conocer nuevas tecnologías de recirculación de agua, relaves seguros y automatización que están transformando el perfil del ingeniero de minas.",
    informacionGeneral:
      "El seminario reúne a docentes investigadores y representantes de operaciones mineras para exponer casos de éxito aplicados en faenas nacionales, seguido de una ronda de conversación abierta con estudiantes.",
    temas: [
      "Uso de agua desalada y optimización hídrica en plantas concentradoras",
      "Gestión responsable y monitoreo geotécnico de depósitos de relaves",
      "Electromovilidad subterránea y reducción de emisiones en faena",
    ],
    requiereInscripcion: false,
    requisitosDetalle:
      "Entrada liberada por orden de llegada en Aula Magna y transmisión abierta en el canal oficial del departamento.",
  },
  {
    id: 7,
    titulo: "Concurso de Diseño de Puentes",
    fecha: "2026-11-25",
    hora: "14:00",
    horaTermino: "17:30",
    carrera: "Ingeniería Civil",
    campus: "Casa Central Valparaíso",
    lugar: "Laboratorio de Estructuras, Edificio C",
    modalidad: "Presencial",
    organizador: "Departamento de Obras Civiles USM",
    resumen:
      "Equipos estudiantiles diseñan y someten a ensayo de carga puentes a escala construidos en madera de balsa. Premios a eficiencia estructural.",
    proposito:
      "Experimentar de forma tangible los principios de estática, análisis estructural y eficiencia de materiales mediante el diseño y ensayo hasta la rotura de una estructura real a escala.",
    informacionGeneral:
      "Cada equipo (máximo 3 integrantes) presenta su puente construido según las bases geométricas oficiales y participa del ensayo público de carga progresiva en prensa hidráulica instrumentada.",
    temas: [
      "Recepción, pesaje oficial y verificación dimensional de estructuras",
      "Ensayo de carga vertical hasta falla estructural con medición en vivo",
      "Evaluación de relación resistencia/peso y premiación de equipos",
    ],
    requiereInscripcion: true,
    requisitosDetalle:
      "Requiere inscripción previa para registrar al representante de equipo, recibir las bases técnicas y retirar el kit de madera de balsa.",
    cuposTotales: 30,
    cuposDisponibles: 9,
  },
  {
    id: 8,
    titulo: "Taller de Finanzas Personales Universitarias",
    fecha: "2026-11-18",
    hora: "12:00",
    horaTermino: "13:15",
    carrera: "Ingeniería Comercial",
    campus: "Vitacura",
    lugar: "Sala Virtual Teams / Zoom USM",
    modalidad: "Online",
    organizador: "Departamento de Ingeniería Comercial & Relaciones Estudiantiles",
    resumen:
      "Aprende a organizar tu presupuesto mensual, utilizar instrumentos de ahorro sin comisiones e invertir de forma responsable siendo estudiante.",
    proposito:
      "Entregar herramientas prácticas de educación financiera adaptadas a la realidad económica estudiantil (becas, mesadas, ayudantías y primeras prácticas) para prevenir el sobreendeudamiento temprano.",
    informacionGeneral:
      "Durante el taller trabajaremos sobre una plantilla descargable de presupuesto personal y revisaremos ejemplos reales sobre tarjetas universitarias, fondos mutuos conservadores, DAP y prevención de fraudes digitales.",
    temas: [
      "Método práctico 50/30/20 adaptado a ingresos variables de estudiantes",
      "Diferencias reales entre cuentas vista, tarjetas de crédito y ahorro UF",
      "Plantilla editable de control de gastos mensuales para el semestre",
    ],
    requiereInscripcion: true,
    requisitosDetalle:
      "Inscripción previa gratuita para envío del enlace de conexión y plantilla descargable de presupuesto.",
    cuposTotales: 120,
    cuposDisponibles: 35,
  },
  {
    id: 9,
    titulo: "Jornada de Química Aplicada e Industria",
    fecha: "2026-11-27",
    hora: "10:30",
    horaTermino: "13:30",
    carrera: "Ingeniería Civil Química",
    campus: "Concepción",
    lugar: "Laboratorios de Procesos Químicos, Pabellón Q",
    modalidad: "Presencial",
    organizador: "Departamento de Ingeniería Química y Ambiental",
    resumen:
      "Demostraciones experimentales en planta piloto y charlas sobre bioprocesos, hidrógeno verde y procesos químicos industriales.",
    proposito:
      "Mostrar en funcionamiento el equipamiento de planta piloto del departamento y vincular a estudiantes con líneas de investigación aplicada en procesos sustentables e hidrógeno verde.",
    informacionGeneral:
      "La jornada combina una charla inaugural de exalumnos que trabajan en plantas de procesos con recorridos guiados en grupos reducidos por estaciones experimentales de destilación, reactores y tratamiento de aguas.",
    temas: [
      "Recorrido guiado por planta piloto de operaciones unitarias",
      "Producción y almacenamiento seguro de hidrógeno verde en Chile",
      "Conversatorio con ingenieros químicos titulados de la USM",
    ],
    requiereInscripcion: true,
    requisitosDetalle:
      "Inscripción obligatoria por protocolo de aforo y seguridad en laboratorios (se entregará antiparras de seguridad al ingreso).",
    cuposTotales: 35,
    cuposDisponibles: 11,
  },
];

export const CARRERAS_CATALOGO: string[] = Array.from(
  new Set(EVENTOS_USM.map((e) => e.carrera)),
).sort();

/**
 * Carreras específicas para formularios de estudiante y alertas personalizadas
 * (excluye "Todas las carreras" y añade carreras USM mencionadas en entrevistas).
 */
export const CARRERAS_ALERTAS_USM: string[] = Array.from(
  new Set([
    ...EVENTOS_USM.map((e) => e.carrera).filter((c) => c !== "Todas las carreras"),
    "Ingeniería en Diseño de Productos",
    "Licenciatura en Ciencias mención Matemática",
  ]),
).sort();

export const CAMPUS_USM: string[] = [
  "Casa Central Valparaíso",
  "San Joaquín",
  "Vitacura",
  "Viña del Mar",
  "Concepción",
];

export const CAMPUS_CATALOGO: string[] = Array.from(
  new Set(EVENTOS_USM.map((e) => e.campus)),
).sort();

export const MODALIDADES_CATALOGO: ModalidadEvento[] = [
  "Presencial",
  "Híbrida",
  "Online",
];

export const normalizarTexto = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const formatFechaLarga = (fechaIso: string): string =>
  new Date(`${fechaIso}T00:00:00`).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatFechaCorta = (fechaIso: string): string =>
  new Date(`${fechaIso}T00:00:00`).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function descargarCalendarioICS(evento: EventoUSM, codigoReserva?: string): void {
  if (typeof window === "undefined") return;

  const fechaCompacta = evento.fecha.replace(/-/g, "");
  const inicioCompacto = `${fechaCompacta}T${evento.hora.replace(":", "")}00`;
  const terminoCompacto = `${fechaCompacta}T${evento.horaTermino.replace(":", "")}00`;
  const descripcionLimpia = [
    codigoReserva ? `Código de confirmación: ${codigoReserva}` : "",
    `Modalidad: ${evento.modalidad}`,
    `Carrera: ${evento.carrera}`,
    `Organiza: ${evento.organizador}`,
    "",
    evento.proposito,
  ]
    .filter(Boolean)
    .join("\\n");

  const contenidoICS = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eventos USM//MVP DIU//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:usm-evento-${evento.id}@eventos.usm.cl`,
    `DTSTAMP:${inicioCompacto}`,
    `DTSTART:${inicioCompacto}`,
    `DTEND:${terminoCompacto}`,
    `SUMMARY:${evento.titulo} - USM`,
    `LOCATION:${evento.lugar}, Campus ${evento.campus}`,
    `DESCRIPTION:${descripcionLimpia}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([contenidoICS], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `evento-usm-${evento.id}.ics`;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}
