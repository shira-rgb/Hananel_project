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
  body_area?: string;
  product_description?: string;
  how_it_works?: string;
  indications?: string;
  treatment_duration?: string;
  results_timeline?: string;
  effect_duration?: string;
  recovery_time?: string;
  post_treatment_instructions?: string;
  suitable_ages?: string;
  when_to_contact_clinic?: string;
  common_myths?: string;
  faq?: string;
  contraindications?: string;
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

export interface AestheticFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DentalFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AestheticBusinessInfo {
  id: string;
  section_title: string;
  content: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DentalBusinessInfo {
  id: string;
  section_title: string;
  content: string;
  display_order: number;
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

export interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  gender?: string;
  experience?: string;
  education?: string;
  languages?: string;
  accepting_new_patients?: boolean;
  working_hours?: string;
  additional_info?: string;
  consultation_description?: string;
  consultation_schedule?: string;
  consultation_cost?: string;
  consultation_notes?: string;
  created_at: string;
  updated_at: string;
}
