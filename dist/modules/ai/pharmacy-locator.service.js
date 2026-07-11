"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PharmacyLocatorService = void 0;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY ?? "";
class PharmacyLocatorService {
    /**
     * Finds the nearest real pharmacies around a human-readable area
     * (e.g. "Alexandria, Alexandria Governorate, Egypt") using:
     * 1. Geocoding API — turns the area name into lat/lng.
     * 2. Nearby Search (rankby=distance) — returns pharmacies sorted by actual distance.
     */
    async findNearby(areaQuery, limit = 3) {
        if (!GOOGLE_MAPS_API_KEY) {
            throw new Error("GOOGLE_MAPS_API_KEY is not configured.");
        }
        const center = await this.geocodeArea(areaQuery);
        if (!center)
            return [];
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
            `?location=${center.lat},${center.lng}` +
            `&rankby=distance` +
            `&type=pharmacy` +
            `&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== "OK" || !Array.isArray(data.results)) {
            return [];
        }
        return data.results
            .slice(0, limit)
            .map((place) => this.toPharmacyLocation(place));
    }
    async geocodeArea(areaQuery) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json` +
            `?address=${encodeURIComponent(areaQuery)}` +
            `&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const loc = data?.results?.[0]?.geometry?.location;
        if (!loc)
            return null;
        return { lat: loc.lat, lng: loc.lng };
    }
    toPharmacyLocation(place) {
        const lat = place.geometry?.location?.lat;
        const lng = place.geometry?.location?.lng;
        const placeId = place.place_id ?? null;
        const mapsUrl = placeId
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name ?? "pharmacy")}&query_place_id=${placeId}`
            : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap` +
            `?center=${lat},${lng}` +
            `&zoom=16&size=400x200&scale=2` +
            `&markers=color:0xEF4444%7C${lat},${lng}` +
            `&key=${GOOGLE_MAPS_API_KEY}`;
        return {
            name: place.name ?? "صيدلية",
            address: place.vicinity ?? place.formatted_address ?? null,
            latitude: lat,
            longitude: lng,
            placeId,
            mapsUrl,
            staticMapUrl,
        };
    }
}
exports.PharmacyLocatorService = PharmacyLocatorService;
