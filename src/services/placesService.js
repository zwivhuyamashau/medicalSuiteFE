class PlacesService {
    constructor() {
      this.placesService = null;
      this.map = null;
    }
  
    async initialize() {
      // Wait for Google Maps to be available
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        throw new Error('Google Maps JavaScript API must be loaded before using this service');
      }
  
      // Create a hidden map element if it doesn't exist
      if (!this.map) {
        // Check if the hidden map container already exists
        let mapDiv = document.getElementById('hidden-map');
        if (!mapDiv) {
          mapDiv = document.createElement('div');
          mapDiv.id = 'hidden-map';
          mapDiv.style.display = 'none';
          document.body.appendChild(mapDiv);
        }
  
        // Initialize the map
        this.map = new window.google.maps.Map(mapDiv, {
          center: { lat: 0, lng: 0 },
          zoom: 1
        });
      }
  
      // Initialize the PlacesService
      if (!this.placesService) {
        this.placesService = new window.google.maps.places.PlacesService(this.map);
      }
    }
  
    async ensureInitialized() {
      if (!this.placesService) {
        await this.initialize();
      }
      return this.placesService;
    }
  
    async searchNearby(location, radius, keyword) {
      try {
        await this.ensureInitialized();
  
        return new Promise((resolve, reject) => {
          const request = {
            location: new window.google.maps.LatLng(location.lat, location.lng),
            radius: radius,
            type: 'health',
            keyword: keyword,
            rankBy: window.google.maps.places.RankBy.DISTANCE // Changed to DISTANCE for better results
          };
  
          this.placesService.nearbySearch(request, (results, status, pagination) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve({
                results,
                hasNextPage: pagination && pagination.hasNextPage,
                getNextPage: () => {
                  return new Promise((resolveNext) => {
                    pagination.nextPage();
                    resolveNext();
                  });
                }
              });
            } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve({ results: [], hasNextPage: false });
            } else {
              reject(new Error(`Places API error: ${status}`));
            }
          });
        });
      } catch (error) {
        console.error('Error in searchNearby:', error);
        throw error;
      }
    }
  
    async getPlaceDetails(placeId) {
      try {
        await this.ensureInitialized();
  
        return new Promise((resolve, reject) => {
          const request = {
            placeId: placeId,
            fields: [
              'name',
              'formatted_address',
              'formatted_phone_number',
              'rating',
              'user_ratings_total',
              'opening_hours',
              'photos',
              'website',
              'types',
              'reviews',
              'geometry'
            ]
          };
  
          this.placesService.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(place);
            } else {
              reject(new Error(`Place Details API error: ${status}`));
            }
          });
        });
      } catch (error) {
        console.error('Error in getPlaceDetails:', error);
        throw error;
      }
    }
  
    getPhotoUrl(photo, maxWidth = 400) {
      if (!photo || !photo.getUrl) return null;
      try {
        return photo.getUrl({ maxWidth });
      } catch (error) {
        console.error('Error getting photo URL:', error);
        return null;
      }
    }
  }
  
  export default new PlacesService();
  