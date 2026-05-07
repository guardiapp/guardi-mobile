export interface ServiceResponse {
  current_page: number;
  data: Service[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

export interface Service {
  id: number;
  description: string;
  created_at: string;
  updated_at: string | null;
}
