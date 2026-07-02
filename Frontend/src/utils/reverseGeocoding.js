/**
 * Geocoding and Reverse Geocoding utilities using OpenStreetMap Nominatim API.
 */

// Comply with Nominatim usage policy by providing a descriptive User-Agent
const NOMINATIM_HEADERS = {
  'Accept': 'application/json',
  'User-Agent': 'ReUseMe-Marketplace-CollegeProject-rathoreraushan1139'
};

const cleanCityName = (name) => {
  if (!name) return '';
  let clean = name.split(/-[Cc]um-/)[0];
  if (clean.includes('-') && clean.length > 15) {
    clean = clean.split('-')[0];
  }
  return clean.trim();
};

/**
 * Reverse geocodes coordinates to a human-readable address.
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{city: string, state: string, pincode: string, country: string}>}
 */
export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
      headers: NOMINATIM_HEADERS
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    
    const data = await res.json();
    const address = data.address || {};
    
    // Extrapolate best representation for city
    let city = address.city || address.town || address.village || address.suburb || address.county || 'Patna';
    city = cleanCityName(city);
    const state = address.state || 'Bihar';
    const pincode = address.postcode || '';
    const country = address.country || 'India';
    
    return { city, state, pincode, country };
  } catch (err) {
    console.warn("Reverse geocoding failed, falling back:", err);
    return { city: 'Patna', state: 'Bihar', pincode: '800001', country: 'India' };
  }
}

/**
 * Searches coordinates for a given address query string.
 * @param {string} query - The search query (e.g. city name, region)
 * @returns {Promise<Array<{display_name: string, latitude: number, longitude: number, city: string, state: string}>>}
 */
export async function forwardGeocode(query) {
  if (!query || query.trim().length < 3) return [];
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5`, {
      headers: NOMINATIM_HEADERS
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    
    const data = await res.json();
    return data.map(item => {
      const addr = item.address || {};
      return {
        display_name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        city: addr.city || addr.town || addr.village || addr.suburb || addr.county || item.display_name.split(',')[0],
        state: addr.state || ''
      };
    });
  } catch (err) {
    console.warn("Forward geocoding failed:", err);
    return [];
  }
}
