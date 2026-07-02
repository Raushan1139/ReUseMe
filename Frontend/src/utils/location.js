/**
 * Geolocation utility helper.
 * Uses browser GPS Geolocation with fallbacks to IP-based Geolocation APIs.
 */

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false, // Set to false to return triangulation/IP coordinates instantly
        timeout: 10000, // 10 seconds timeout
        maximumAge: 0
      }
    );
  });
}

const cleanCityName = (name) => {
  if (!name) return '';
  let clean = name.split(/-[Cc]um-/)[0];
  if (clean.includes('-') && clean.length > 15) {
    clean = clean.split('-')[0];
  }
  return clean.trim();
};

/**
 * Fallback IP-based Geolocation lookup
 * Queries ipapi.co or ip-api.com
 */
export async function getIpLocation() {
  try {
    // Try ipapi.co first
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('ipapi.co failed');
    const data = await res.json();
    return {
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      city: cleanCityName(data.city) || 'Patna',
      state: data.region || 'Bihar',
      pincode: data.postal || '800001',
      country: data.country_name || 'India'
    };
  } catch (err) {
    console.warn("ipapi.co geocode failed, trying ip-api.com fallback:", err);
    try {
      // Try ip-api.com second
      const res = await fetch('http://ip-api.com/json/');
      if (!res.ok) throw new Error('ip-api.com failed');
      const data = await res.json();
      return {
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon),
        city: cleanCityName(data.city) || 'Patna',
        state: data.regionName || 'Bihar',
        pincode: data.zip || '800001',
        country: data.country || 'India'
      };
    } catch (ipErr) {
      console.warn("All IP geolocation fallbacks failed:", ipErr);
      throw ipErr;
    }
  }
}