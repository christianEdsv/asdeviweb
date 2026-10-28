import type { EventItem } from "@/types/content";
import { block, bullets, cover, daysFromNow } from "./helpers";

export const mockEvents: EventItem[] = [
  {
    _id: "mock-event-1",
    slug: "taller-godot-desde-cero",
    title: "Taller: tu primer juego en Godot desde cero",
    coverImage: cover(3, "Ilustración abstracta del taller de Godot"),
    eventType: "charla-taller",
    startDate: daysFromNow(9, 16),
    endDate: daysFromNow(9, 20),
    mode: "presencial",
    locationName: "Laboratorio de Cómputo, Politécnica de Artes Digitales",
    address: "Av. de las Artes 120, Centro",
    summary:
      "Cuatro horas prácticas para crear un juego 2D completo con Godot 4, guiadas por desarrolladoras de la asociación.",
    description: [
      block(
        "Un taller práctico para quienes nunca han hecho un videojuego. Trabajaremos con Godot 4 y construiremos un platformer 2D completo en una tarde.",
      ),
      block("Qué aprenderás", "h2"),
      ...bullets([
        "Escenas, nodos y señales: la forma de pensar de Godot.",
        "Movimiento del jugador, colisiones y enemigos simples.",
        "Cómo exportar y publicar tu juego en itch.io.",
      ]),
      block("Trae tu laptop con Godot 4 instalado. Los cupos son limitados."),
    ],
    registrationUrl: "https://www.eventbrite.com/",
  },
  {
    _id: "mock-event-2",
    slug: "game-jam-48-horas-orbita",
    title: "Game Jam Órbita · 48 horas",
    coverImage: cover(5, "Arte promocional de la Game Jam Órbita"),
    eventType: "game-jam",
    startDate: daysFromNow(16, 17),
    endDate: daysFromNow(18, 17),
    mode: "online",
    streamUrl: "https://discord.gg/asdevi",
    summary:
      "48 horas para crear un juego alrededor de un tema sorpresa. Equipos de hasta cuatro personas, abierto a principiantes.",
    description: [
      block(
        "La Game Jam Órbita es la jam anual de la asociación. El tema se revela al inicio y todo el evento ocurre en nuestro servidor de Discord.",
      ),
      block("Reglas básicas", "h2"),
      ...bullets([
        "Equipos de 1 a 4 personas.",
        "Cualquier motor o herramienta; se permiten assets propios o de licencia libre.",
        "Los juegos se publican en itch.io y votan los participantes y un jurado de miembros.",
      ]),
    ],
    registrationUrl: "https://itch.io/jams",
  },
  {
    _id: "mock-event-3",
    slug: "showcase-anual-indie",
    title: "Showcase Anual de Juegos Indie",
    coverImage: cover(1, "Arte del Showcase Anual de Juegos Indie"),
    eventType: "showcase",
    startDate: daysFromNow(34, 15),
    endDate: daysFromNow(35, 22),
    mode: "hibrido",
    locationName: "Centro Cultural del Videojuego",
    address: "Calle Pixel 45, Zona Cultural",
    streamUrl: "https://www.youtube.com/@asdevi",
    summary:
      "Dos días para jugar los proyectos de nuestros estudios y desarrolladores, con charlas de industria y transmisión en vivo.",
    description: [
      block(
        "El evento insignia de la asociación: más de 30 juegos jugables, charlas sobre publicación y financiamiento, y una noche de networking con publishers invitados.",
      ),
      block("Programa", "h2"),
      ...bullets([
        "Día 1: zona de demos, charlas y panel de publishers.",
        "Día 2: torneo de demos, premiación del público y cierre con música en vivo.",
      ]),
      block("La entrada es gratuita con registro previo. Habrá transmisión para quienes participen en línea."),
    ],
    registrationUrl: "https://www.eventbrite.com/",
  },
  {
    _id: "mock-event-4",
    slug: "noche-de-networking-indie",
    title: "Noche de Networking Indie",
    coverImage: cover(4, "Ilustración de la Noche de Networking Indie"),
    eventType: "networking",
    startDate: daysFromNow(-21, 0),
    endDate: daysFromNow(-21, 3),
    mode: "presencial",
    locationName: "Cervecería Artesanal La Fábrica",
    address: "Calle Industria 8",
    summary:
      "Encuentro informal para que estudios, freelancers y estudiantes se conozcan y encuentren colaboradores.",
    description: [
      block(
        "Más de 80 personas de la comunidad se reunieron para intercambiar contactos, mostrar prototipos en laptops y formar equipos para futuros proyectos.",
      ),
    ],
  },
  {
    _id: "mock-event-5",
    slug: "charla-publicar-en-steam",
    title: "Charla: cómo publicar tu primer juego en Steam",
    coverImage: cover(2, "Portada de la charla sobre Steam"),
    eventType: "charla-taller",
    startDate: daysFromNow(-65, 19),
    endDate: daysFromNow(-65, 21),
    mode: "online",
    streamUrl: "https://www.youtube.com/@asdevi",
    summary:
      "Checklist de lanzamiento, página de tienda, wishlists y calendarización de campañas con ejemplos reales.",
    description: [
      block(
        "Dos estudios miembros compartieron su proceso completo de lanzamiento en Steam: desde la página de tienda hasta el día uno, con cifras y errores incluidos.",
      ),
    ],
  },
  {
    _id: "mock-event-6",
    slug: "showcase-primavera",
    title: "Showcase de Primavera",
    coverImage: cover(6, "Arte del Showcase de Primavera"),
    eventType: "showcase",
    startDate: daysFromNow(-140, 15),
    endDate: daysFromNow(-140, 21),
    mode: "presencial",
    locationName: "Biblioteca Central",
    address: "Plaza Mayor s/n",
    summary:
      "Primera edición del showcase abierto al público con 14 proyectos locales.",
    description: [
      block(
        "La primera edición del showcase reunió a 14 proyectos y más de 400 asistentes. Fue el punto de partida de la asociación.",
      ),
    ],
  },
];
