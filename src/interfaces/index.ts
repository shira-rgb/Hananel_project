export interface AestheticMedia {
  id: string;
  file_url: string;
  file_name: string;
  file_type: "image" | "video";
  mime_type: string;
  file_size_bytes?: number;
  description?: string;
  usage_type?: "product_explanation" | "client_example" | "other";
  product_id?: string;
  aesthetic_products?: { name: string; treatment_type?: string };
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
  side_effects?: string;
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
  treatment_types?: string[];
  message_text: string;
  delay_value: number;
  delay_unit: "hours" | "days" | "weeks";
  timing_type: "after" | "before";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  aesthetic_products?: { name: string };
}

export interface AestheticClient {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  normalized_phone?: string;
  phone?: string;
  email?: string;
  notes?: string;
  is_bot_active?: boolean;
  has_sent_photo?: boolean;
  photo_url?: string;
  last_treatment_date?: string;
  last_treatment_type?: string;
  source?: string;
  arrival_source?: string;
  concern?: string;
  interested_treatment?: string;
  number_of_visits?: number;
  client_status?: string;
  external_status?: string;
  city?: string;
  birthdate?: string;
  gender?: string;
  registration_date?: string;
  followup_after_last_treatment?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AestheticLead {
  id: string;
  first_name?: string;
  last_name?: string;
  normalized_phone?: string;
  email?: string;
  is_bot_active?: boolean;
  status?: string;
  lead_status_he?: string;
  source?: string;
  arrival_source?: string;
  concern?: string;
  interested_treatment?: string;
  has_sent_photo?: boolean;
  photo_url?: string;
  notes?: string;
  tags?: string;
  engagement_score?: number;
  lead_value?: number;
  pipeline?: string;
  stage?: string;
  assigned?: string;
  campaign?: string;
  ad_name?: string;
  crm_status?: string;
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
  product_id?: string;
  dental_products?: { name: string; treatment_type?: string };
  created_at: string;
}

export interface DentalProduct {
  id: string;
  name: string;
  treatment_type?: string;
  doctors?: string;
  how_it_works?: string;
  indications?: string;
  suitable_ages?: string;
  contraindications?: string;
  num_visits?: string;
  treatment_duration?: string;
  results_timeline?: string;
  effect_duration?: string;
  requires_anesthesia?: string;
  recovery_time?: string;
  post_treatment_instructions?: string;
  when_to_contact_clinic?: string;
  side_effects?: string;
  important_info?: string;
  faq?: string;
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
  treatment_types?: string[];
  message_text: string;
  delay_value: number;
  delay_unit: "hours" | "days" | "weeks";
  timing_type: "after" | "before";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  dental_products?: { name: string };
}

export type InquiryStatus = "inquired" | "scheduled" | "callback_requested";

export interface AestheticInquiry {
  id: string;
  inquiry_date: string;
  full_name?: string;
  phone?: string;
  source?: string;
  status: InquiryStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DentalInquiry {
  id: string;
  inquiry_date: string;
  full_name?: string;
  phone?: string;
  source?: string;
  status: InquiryStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DentalClient {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  normalized_phone?: string;
  phone?: string;
  email?: string;
  notes?: string;
  is_bot_active?: boolean;
  has_sent_photo?: boolean;
  photo_url?: string;
  last_treatment_date?: string;
  last_treatment_type?: string;
  source?: string;
  arrival_source?: string;
  concern?: string;
  interested_treatment?: string;
  number_of_visits?: number;
  client_status?: string;
  external_status?: string;
  city?: string;
  birthdate?: string;
  gender?: string;
  registration_date?: string;
  followup_after_last_treatment?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DentalLead {
  id: string;
  first_name?: string;
  last_name?: string;
  normalized_phone?: string;
  email?: string;
  is_bot_active?: boolean;
  status?: string;
  lead_status_he?: string;
  source?: string;
  arrival_source?: string;
  concern?: string;
  interested_treatment?: string;
  has_sent_photo?: boolean;
  photo_url?: string;
  notes?: string;
  tags?: string;
  engagement_score?: number;
  lead_value?: number;
  pipeline?: string;
  stage?: string;
  assigned?: string;
  campaign?: string;
  ad_name?: string;
  crm_status?: string;
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
  business_name?: string;
  about?: string;
  working_hours?: string;
  address?: string;
  waze_link?: string;
  booking_link?: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DentalBusinessInfo {
  id: string;
  business_name?: string;
  about?: string;
  working_hours?: string;
  address?: string;
  waze_link?: string;
  booking_link?: string;
  phone?: string;
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
  business_association?: string;
  consultation_description?: string;
  consultation_schedule?: string;
  consultation_cost?: string;
  consultation_notes?: string;
  created_at: string;
  updated_at: string;
}
