/**
 * Geolocation utility for handling location permissions and coordinates
 */

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export interface GeoResult {
  success: boolean;
  position?: GeoPosition;
  error?: string;
  errorCode?: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN';
}

export interface GeoPermissionState {
  state: 'granted' | 'denied' | 'prompt' | 'unknown';
  timestamp: number;
}

// Storage keys
const STORAGE_KEYS = {
  PERMISSION_STATE: 'geo_permission_state',
  LAST_POSITION: 'geo_last_position',
  PERMISSION_ASKED: 'geo_permission_asked_timestamp'
};

/**
 * Request user's current location
 */
export async function requestLocation(): Promise<GeoResult> {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    return {
      success: false,
      error: 'Geolocation is not supported by your browser',
      errorCode: 'UNKNOWN'
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const geoPosition: GeoPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        // Cache the position
        localStorage.setItem(STORAGE_KEYS.LAST_POSITION, JSON.stringify(geoPosition));
        
        // Update permission state
        updatePermissionState('granted');

        resolve({
          success: true,
          position: geoPosition
        });
      },
      // Error callback
      (error) => {
        let errorCode: GeoResult['errorCode'] = 'UNKNOWN';
        let errorMessage = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorCode = 'PERMISSION_DENIED';
            errorMessage = 'Location access denied';
            updatePermissionState('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorCode = 'POSITION_UNAVAILABLE';
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorCode = 'TIMEOUT';
            errorMessage = 'Location request timed out';
            break;
        }

        resolve({
          success: false,
          error: errorMessage,
          errorCode
        });
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  });
}

/**
 * Check current permission state using Permissions API
 */
export async function checkPermissionState(): Promise<GeoPermissionState> {
  try {
    // Check cached state first
    const cached = localStorage.getItem(STORAGE_KEYS.PERMISSION_STATE);
    if (cached) {
      const state = JSON.parse(cached) as GeoPermissionState;
      // Return cached state if it's less than 1 hour old
      if (Date.now() - state.timestamp < 3600000) {
        return state;
      }
    }

    // Try to use Permissions API (not all browsers support it)
    if ('permissions' in navigator && 'query' in navigator.permissions) {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      const state: GeoPermissionState = {
        state: permission.state as GeoPermissionState['state'],
        timestamp: Date.now()
      };
      
      // Cache the state
      localStorage.setItem(STORAGE_KEYS.PERMISSION_STATE, JSON.stringify(state));
      
      // Listen for permission changes
      permission.addEventListener('change', () => {
        updatePermissionState(permission.state as GeoPermissionState['state']);
      });
      
      return state;
    }
  } catch (error) {
    console.warn('Permissions API not available:', error);
  }

  // Fallback: check if we have a cached position
  const lastPosition = localStorage.getItem(STORAGE_KEYS.LAST_POSITION);
  if (lastPosition) {
    return {
      state: 'granted',
      timestamp: Date.now()
    };
  }

  // Return unknown state
  return {
    state: 'unknown',
    timestamp: Date.now()
  };
}

/**
 * Update permission state in storage
 */
function updatePermissionState(state: GeoPermissionState['state']): void {
  const permissionState: GeoPermissionState = {
    state,
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.PERMISSION_STATE, JSON.stringify(permissionState));
  
  // Dispatch custom event for reactive updates
  window.dispatchEvent(new CustomEvent('geopermissionchange', { 
    detail: permissionState 
  }));
}

/**
 * Get cached last position if available
 */
export function getLastPosition(): GeoPosition | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.LAST_POSITION);
    if (cached) {
      return JSON.parse(cached) as GeoPosition;
    }
  } catch (error) {
    console.error('Error reading cached position:', error);
  }
  return null;
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLng = toRad(pos2.lng - pos1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Check if we should ask for permission again
 * (Don't nag the user if they recently denied)
 */
export function shouldAskPermission(): boolean {
  const lastAsked = localStorage.getItem(STORAGE_KEYS.PERMISSION_ASKED);
  if (!lastAsked) return true;
  
  const daysSinceAsked = (Date.now() - parseInt(lastAsked)) / (1000 * 60 * 60 * 24);
  return daysSinceAsked > 1; // Ask again after 1 day
}

/**
 * Mark that we've asked for permission
 */
export function markPermissionAsked(): void {
  localStorage.setItem(STORAGE_KEYS.PERMISSION_ASKED, Date.now().toString());
}
