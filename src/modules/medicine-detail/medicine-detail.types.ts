export interface DrugDetail {
  id: string;
  name: string;
  activeSubstance: string | null;
  dosageForm: string | null;
  strength: string | null;
  manufacturer: string | null;
  description: string | null;
  imageUrl: string | null;
  categoryName: string | null;
}

export type ProximityTier =
  | "same_city"
  | "same_governorate"
  | "same_country"
  | "other";

export interface PharmacyOffer {
  pharmacyId: string;
  name: string;
  price: number | null;
  quantity: number | null;
  rating: number | null;
  /** Number of ratings submitted for this pharmacy — used as a stand-in
   *  "activity" signal until real visit tracking exists. */
  ratingCount: number;
  address: string | null;
  cityName: string | null;
  governorateName: string | null;
  countryName: string | null;
  proximityTier: ProximityTier;
}

export interface DrugDetailResult {
  drug: DrugDetail;
  pharmacies: PharmacyOffer[];
}

export interface UserLocation {
  cityId: bigint | null;
  governorateId: bigint | null;
  countryId: bigint | null;
}
