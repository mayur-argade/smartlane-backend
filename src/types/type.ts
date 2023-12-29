export class UserRes {
  success: boolean;
  status: number;
  msg: string;
  data?: UserRegister;
  info?: UserEdit;
  tokenInfo?: string;
}
export class ChangePassword {
  email: string;
  old_password: string;
  new_password: string;
}

export enum UserType {
  ADMIN = "admin",
  LANDLORD = "landlord",
  TENANT = "tenant",
}

export enum OwnershipType {
  PERSONAL = "personal",
  LTD_COMPANY = "ltd_company"
}
export class UserRegister {
  id: bigint;
  full_name: string;
  email: string;
  password?: string;
  user_type?: UserType;
  status?: string;
}
export class UserEdit {
  id?: bigint;
  full_name?: string;
  email?: string;
  password?: string;
  user_type?: UserType;
  status?: string;
}
export class Login {
  email: string;
  password: string;
  user_type: string;
  id?: number;
}
export class Otp {
  email: string;
  code: string;
  status: string;
}
export class VerificationDetail {
  user_id: bigint;
  code: string;
  OtpExpirationDate: string;
}
export class ResetPassword {
  email: string;
  code: string;
  new_password: string;
}
export class Properties {
  property_name?: string;
  address?: string;
  id?: bigint;
  user_id?: bigint;
  property_estimate?: bigint;
  property_margin?: number;
  date_now?: string;
  previous_estimate?: number;
  previous_margin?: number;
}
export class Document {
  user_id?: bigint;
  property_id?: bigint;
  mortgage_statement?: string;
  tenancy_aggrement?: string;
  buildings_certificate?: string;
  electrical_report_eicr?: string;
  portable_appliance_testing?: string;
  energy_performance_epc?: string;
  term_of_business?: string;
  monthly_statements?: string[];
  mortgage_statement_expiry_date?: string
  tenancy_aggrement_expiry_date?: string
  electrical_report_eicr_expiry_date?: string
  landlord_insurance_expiry_date?: string
  portable_appliance_testing_expiry_date?: string
  energy_performance_epc_expiry_date?: string
  term_of_business_expiry_date?: string

}
export class Roi {
  gross_monthly_income?: number;
  mortgage_payment?: number;
  management_fee?: number;
  ground_rent?: number;
  service_charge?: number;
  property_id?: bigint;
  property_estimate?: bigint;
  user_id?: bigint;
  previous_monthly_net_income?: number;
  monthly_net_income?: number;
  
}
export class Mortgage {
  debt?: number;
  type?: string;
  interest_rate?: string;
  provider?: string;
  expiry?: string;
  property_id?: bigint;
  user_id?: bigint;
}
export class Ownership {
  type?: OwnershipType;
  company_number?: string;
  property_id?: bigint;
  user_id?: bigint;
  property_type?: string;
  construction_date?: string;
  no_of_bedroom?: string;
  no_of_bathroom?: string;
  finish_quality?: string;
  outdoor_space?: string;
  off_street_parking?: string;
  internal_area?: number;
  post_code?: string;
}
export class Insurance {
  type?: string;
  provider?: string;
  expiry?: Date;
  property_id?: bigint;
  user_id?: bigint;
}
export class Letting {
  current_tenent: string[];
  tenant_expiry: string
  property_id?: bigint;
  user_id?: bigint;
  beneficiary_id?: number;
  payprop_property_id?: number;
}
export class AddProperty {
  roi?: Roi;
  property: Properties;
  document?: Document;
  mortgage?: Mortgage;
  ownership?: Ownership;
  insurance?: Insurance;
  letting?: Letting;
  property_id?: bigint;
}
export class PropertyRes {
  success: boolean;
  status: number;
  msg: string;
  data?: {
    roi?: Roi;
    property: Properties;
    mortgage?: Mortgage;
    ownership?: Ownership;
    insurance?: Insurance;
    letting?: Letting;
    document?: Document;
    files?: FileName;
  };
}
export class PostCode {
  postcode: string
}
export class PostCodeData {
  postcode: string;
  postcode_inward: string;
  postcode_outward: string;
  post_town: string;
  dependant_locality: string;
  double_dependant_locality: string;
  thoroughfare: string;
  dependant_thoroughfare: string;
  building_number: string;
  building_name: string;
  sub_building_name: string;
  po_box: string;
  department_name: string;
  organisation_name: string;
  udprn: number;
  postcode_type: string;
  su_organisation_indicator: string;
  delivery_point_suffix: string;
  line_1: string;
  line_2: string;
  line_3: string;
  premise: string;
  longitude: number;
  latitude: number;
  eastings: number;
  northings: number;
  country: string;
  traditional_county: string;
  administrative_county: string;
  postal_county: string;
  county: string;
  district: string
  ward: string;
  uprn: string;
  id: string;
  country_iso: string;
  country_iso_2: string;
  county_code: string;
  language: string;
  umprn: string;
  dataset: string;
}
export class PostCodeRes {
  success: boolean;
  status: number;
  msg: string;
  data?: PostCodeData;
}
export class PostCodeConfig {
  method: string;
  maxBodyLength: number;
  url: string;
  headers: {
    Accept: string;
  };
}

export class GetPropertyList {
  userName: string;
  users_userType: string;
  property_name: string;
  address: string;
  property_id: number;
  net_equity: number;
  gross_monthly_income: number;
  mortgage_payment: number;
  management_fee: number;
  ground_rent: number;
  service_charge: number;
  debt: number;
  mortgage_type: string;
  interest_rate: string;
  mortgage_provider: string;
  mortgage_expiry: string;
  company_number: string;
  ownership_type: string;
  property_type: string;
  construction_date: string;
  no_of_bedroom: string;
  no_of_bathroom: string;
  finish_quality: string;
  outdoor_space: string;
  off_street_parking: string;
  internal_area: number;
  insurance_provider: string;
  insurance_type: string;
  insurance_expiry: string;
  current_tenent: string;
  tenant_expiry: string;
  beneficiary_id: number;
  payprop_property_id: number;
}
export class PropertyListRes {
  success: boolean;
  status: number;
  msg: string;
  info?: Document;
  data?: Result;
  datas?: any
}
export class Result {
  property: GetPropertyList;

}
export class PropertyDetail {
  id: number;
}
export class EditProperty {
  id: bigint;
  user_id: bigint;
  property_id: bigint;
  roi?: Roi;
  property?: Properties;
  document?: Document;
  mortgage?: Mortgage;
  ownership?: Ownership;
  insurance?: Insurance;
  letting?: Letting;
}

export class EditPropertys {
  success: boolean;
  status: number;
  msg: string;
  data?: {
    roi?: Roi;
    property?: Properties;
    mortgage?: Mortgage;
    ownership?: Ownership;
    insurance?: Insurance;
    letting?: Letting;
    document?: Document;
  };
}

export enum NotificationStatus {
  SEEN = "1",
  UNSEEN = "0",
}

export class NotificationType {
  id?: bigint;
  property_id?: bigint;
  user_id?: bigint;
  title: string;
  message: string;
  cleared: boolean;
  seen: NotificationStatus;
  insurance?: Insurance;
  letting?: Letting;
}
export class NotificationPropertys {
  success: boolean;
  status: number;
  msg: string;
  data?: {
    notification?: NotificationType;
    notifications?: NotificationType;
    insurance?: Insurance;
    letting?: Letting;
  };
}

export class FileName {
  filename?: string;
  property_id?: bigint;
  mortgage_statement: string;
  tenancy_aggrement: string;
  landlord_insurance?: string;
  electrical_report_eicr?: string;
  portable_appliance_testing?: string;
  energy_performance_epc?: string;
  term_of_business?: string;
  monthly_statements?: string[];
}
export class ValuationData {
  postcode: string;
  property_type: string;
  construction_date: string;
  internal_area: string;
  bedrooms: string;
  bathrooms: string;
  finish_quality: string;
  outdoor_space: string;
  off_street_parking: string;
}

export class SocialLogin {
  social_loginId?: string;
  user_type?: string;
  full_name?: string;
  status?: string;
  email?: string;
}
