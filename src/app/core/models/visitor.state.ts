export interface VisitorState {
  visitors: Visitor[];
  loading: boolean;
  error?: any;
  is_searching: boolean;
  search_results: Visitor[];
  is_search_mode: boolean;
}

export interface VisitorResponse {
  current_page: number;
  data: Visitor[];
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

export interface Visitor {
  id: number;
  apartment_id: number;
  document: string;
  first_name: string;
  last_name: string;
  active: number;
  created_at: string;
  updated_at: string;
  apartment: Apartment;
  fullname?: string;
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
