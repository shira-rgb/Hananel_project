export interface AestheticMedia {
  id: string;
  file_url: string;
  file_name: string;
  file_type: "image" | "video";
  mime_type: string;
  file_size_bytes?: number;
  description?: string;
  usage_type?: "product_explanation" | "client_example" | "other";
  created_at: string;
}

export interface AestheticProduct {
  id: string;
  name: string;
  treatment_type?: string;
  description?: string;
  price: number;
  show_in_pricelist: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AestheticFollowupMessage {
  id: string;
  product_id?: string;
  message_text: string;
  delay_value: number;
  delay_unit: "hours" | "days" | "weeks";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  aesthetic_products?: { name: string };
}

export interface AestheticClient {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DentalMedia {
  id: string;
  file_url: string;
  file_name: string;
  file_type: "image" | "video";
  mime_type: string;
  file_size_bytes?: number;
  description?: string;
  usage_type?: "product_explanation" | "client_example" | "other";
  created_at: string;
}

export interface DentalProduct {
  id: string;
  name: string;
  treatment_type?: string;
  description?: string;
  price: number;
  show_in_pricelist: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DentalFollowupMessage {
  id: string;
  product_id?: string;
  message_text: string;
  delay_value: number;
  delay_unit: "hours" | "days" | "weeks";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  dental_products?: { name: string };
}

export interface DentalClient {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DentalDoctorProfile {
  id: string;
  section_title: string;
  content: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
