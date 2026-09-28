export type ResourceSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Resource = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  toolLabel: string;
  toolHref: string;
  toolDescription: string;
  sections: ResourceSection[];
};

export const resources: Resource[] = [
  {
    slug: "como-saber-si-tu-proyecto-esta-bajo-control",
    category: "Project Management",
    title: "Cómo saber si tu proyecto está realmente bajo control",
    excerpt:
      "Tener un planning y reuniones semanales no significa tener el proyecto controlado. Estas son las señales que permiten distinguir visibilidad de control real.",
    readTime: "7 min",
    publishedAt: "2026-09-28",
    toolLabel: "Project Health Check",
    toolHref: "/project-health-check",
    toolDescription: "Evalúa diez dimensiones del proyecto y obtén una lectura estructurada de riesgos y prioridades.",
    sections: [
      {
        heading: "Control no es tener más reporting",
        paragraphs: [
          "Un proyecto puede producir informes cada semana y, aun así, estar acumulando riesgo. El control real aparece cuando el equipo puede explicar con claridad qué se está entregando, qué puede impedirlo, quién debe actuar y qué decisión toca tomar.",
          "La diferencia es importante: la visibilidad describe lo que ocurre; el control permite intervenir antes de que una desviación sea irreversible.",
        ],
      },
      {
        heading: "Cinco señales de que falta control",
        bullets: [
          "El porcentaje de avance sube, pero los hitos no se cierran.",
          "Las dependencias se descubren cuando ya bloquean al equipo.",
          "El ETC o la capacidad restante no se revisan mientras una tarea está en curso.",
          "Los riesgos se registran, pero no tienen propietario ni fecha de actuación.",
          "Dirección recibe actividad, no decisiones, impacto ni previsión.",
        ],
      },
      {
        heading: "Qué debería poder responder un proyecto sano",
        paragraphs: [
          "En cualquier momento deberías poder responder cinco preguntas: qué queda, cuánto esfuerzo queda, qué capacidad real tienes, qué dependencias condicionan la fecha y qué decisiones están pendientes.",
          "Cuando alguna de esas respuestas depende de una interpretación o de preguntar a varias personas, existe una oportunidad clara de mejorar la gobernanza del proyecto.",
        ],
      },
      {
        heading: "Una forma práctica de empezar",
        paragraphs: [
          "No necesitas implantar una PMO completa. Empieza revisando alcance, planificación, capacidad, riesgos, dependencias, stakeholders, calidad, reporting, delivery y gestión del cambio. Después prioriza únicamente las dos o tres áreas con mayor impacto.",
          "El objetivo de un diagnóstico no es producir una nota. Es elegir dónde intervenir primero.",
        ],
      },
    ],
  },
  {
    slug: "como-estimar-fechas-de-delivery-sin-enganarte",
    category: "Delivery",
    title: "Cómo estimar fechas de delivery sin engañarte con la capacidad",
    excerpt:
      "Horas, FTE, vacaciones, foco productivo y dependencias no son variables independientes. Una fecha fiable exige tratarlas como un sistema.",
    readTime: "8 min",
    publishedAt: "2026-09-28",
    toolLabel: "Delivery Planner",
    toolHref: "/delivery-planner",
    toolDescription: "Contrasta esfuerzo, capacidad, contingencia y fecha objetivo mediante escenarios comparables.",
    sections: [
      {
        heading: "El error habitual: horas divididas entre personas",
        paragraphs: [
          "Una estimación básica suele dividir el esfuerzo pendiente entre las horas teóricas del equipo. El resultado parece matemático, pero normalmente ignora vacaciones, reuniones, soporte, multitarea, bloqueos y trabajo no planificado.",
          "Por eso una planificación puede ser correcta en Excel y fallar en calendario.",
        ],
      },
      {
        heading: "Capacidad nominal y capacidad efectiva",
        paragraphs: [
          "La capacidad nominal es la que figura en contrato o planificación. La capacidad efectiva es la parte que realmente puede convertirse en avance del proyecto.",
          "Trabajar con una utilización productiva explícita obliga a hacer visible esa diferencia y evita comprometer fechas con una capacidad que nunca existe en la práctica.",
        ],
      },
      {
        heading: "Variables que deberían estar en cualquier escenario",
        bullets: [
          "Esfuerzo pendiente, no esfuerzo ya incurrido.",
          "FTE realmente asignado durante el periodo.",
          "Horas útiles por jornada y porcentaje de utilización productiva.",
          "Vacaciones y ausencias conocidas.",
          "Dependencias o ventanas que bloquean el avance.",
          "Contingencia para incertidumbre todavía no absorbida.",
          "Fecha objetivo para calcular el FTE necesario, no solo la fecha probable.",
        ],
      },
      {
        heading: "Trabaja con escenarios, no con una única fecha",
        paragraphs: [
          "Un escenario base, uno conservador y uno reforzado comunican mucho mejor la incertidumbre que una fecha única presentada como certeza.",
          "El valor no está en elegir la fecha más cómoda, sino en explicar qué hipótesis hacen posible cada escenario y qué decisión cambia el resultado.",
        ],
      },
    ],
  },
  {
    slug: "como-definir-un-mvp-sin-construir-de-mas",
    category: "Emprendimiento",
    title: "Cómo definir un MVP sin construir de más",
    excerpt:
      "Un MVP no es una versión barata del producto final. Es el mínimo conjunto de capacidades que permite validar una hipótesis relevante.",
    readTime: "7 min",
    publishedAt: "2026-09-28",
    toolLabel: "MVP Planner",
    toolHref: "/mvp-planner",
    toolDescription: "Convierte una idea en problema, usuario, propuesta de valor, alcance MoSCoW, hipótesis y roadmap inicial.",
    sections: [
      {
        heading: "Empieza por la hipótesis, no por las funcionalidades",
        paragraphs: [
          "La primera pregunta no debería ser qué funcionalidades tendrá la aplicación. Debería ser qué comportamiento, necesidad o disposición a pagar necesitas validar para justificar seguir invirtiendo.",
          "Cuando el MVP nace desde una lista de funcionalidades, el alcance crece antes de que exista evidencia de valor.",
        ],
      },
      {
        heading: "Define el problema con precisión",
        bullets: [
          "Quién tiene el problema.",
          "En qué contexto aparece.",
          "Cómo lo resuelve actualmente.",
          "Qué fricción o coste existe hoy.",
          "Qué resultado sería suficientemente valioso como para cambiar de comportamiento.",
        ],
      },
      {
        heading: "MoSCoW sirve si eres exigente con el Must",
        paragraphs: [
          "Clasificar todo como Must elimina el valor de priorizar. Un Must debería ser aquello sin lo que no puedes validar la propuesta de valor o completar el flujo principal del usuario.",
          "Should y Could no son funcionalidades descartadas: son decisiones conscientemente aplazadas para proteger velocidad y aprendizaje.",
        ],
      },
      {
        heading: "Una buena primera versión tiene también fuera de alcance",
        paragraphs: [
          "Especificar qué no vas a construir es tan importante como definir qué entra. Reduce ambigüedad con proveedores, evita expectativas implícitas y protege la fecha objetivo.",
          "El MVP termina cuando puedes aprender algo relevante, no cuando has reproducido el producto que imaginas a tres años.",
        ],
      },
    ],
  },
  {
    slug: "como-escribir-un-status-ejecutivo-que-direccion-entienda",
    category: "Comunicación ejecutiva",
    title: "Cómo escribir un status ejecutivo que dirección entienda en dos minutos",
    excerpt:
      "Un buen status no enumera todo lo que ha hecho el equipo. Explica situación, impacto, decisiones y próximos pasos con la mínima información necesaria.",
    readTime: "6 min",
    publishedAt: "2026-09-28",
    toolLabel: "Executive Status Generator",
    toolHref: "/executive-status-generator",
    toolDescription: "Ordena hitos, riesgos, bloqueos y decisiones en un estado ejecutivo listo para compartir.",
    sections: [
      {
        heading: "Dirección no necesita el diario del proyecto",
        paragraphs: [
          "El error más frecuente en un status es confundir transparencia con volumen. Una lista larga de actividades obliga al receptor a interpretar por sí mismo si el proyecto está bien o mal.",
          "La comunicación ejecutiva debería reducir trabajo cognitivo: situación, variación respecto al plan, impacto y acción requerida.",
        ],
      },
      {
        heading: "La estructura mínima que funciona",
        bullets: [
          "Estado general: en control, atención o crítico, acompañado de una frase que lo justifique.",
          "Hitos completados y próximos hitos con fecha.",
          "Riesgos relevantes: solo aquellos que pueden cambiar el resultado.",
          "Bloqueos y dependencias con propietario o siguiente acción.",
          "Decisiones pendientes: qué se necesita decidir, por quién y antes de cuándo.",
          "Próximos pasos: acciones concretas, no intenciones.",
        ],
      },
      {
        heading: "Separa hechos de previsiones",
        paragraphs: [
          "Un hito completado es un hecho. Una fecha prevista es una hipótesis. Mezclarlos da una falsa sensación de certeza.",
          "Explicitar las hipótesis que sostienen una fecha permite que dirección entienda qué puede alterarla y dónde puede intervenir.",
        ],
      },
      {
        heading: "Termina con la decisión que necesitas",
        paragraphs: [
          "Si el status contiene un problema que requiere patrocinio, presupuesto, priorización o resolución de una dependencia, la petición debe aparecer de forma explícita.",
          "Un buen reporte no solo informa: acelera la siguiente decisión correcta.",
        ],
      },
    ],
  },
];

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
