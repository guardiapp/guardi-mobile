import { Visitor } from './visitor.state';

export interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
  loadingMore: boolean; // Nueva propiedad para indicar si se están cargando más reservas
  current_page: number;
  next_page_url: string | null;
  error?: any;
  // Nuevas propiedades para búsqueda
  is_searching: boolean;
  search_results: Reservation[];
  is_search_mode: boolean;
}

export interface ReservationResponse {
  current_page: number;
  data: Reservation[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface Reservation {
  id: number;
  apartment_id: number;
  visitor_id: number;
  with_stay: number;
  qr_uses: number;
  remarks: null | string;
  visit_date: string;
  expiration_date: string | null;
  cancelled: number;
  visited: number;
  entry_time: string;
  created_at: string;
  updated_at: string;
  visitor: Visitor;
  apartment: Apartment;
  car_plate: string;
  has_companions: boolean;
  has_vehicle: boolean;
  companions: string | any;
  qr: Qr;
  // Nuevos campos para servicios
  service_id?: number;
  type?: 'PERSONAL' | 'SERVICE';
  service?: Service;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Qr {
  id: number;
  qr: string;
  qr_uses: number;
  state: string;
  created_at: string;
  updated_at: string;
  scanned: Scanned[];
}

export interface Scanned {
  id: number;
  qr_id: number;
  type: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Apartment {
  id: number;
  user_id: number;
  building_id: number;
  identifier: string;
  active: number;
  created_at: string;
  updated_at: string;
  resident: Resident;
  building: Building;
}

export interface Building {
  id: number;
  residence_id: number;
  name: string;
  floors_number: number;
  apartments_per_floor: number;
  active: number;
  information: null;
  created_at: string;
  updated_at: string;
  residence: Residence;
}

export interface Residence {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
  manager: Manager[];
}

export interface Companion {
  name: string;
  id: number;
}

export interface Manager {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  type: string;
  avatar: null;
  refresh_token: null;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Pivot {
  residence_id: number;
  manager_id: number;
}

export interface Resident {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  type: string;
  avatar: null;
  refresh_token: string;
  created_at: string;
  updated_at: string;
  profile: Profile;
}

export interface Profile {
  id: number;
  user_id: number;
  document: string;
  first_name: string;
  last_name: string;
  phone: string;
  birthday: null;
  created_at: string;
  updated_at: string;
}
