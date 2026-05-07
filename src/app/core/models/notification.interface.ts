export interface NotificationResponse {
  current_page: number;
  data: Notification[];
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

export interface Notification {
  id: number;
  receiver_id: number;
  sender_id: number;
  type: string;
  summary: string;
  content: string;
  created_at: string;
  updated_at: string;
  sender: Sender;
  receiver: Sender;
}

interface Sender {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  type: string;
  avatar: null;
  firebase_token: string;
  created_at: string;
  updated_at: string;
  has_active_session: boolean;
}
