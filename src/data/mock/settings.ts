import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types/content";
import { avatar } from "./helpers";

export const mockSettings: SiteSettings = {
  email: siteConfig.email,
  socials: { ...siteConfig.socials },
  about: {
    intro:
      "Somos la asociación que reúne a estudios, desarrolladores independientes y aliados académicos para construir una industria de videojuegos sólida, colaborativa y visible.",
    missionSummary:
      "Impulsar el crecimiento profesional de quienes crean videojuegos, conectando talento, recursos y oportunidades para que cada proyecto local llegue más lejos.",
    mission:
      "Impulsar el crecimiento profesional de quienes crean videojuegos, conectando talento, recursos y oportunidades. Representamos al sector ante instituciones, promovemos la formación continua y damos visibilidad al trabajo de nuestros miembros.",
    vision:
      "Ser reconocidos como el ecosistema de desarrollo de videojuegos más colaborativo de la región: un lugar donde crear juegos sea una carrera sostenible y donde las ideas locales se jueguen en todo el mundo.",
    history: [
      {
        year: "2024",
        title: "Nace la asociación",
        description:
          "Un grupo de doce estudios y desarrolladores firma el acta constitutiva tras una serie de encuentros informales.",
      },
      {
        year: "2025",
        title: "Primer Showcase abierto al público",
        description:
          "Más de 400 asistentes y 14 proyectos locales en la primera edición del showcase.",
      },
      {
        year: "2025",
        title: "Alianzas académicas",
        description:
          "Se firman los primeros convenios con universidades para prácticas profesionales y laboratorios de prueba.",
      },
      {
        year: "2026",
        title: "Plataforma oficial",
        description:
          "Lanzamos el portal institucional con directorio de miembros, agenda de eventos y sala de prensa.",
      },
    ],
    objectives: [
      {
        title: "Visibilizar el talento local",
        description:
          "Dar a conocer a nuestros miembros y sus juegos ante la prensa, publishers y público.",
      },
      {
        title: "Formación continua",
        description:
          "Organizar talleres, charlas y jams que eleven el nivel técnico y creativo de la comunidad.",
      },
      {
        title: "Representación del gremio",
        description:
          "Dialogar con instituciones y organismos para impulsar políticas de apoyo a la industria.",
      },
      {
        title: "Colaboración entre miembros",
        description:
          "Facilitar la creación de equipos, el intercambio de recursos y los proyectos conjuntos.",
      },
      {
        title: "Acceso a mercados",
        description:
          "Abrir puertas a ferias internacionales, plataformas de distribución y financiamiento.",
      },
    ],
    board: [
      {
        name: "Mariana Ortega",
        role: "Presidenta",
        bio: "Productora con más de diez años en la industria. Lidera la visión estratégica de la asociación.",
        photo: avatar(2, "Foto de Mariana Ortega"),
        links: [{ type: "linkedin", url: "https://www.linkedin.com/" }],
      },
      {
        name: "Diego Salazar",
        role: "Vicepresidente",
        bio: "Programador de gameplay y cofundador de un estudio indie. Coordina los programas de formación.",
        photo: avatar(3, "Foto de Diego Salazar"),
        links: [{ type: "x", url: "https://x.com/" }],
      },
      {
        name: "Lucía Barrientos",
        role: "Secretaria",
        bio: "Gestora cultural y diseñadora de experiencias. Responsable de eventos y alianzas.",
        photo: avatar(4, "Foto de Lucía Barrientos"),
      },
      {
        name: "Andrés Pineda",
        role: "Tesorero",
        bio: "Productor ejecutivo y asesor financiero para estudios independientes.",
        photo: avatar(5, "Foto de Andrés Pineda"),
      },
    ],
    faqs: [
      {
        question: "¿Quién puede ser miembro de la asociación?",
        answer:
          "Pueden unirse estudios indie, desarrolladores independientes y organizaciones académicas o aliadas vinculadas al sector de videojuegos.",
      },
      {
        question: "¿Cómo me uno en las próximas convocatorias?",
        answer:
          "Anunciaremos cada convocatoria en esta página, en nuestro Discord y en redes sociales. El proceso consiste en completar un formulario, compartir un portafolio y una breve entrevista con el comité.",
      },
      {
        question: "¿Tiene costo ser miembro?",
        answer:
          "Actualmente la membresía es gratuita. En el futuro podría existir una cuota simbólica que se comunicará con anticipación.",
      },
      {
        question: "¿Qué beneficios obtengo como miembro?",
        answer:
          "Perfil público en el directorio, difusión de tus lanzamientos, acceso prioritario a eventos y showcases, mentorías y oportunidades de colaboración con otros miembros.",
      },
      {
        question: "¿Puedo participar en los eventos sin ser miembro?",
        answer:
          "Sí. La mayoría de nuestros eventos, como jams, charlas y showcases, están abiertos a toda la comunidad con registro previo.",
      },
      {
        question: "¿Cómo puedo contactar a la asociación?",
        answer:
          "Escríbenos al correo oficial que aparece al final de la página o únete a nuestro servidor de Discord.",
      },
    ],
    joinIntro:
      "Por ahora no hay una convocatoria abierta. Abriremos la siguiente en los próximos meses; suscríbete a nuestras redes y a Discord para enterarte primero.",
  },
};
