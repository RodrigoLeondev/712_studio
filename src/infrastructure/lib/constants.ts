export const SITE = {
  name: '712',
  title: '712 — Innovation and Design',
  description: 'Creative studio description for 712',
  url: 'https://712.com',
  keywords: 'innovation, design, 712',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Acerca de 712', href: '#about' },
  { label: 'Servicios', href: '#services' },
  { label: 'Proceso', href: '#process' },
  { label: 'Contacto', href: '#contact' },
] as const;

export const HERO = {
  badgeText: 'Creative Studio',
  title: '712 es un estudio creativo audiovisual que une creatividad, contexto de negocio y ejecución audiovisual en un mismo flujo de trabajo.',
  subtitle: '',
  ctaText: 'Agendar llamada',
  ctaLink: '#contact',
  videoUrl: 'https://www.youtube.com/embed/u1naZok0nX8',
} as const;

export const COLORS = {
  primary: '#1A1A2E',
  secondary: '#16213E',
  accent: '#E94560',
  gold: '#F5A623',
  light: '#F5F5F5',
  white: '#f4f3f2',
  dark: '#141414',
  green: '#d5ea50',
  redOrange: '#fd1417',
  purple: '#5614e8',
  rose: '#f55cf5'

} as const;

export const TESTIMONIALS = [] as const;

export const ABOUT = {
  label: '',
  title: 'Sobre nosotros',
  paragraphs: [
    'Desde la idea hasta la entrega, entendemos tu contexto y tomamos decisiones creativas alineadas a tus objetivos.',
    'Operamos como una extensión de tu equipo: nos adaptamos a tu entorno, optimizamos tiempos sin sacrificar calidad y nos integramos en la etapa del proyecto donde nos necesites.',
  ],
  clientsLabel: 'Trusted by',
} as const;

export const ABOUT_STAT = {
  title: '+100 Proyectos exitosos',
  subtitle: '0 retrasos',
} as const;

export const SERVICES_INTRO = {
  label: 'Servicios',
  title: 'Servicios',
  subtitle:
    'En 712 todos los servicios se construyen con estrategia, entendimiento del contexto de negocio, creatividad y ejecución audiovisual dentro de un mismo flujo de trabajo.',
  paragraph:
    'Cada disciplina se integra en un solo proceso: pensamos, producimos y entregamos como un equipo único, adaptándonos a lo que cada proyecto necesita.',
} as const;

export const SERVICE_CATEGORIES = [
  {
    id: 'produccion-audiovisual',
    title: 'Producción audiovisual',
    icon: 'lucide:clapperboard',
    subtypes: [
      { id: 'preproduccion', label: 'Preproducción', description: 'Concepto, guion, dirección de arte, planeación' },
      { id: 'produccion-video', label: 'Producción de video', description: 'Contenido digital, campañas, comerciales, on-site' },
      { id: 'fotografia', label: 'Fotografía', description: 'Producto, editorial, campañas, on-site' },
    ],
  },
  {
    id: 'proyectos-especiales',
    title: 'Proyectos especiales',
    icon: 'lucide:sparkles',
    subtypes: [
      { id: 'vr-ar', label: 'Proyectos de VR y AR' },
      { id: 'software-web', label: 'Desarrollo de software / web' },
    ],
  },
  {
    id: 'diseno-audiovisual',
    title: 'Diseño audiovisual',
    icon: 'lucide:palette',
    subtypes: [
      { id: 'edicion-postproduccion', label: 'Edición y postproducción de video' },
      { id: 'motion-graphics', label: 'Motion graphics' },
      { id: 'diseno-grafico', label: 'Diseño gráfico' },
      { id: 'animacion', label: 'Animación 2D y 3D' },
      { id: 'modelado-3d', label: 'Modelado 3D' },
      { id: 'compositing', label: 'Compositing' },
      { id: 'diseno-audiovisual', label: 'Diseño audiovisual' },
    ],
  },
] as const;

export const PROCESS_INTRO = {
  label: 'Proceso',
  title: 'Cómo trabajamos',
  subtitle: 'Dos formas de colaborar, según lo que cada marca necesita.',
} as const;

export const PROCESS_CARDS = [
  {
    id: 'partnerships',
    title: 'Partnerships (Igualas)',
    text: 'Colaboración continua para marcas con necesidades recurrentes. Volumen mensual definido y equipo asignado para dar continuidad, respuesta ágil y consistencia durante el periodo.',
    action: 'A partir de 3 meses',
  },
  {
    id: 'one-shots',
    title: 'One Shots (Proyectos individuales)',
    text: 'Proyectos con alcance definido. Cualquiera de nuestros servicios se puede contratar de forma puntual. Nos integramos en cualquier etapa del proceso o llevamos el proyecto completo de principio a fin.',
    action: 'Alcance puntual',
  },
] as const;

export const CONTACT = {
  label: 'Contacto',
  title: 'Contacto',
  subtitle: '¿No estás seguro de cuándo agendar tu llamada?',
  mailText: 'Envíanos un mail y te respondemos en menos de 24 horas.',
  email: 'hola@712.com',
  fields: {
    name: 'Nombre',
    email: 'Email',
    message: 'Detalles de tu proyecto',
  },
  submitText: 'Enviar mensaje',
  sendingText: 'Enviando…',
  successMessage: '¡Mensaje enviado! Te contactamos muy pronto.',
  errorMessage: 'Algo salió mal. Inténtalo de nuevo.',
  whatsapp: {
    phone: '5215512345678',
    message: 'Hola 712, quiero agendar una llamada.',
    label: 'Escríbenos por WhatsApp',
  },
} as const;

export const CLIENTS = [
  { id: 'google', name: 'Google', icon: 'logos:google' },
  { id: 'spotify', name: 'Spotify', icon: 'logos:spotify' },
  { id: 'netflix', name: 'Netflix', icon: 'logos:netflix' },
  { id: 'figma', name: 'Figma', icon: 'logos:figma' },
  { id: 'slack', name: 'Slack', icon: 'logos:slack-icon' },
  { id: 'airbnb', name: 'Airbnb', icon: 'logos:airbnb' },
  { id: 'stripe', name: 'Stripe', icon: 'logos:stripe' },
  { id: 'vercel', name: 'Vercel', icon: 'logos:vercel-icon' },
] as const;
