import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export class MapService {
  constructor() {
    this.map = null;
    this.marker = null;
    this.miniMaps = new Map();
    this.isInitialized = false;
    this.placesLayer = null;
    this.cleanupInterval = null;
    this.icons = {
      mosque: L.divIcon({
        html: '<i class="fas fa-mosque"></i>',
        className: 'map-icon mosque-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
      restaurant: L.divIcon({
        html: '<i class="fas fa-utensils"></i>',
        className: 'map-icon restaurant-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
      school: L.divIcon({
        html: '<i class="fas fa-school"></i>',
        className: 'map-icon school-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
      shop: L.divIcon({
        html: '<i class="fas fa-shopping-cart"></i>',
        className: 'map-icon shop-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      }),
    };
    this.baseMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.satelliteMapUrl =
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    this.cleanupInterval = setInterval(() => {
      this.cleanupMiniMaps();
    }, 300000);
  }

  async initializeMap(containerId) {
    if (this.isInitialized && this.map) {
      return;
    }

    this.cleanup();

    this.map = L.map(containerId, {
      zoomControl: true,
      attributionControl: true,
    });

    const streets = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
      }
    );

    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri',
      }
    );

    const baseMaps = {
      Streets: streets,
      Satellite: satellite,
    };

    streets.addTo(this.map);
    L.control.layers(baseMaps).addTo(this.map);
    L.control.scale().addTo(this.map);

    this.placesLayer = L.layerGroup().addTo(this.map);

    this.map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
    });

    this.isInitialized = true;

    try {
      const position = await this.getCurrentPosition();
      if (position && position.coords) {
        const { latitude, longitude } = position.coords;
      }
    } catch (error) {
      const defaultLat = -6.2088;
      const defaultLon = 106.8456;
      this.map.setView([defaultLat, defaultLon], 11);

      console.warn('Geolocation error:', error.message);
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  }

  getMarkerLocation() {
    return this.marker ? this.marker.getLatLng() : null;
  }

  createMiniMap(container, lat, lon) {
    const existingMap = this.miniMaps.get(container.id);
    if (existingMap) {
      existingMap.remove();
      this.miniMaps.delete(container.id);
    }

    const miniMap = L.map(container, {
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([lat, lon], 15);

    L.tileLayer(this.baseMapUrl, {
      attribution: '© OpenStreetMap contributors',
    }).addTo(miniMap);

    const marker = L.marker([lat, lon]).addTo(miniMap);

    marker.bindPopup(`
      <div class="location-popup">
        <h4>Story Location</h4>
        <div class="location-details">
          <p><strong>Latitude:</strong> ${lat.toFixed(6)}</p>
          <p><strong>Longitude:</strong> ${lon.toFixed(6)}</p>
          <p><strong>Location:</strong> ${container.dataset.locationName || 'Unknown location'}</p>
        </div>
      </div>
    `);

    this.miniMaps.set(container.id, miniMap);
    return miniMap;
  }

  cleanup() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.cleanupMiniMaps();
    this.isInitialized = false;
    this.placesLayer = null;
    this.marker = null;
  }

  cleanupMiniMaps() {
    this.miniMaps.forEach((miniMap, containerId) => {
      if (miniMap) {
        miniMap.remove();
      }
    });
    this.miniMaps.clear();
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cleanup();
  }

  getMapConfig() {
    return {
      defaultView: {
        center: [-0.789275, 113.921327],
        zoom: 5,
      },
      layers: {
        streets: {
          url: this.baseMapUrl,
          options: {
            attribution: '© OpenStreetMap contributors',
          },
        },
        satellite: {
          url: this.satelliteMapUrl,
          options: {
            attribution: '© Esri',
          },
        },
      },
      controls: {
        layers: {
          position: 'topright',
        },
      },
    };
  }

  createPopupContent(locationInfo) {
    return `
      <div class="location-popup">
        <h4>Location Details</h4>
        <p>${locationInfo.display_name}</p>
      </div>
    `;
  }
}
