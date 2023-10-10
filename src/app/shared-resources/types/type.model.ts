export interface Mclservices {
  id: number;
  name: string;
  tag: string;
  detailed_name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at?: any;
  updated_by?: any;
  deleted_yn: string;
  deleted_by?: any;
  clinician_count: number;
  nurse_count: number;
}

export interface Nurse {
  id: number;
  name: string;
  username: string;
  email: string;
  sex: string;
  Verified_status: number;
  mobile: string;
  address: string;
  qualification: string;
  speciality: string;
  dr_type: string;
  about: string;
  slot_type: number;
  serial_or_slot: string;
  start_time: string;
  end_time: string;
  serial_day: number;
  max_serial: number;
  duration: number;
  fees: number;
  department_id: number;
  location_id: number;
  featured: number;
  status: number;
}

export interface Clinician {
  id: number;
  name: string;
  username: string;
  email: string;
  sex: string;
  Verified_status: number;
  mobile: string;
  address: string;
  qualification: string;
  speciality: string;
  dr_type: string;
  about: string;
  slot_type: number;
  serial_or_slot: string;
  start_time: string;
  end_time: string;
  serial_day: number;
  max_serial: number;
  duration: number;
  fees: number;
  department_id: number;
  location_id: number;
  featured: number;
  status: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  reg_code: string;
  latitude: string;
  longitude: string;
  mobile: string;
  address: string;
  location_id: number;
  status: number;
}

export interface UserToken {
  token: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetCodePayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  reg_code: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    latitude: string;
    longitude: string;
    email: string;
    name: string;
    mobile: string;
    address: string;
    location_id: number;
    status: number;
  };
}

export interface SignupPayload {
  email: string;
}

export interface BasicOnboardPayload {
  nationalId: number;
  dob: Date;
  gender: string;
  speciality_id: string;
  dr_type: string;
  name: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  location_id: number;
}

export interface AcademicOnboardPayload {
  email: string;
  academic_org_issue: string;
  academic_year_award: string;
  lincesing_org: string;
  level: string;
  linces_no: string;
  lincesing_year_award: string;
}

export interface ExperienceOnboardPayload {
  email: string;
  proffesional_org_name: string;
  period_from: string;
  period_to: string;
  professional_position: string;
  professional_role: string;
  accept_terms: boolean;
}

export interface Locations {
  id: number;
  name: string;
}

export interface Speciality {
  id: number;
  name: string;
}

export interface Appointment {
  service_id: number;
  service_name: string;
  doctor_id: number;
  doctor_name: string;
  site: string;
  physical_virtual: string;
  location: {
    lat: number;
    long: number;
  };
  mobile: string;
  appointment_for: string;
  chronic_yn: string;
  age: number;
  disease: string;
  booking_date: Date;
  time_serial: string;
  payment_status: string;
  trx_code: string;
  is_complete: boolean;
}

export interface BookedAppointments {
  appointment_id: number;
  service_id: number;
  service_name: string;
  doctor_id: number;
  doctor_name: string;
  appointment_for: string;
  disease: string;
  booking_date: Date;
  time_serial: string;
  payment_status: string;
  is_complete: boolean;
}

export interface MyAppointmentDetails {
  id: number;
  age: number;
  user_id: number;
  patient: string;
  doctor: string;
  service_id: number;
  service: string;
  distance: number;
  amount: number;
  contact: string;
  is_complete: number;
  createdDate: string;
  bookTime: Date;
  latitude: number;
  longitude: number;
  place: string;
  hasChronic: string;
  description: string;
  PaymentStatus: string;
  transactionCode?: any;
}
export interface VericationCodePayload {
  reg_code: string;
  email: string;
}

export interface VideoRoom {
  room_name: string;
}
export interface SuggestionMessage {
  patient_id: number;
  user_id: number;
  message: string;
}

export interface AvailabilityPayload {
  token: string;
  status: boolean;
  lat: number;
  lng: number;
}

export interface CheckAvailabilityPayload {
  token: string;
}
export interface CheckAvailabilityResponse {
  status: boolean;
}

export interface Prescription {
  token: string;
  appointment_id: number;
  patient: string;
  patient_id: number;
  doctor: string;
  doctor_notes: string;
  patient_description: string;
  service: string;
  service_id: number;
  suggestion: string[];
}

export interface InitiateAppointmentPayload {
  token: string;
  id: number;
  appointment_status: string;
  // rate: number;
  // appointment_status: string;
}

export interface closeAppointmentPayload {
  token: string;
  id: number;
}

export interface withdrawaPayload {
  token: string;
  withdrawalStatus: string;
  withdrawalAmount: number;
  phoneNumber: string;
  balance: number;
  amountToRecieve: number;
  transactionCost: number;
  passibleArrivalTime: string;
}

export interface MyPastWithdrawal {
  id: number;
  doctor_id: number;
  w_amount: number;
  w_phone: string;
  w_balance: number;
  amt_to_recieve: number;
  w_status: string;
  w_cost: number;
  w_possible_Atime: string;
  created_at: Date;
  updated_at: Date;
  updated_by: number;
}
