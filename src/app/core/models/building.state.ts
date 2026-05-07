export interface Building {
  id: number;
  external_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  delete_at: null;
  name: string;
  address: string;
  phone: string;
  occupation_percentage: number;
  people_capacity: number;
  people_occupation: number;
  visitor_capacity: number;
  company: number;
  country: number;
  badges: number[];
}

export interface BuildingState {
  buildings: Building[];
  buildingIdSelected: number | null;
  loading: boolean;
  currentBuilding?: Building | null;
  error?: any;
}
