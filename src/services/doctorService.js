import { APIGATEWAY_BASE } from '../config';

class DoctorService {
  async searchNearbyDoctors(location, type = 'doctor', radius = 5000, user=null) {
    try {
      const response = await fetch(`${APIGATEWAY_BASE}places/search?email=${encodeURIComponent(user?.email || '')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "action": "nearbySearch",
          "params": {
            "location": {
              lat: location.lat,
              lng: location.lng
            },
          "type" : type,
          "radius" : radius
        }
      })
      });



      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search for doctors');
      }

      const data = await response.json();

      return {
        results: data.places.map(result => ({
          place_id: result.place_id,
          name: result.displayName.text,
          vicinity: result.vicinity,
          geometry: {
            location: {
              lat: () => result.location.latitude,
              lng: () => result.location.longitude
            }
          },
          rating: result.rating,
          reviews:result.reviews,
          googleMapsUri : result.googleMapsUri,
          website : result.websiteUri,
          user_ratings_total: result.userRatingCount,
          opening_hours: {
            open_now: result.regularOpeningHours?.open_now
          }
        }))
      };
    } catch (error) {
      console.error('Error in searchNearby:', error);
      throw error;
    }
  }


  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1);
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
}

export default new DoctorService();
