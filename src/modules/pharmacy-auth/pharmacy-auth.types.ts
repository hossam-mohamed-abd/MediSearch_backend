export interface PharmacyLoginDto {
    email: string;
    password: string;
  }
  
  export interface PharmacyJwtPayload {
    userId: bigint;
    pharmacyId: bigint;
    role: string;
  }
  
  export interface PharmacyProfile {
    id: bigint;
    name: string | null;
    email: string | null;
    phone: string | null;
    logo_url: string | null;
    address: string | null;
    city_name: string | null;
    created_at: Date | null;
  }