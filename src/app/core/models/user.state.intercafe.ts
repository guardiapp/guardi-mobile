export interface UserState {
  user: UserData | null;
  loading: boolean;
  error?: any;
}

export interface UserData {
  id: number;
  document_type: Documenttype;
  badge: Badge;
  badge_type: Badgetype | null;
  user: User;
  division: Division | null;
  custom_field_values: any[];
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  legal_id: string;
  phone: string;
  email: string;
  employee_code: string;
  has_vaccine: number;
  display_cards: boolean;
  qr_code: null | string;
}

interface Division {
  id: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  legal_id: string;
  name: string;
  phone: string;
  email: string;
  contact_name: string;
  document_type: number;
  departament: number;
  badges: number[];
}

export interface User {
  id: number;
  last_login: null | string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  extension: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  updated_at: string;
  role: null | number;
  building: number;
  groups: any[];
  user_permissions: any[];
}

interface Badgetype {
  id: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  name: string;
  badge_type_id: string;
  is_visitor: boolean;
  company: number;
}

interface Badge {
  id: number;
  company: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  badge_id: string;
  last_name: string;
  first_name: string;
  issue_date: string;
  expire_date: string;
  photo: null;
  allow_entry: boolean;
  has_vaccine: number;
  badge_type: number;
  division: null;
  access_cards: any[];
}

interface Documenttype {
  id: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  name: string;
  is_foreign_document: boolean;
}
