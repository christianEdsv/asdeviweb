import type { Author, Post } from "@/types/content";
import {
  avatar,
  block,
  bullets,
  cover,
  daysFromNow,
  imageBlock,
  youtubeBlock,
} from "./helpers";

const editorial: Author = {
  _id: "mock-author-1",
  name: "Equipo Editorial ASDEVI",
  role: "Comunicación",
  bio: "Equipo de comunicación de la asociación.",
  avatar: avatar(1, "Avatar del equipo editorial"),
};

const presidencia: Author = {
  _id: "mock-author-2",
  name: "Mariana Ortega",
  role: "Presidenta",
  bio: "Productora de videojuegos y presidenta de la asociación.",
  avatar: avatar(2, "Foto de Mariana Ortega"),
};

interface PostSeed {
  slug: string;
  title: string;
  category: Post["category"];
  daysAgo: number;
  coverIndex: number;
  author: Author;
  excerpt: string;
  paragraphs: string[];
}

const seeds: PostSeed[] = [
  {
    slug: "asociacion-presenta-su-plataforma-oficial",
    title: "ASDEVI presenta su plataforma oficial para la comunidad de desarrollo",
    category: "comunicados",
    daysAgo: 2,
    coverIndex: 1,
    author: presidencia,
    excerpt:
      "Nace el portal institucional donde se podrán conocer a los miembros, consultar la agenda de eventos y seguir las noticias de la industria local.",
    paragraphs: [
      "Hoy ponemos en marcha la plataforma oficial de la asociación, un espacio pensado para dar visibilidad a quienes hacen videojuegos en nuestra región.",
      "El portal incluye un directorio de miembros con perfil propio, la agenda de eventos y una sala de prensa con las novedades del sector.",
      "En próximas fases se abrirán convocatorias para nuevos miembros y herramientas colaborativas.",
    ],
  },
  {
    slug: "echoes-of-orbit-llega-a-acceso-anticipado",
    title: "Echoes of Orbit, de Nébula Pixel Studio, llega a acceso anticipado",
    category: "lanzamientos",
    daysAgo: 6,
    coverIndex: 2,
    author: editorial,
    excerpt:
      "El roguelite espacial de uno de nuestros estudios miembros ya se puede jugar en Steam con tres biomas y más de cien reliquias.",
    paragraphs: [
      "Tras dos años de desarrollo, Nébula Pixel Studio lanzó Echoes of Orbit en acceso anticipado.",
      "El equipo planea actualizaciones trimestrales y ya trabaja en el modo cooperativo.",
    ],
  },
  {
    slug: "entrevista-valeria-huerta-godot-comunidad",
    title: "Entrevista con Valeria Huerta: Godot, jams y construir comunidad",
    category: "entrevistas",
    daysAgo: 11,
    coverIndex: 3,
    author: editorial,
    excerpt:
      "Conversamos con la desarrolladora independiente sobre cómo empezó, por qué eligió Godot y qué consejos da a quienes inician.",
    paragraphs: [
      "Valeria Huerta desarrolla juegos de puzzle desde 2019 y es una de las mentoras más activas de nuestras jams.",
      "Hablamos de su proceso creativo, de las herramientas que usa y de lo que ha aprendido enseñando a otras personas.",
    ],
  },
  {
    slug: "reporte-industria-local-2026",
    title: "Reporte de la industria local: empleo, estudios y financiamiento",
    category: "industria-local",
    daysAgo: 16,
    coverIndex: 4,
    author: editorial,
    excerpt:
      "El Observatorio de Tecnología Creativa publica los datos más recientes sobre el crecimiento del sector de videojuegos en la región.",
    paragraphs: [
      "El informe, elaborado junto a nuestro aliado académico, analiza más de 60 estudios y desarrolladores independientes.",
      "Entre los hallazgos: el empleo creció un 22 % y la mayoría de los estudios financia sus proyectos con servicios de co-desarrollo.",
    ],
  },
  {
    slug: "convocatoria-game-jam-orbita",
    title: "Abre la convocatoria para la Game Jam Órbita",
    category: "comunicados",
    daysAgo: 21,
    coverIndex: 5,
    author: presidencia,
    excerpt:
      "Ya puedes inscribirte a la jam anual de 48 horas. Participa en solitario o forma un equipo de hasta cuatro personas.",
    paragraphs: [
      "La Game Jam Órbita regresa en formato en línea. El tema se revelará al inicio del evento y la participación es gratuita.",
      "Habrá mentores disponibles durante las 48 horas y premios donados por estudios miembros.",
    ],
  },
  {
    slug: "pluma-libre-games-anuncia-la-casa-de-los-ecos",
    title: "Pluma Libre Games anuncia La Casa de los Ecos",
    category: "lanzamientos",
    daysAgo: 28,
    coverIndex: 6,
    author: editorial,
    excerpt:
      "La novela visual de misterio llegará a PC y Nintendo Switch el próximo año; ya hay demo disponible en itch.io.",
    paragraphs: [
      "El estudio presentó el tráiler y una demo jugable con los primeros capítulos de la historia.",
      "La música está compuesta por miembros de Cráter Audio Lab, un ejemplo de colaboración dentro de la asociación.",
    ],
  },
  {
    slug: "convenio-politecnica-practicas-profesionales",
    title: "Convenio con la Politécnica de Artes Digitales para prácticas profesionales",
    category: "industria-local",
    daysAgo: 35,
    coverIndex: 7,
    author: presidencia,
    excerpt:
      "Estudios miembros recibirán estudiantes de últimos semestres en un programa de prácticas con mentoría.",
    paragraphs: [
      "El programa busca acortar la distancia entre la formación académica y las necesidades reales de los estudios.",
      "Las plazas se publicarán a través de los canales oficiales de la asociación.",
    ],
  },
  {
    slug: "entrevista-crater-audio-lab-sonido-adaptativo",
    title: "Cráter Audio Lab: cómo se diseña el sonido adaptativo",
    category: "entrevistas",
    daysAgo: 44,
    coverIndex: 8,
    author: editorial,
    excerpt:
      "El estudio de audio explica su flujo de trabajo con FMOD y por qué la música reactiva cambia la experiencia de juego.",
    paragraphs: [
      "En esta entrevista repasamos las decisiones técnicas detrás de las bandas sonoras interactivas de los juegos locales.",
    ],
  },
  {
    slug: "steam-next-fest-estudios-locales",
    title: "Siete estudios locales participarán en el próximo Steam Next Fest",
    category: "industria-local",
    daysAgo: 52,
    coverIndex: 2,
    author: editorial,
    excerpt:
      "La asociación coordinará una página de tienda conjunta y sesiones de preparación para maximizar la visibilidad de las demos.",
    paragraphs: [
      "La participación conjunta permitirá compartir aprendizajes y costos de producción de materiales promocionales.",
    ],
  },
  {
    slug: "nuevo-comite-de-etica-y-convivencia",
    title: "Se conforma el Comité de Ética y Convivencia de la asociación",
    category: "comunicados",
    daysAgo: 61,
    coverIndex: 1,
    author: presidencia,
    excerpt:
      "El comité velará por entornos seguros en eventos, jams y espacios digitales de la comunidad.",
    paragraphs: [
      "El comité estará integrado por tres miembros y una persona externa especialista en mediación.",
    ],
  },
  {
    slug: "rune-garden-premio-del-publico",
    title: "Rune Garden gana el premio del público en el Showcase de Primavera",
    category: "lanzamientos",
    daysAgo: 75,
    coverIndex: 3,
    author: editorial,
    excerpt:
      "El juego de puzzles de Valeria Huerta fue el más votado por los asistentes y prepara su lanzamiento en itch.io.",
    paragraphs: [
      "El premio del público se decidió con más de 400 votos durante la jornada del showcase.",
    ],
  },
];

export const mockPosts: Post[] = seeds.map((seed, index) => {
  const first = index === 0;
  const second = index === 1;
  return {
    _id: `mock-post-${index + 1}`,
    slug: seed.slug,
    title: seed.title,
    publishedAt: daysFromNow(-seed.daysAgo, 15),
    author: seed.author,
    category: seed.category,
    mainImage: cover(seed.coverIndex, `Imagen principal: ${seed.title}`),
    excerpt: seed.excerpt,
    body: [
      ...seed.paragraphs.map((text) => block(text)),
      ...(first
        ? [
            block("Qué encontrarás en la plataforma", "h2"),
            ...bullets([
              "Directorio de miembros con buscador y filtros por especialidad.",
              "Agenda de eventos con inscripción directa.",
              "Sala de prensa con noticias y comunicados oficiales.",
            ]),
            block("Una comunidad más visible es una industria más fuerte.", "blockquote"),
            youtubeBlock(
              "https://www.youtube.com/watch?v=jNQXAC9IVRw",
              "Video de ejemplo embebido desde YouTube",
            ),
          ]
        : []),
      ...(second
        ? [
            imageBlock({
              ...cover(1, "Captura de Echoes of Orbit"),
              caption: "Captura de pantalla de Echoes of Orbit",
            }),
          ]
        : []),
    ],
  };
});
