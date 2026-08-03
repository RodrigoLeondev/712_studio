export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface Client {
  id: string;
  name: string;
  icon: string;
}

export interface AboutContentProps {
  label?: string;
  title?: string;
  paragraphs?: readonly string[];
  clientsLabel?: string;
  clients?: readonly Client[];
}

export interface ClientsCarouselProps {
  label?: string;
  clients: readonly Client[];
}

export interface ServiceSubtype {
  id: string;
  label: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  subtypes: readonly ServiceSubtype[];
}

export interface ServicesVisualProps {
  categories: readonly ServiceCategory[];
}

export interface SubtypesListProps {
  category: ServiceCategory | null;
}

export interface ProcessCard {
  id: string;
  title: string;
  text: string;
  action: string;
}

export interface StatCard {
  title: string;
  subtitle: string;
}

export interface ProcessTiltedGridProps {
  cards: readonly ProcessCard[];
}
