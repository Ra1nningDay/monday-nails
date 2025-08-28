export interface Service {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  features: string[];
  image: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface ContactInfo {
  phone: string;
  line: string;
  address: string;
  hours: string;
}
