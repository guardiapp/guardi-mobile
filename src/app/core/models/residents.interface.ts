export interface ResidentsResponse {
  current_page: number;
  data: Apartment[];
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

interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface Apartment {
  id: number;
  user_id: number;
  building_id: number;
  identifier: string;
  active: number;
  created_at: string;
  updated_at: string;
  building: Building;
  resident: Resident;
}

export interface Resident {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  type: string;
  avatar: null;
  firebase_token: null | string;
  created_at: string;
  updated_at: string;
  has_active_session: boolean;
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
}
