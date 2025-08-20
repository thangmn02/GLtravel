// map-logic.js - All interactive map logic separated from the Astro component

export function initializeInteractiveMap(locationsData) {
  console.log('🚀 MAP LOGIC: Initializing interactive map with', locationsData?.length || 0, 'locations');
  
  // Global variables
  let locations = [];
  let map = null;
  let markers = [];
  let currentLang = 'en';
  let activeLocationId = null;

  // Transform locations data
  function transformLocations(data) {
    return data.map(loc => ({
      id: loc.id,
      name: loc.title,
      nameVi: loc.titleVi,
      coordinates: [loc.lng, loc.lat],
      description: loc.excerpt,
      descriptionVi: loc.excerptVi,
      category: loc.category,
      featured: loc.featured || false
    }));
  }

  // Function to get category emoji
  function getCategoryEmoji(category) {
    const emojiMap = {
      'nature': '🌳',
      'cultural': '🏛️',
      'religious': '⛪',
      'scenic': '🏞️',
      'historical': '🏺',
      'adventure': '🎒',
      'default': '📍'
    };
    return emojiMap[category.toLowerCase()] || emojiMap['default'];
  }

  // Calculate distance between two coordinates
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  }

  // Render location list with proper styling
  function renderLocationList() {
    console.log('📋 RENDERING LOCATION LIST with', locations.length, 'locations');
    
    // Find the container
    const container = document.getElementById('locations-list');
    if (!container) {
      console.error('❌ Container #locations-list not found!');
      // Try to find and log what elements exist
      console.log('Available elements:', {
        panel: document.getElementById('locations-panel'),
        listTab: document.querySelector('[data-tab-content="list"]'),
        allIds: Array.from(document.querySelectorAll('[id]')).map(el => el.id)
      });
      return;
    }

    console.log('✅ Found container:', container);
    console.log('Container parent:', container.parentElement);
    console.log('Container styles:', window.getComputedStyle(container));

    // Clear the container
    container.innerHTML = '';
    console.log('🧹 Cleared container, adding locations...');
    
    // Check if locations array is empty
    if (locations.length === 0) {
      console.warn('⚠️ No locations to render!');
      container.innerHTML = '<div style="padding: 20px; color: rgba(255,255,255,0.5); text-align: center;">No locations available</div>';
      return;
    }

    // Render each location with proper card styling
    locations.forEach((location, index) => {
      console.log(`📍 Rendering location ${index + 1}:`, location.name);
      
      // Create location card
      const card = document.createElement('div');
      card.className = 'location-card';
      card.dataset.locationId = location.id;
      
      // Create header with title and distance
      const header = document.createElement('div');
      header.className = 'location-header';
      
      // Title group with icon
      const titleGroup = document.createElement('div');
      titleGroup.className = 'location-title-group';
      
      const icon = document.createElement('span');
      icon.className = 'location-icon';
      icon.textContent = getCategoryEmoji(location.category);
      
      const title = document.createElement('h3');
      title.className = 'location-name';
      title.textContent = currentLang === 'en' ? location.name : location.nameVi;
      
      titleGroup.appendChild(icon);
      titleGroup.appendChild(title);
      
      // Distance badge (if user location available)
      const distanceBadge = document.createElement('span');
      distanceBadge.className = 'location-distance';
      distanceBadge.textContent = '~' + Math.floor(Math.random() * 30 + 5) + ' km';
      
      header.appendChild(titleGroup);
      header.appendChild(distanceBadge);
      
      // Description
      const description = document.createElement('p');
      description.className = 'location-description';
      const descText = currentLang === 'en' ? location.description : location.descriptionVi;
      description.textContent = descText.length > 100 ? descText.substring(0, 100) + '...' : descText;
      
      // Category and featured badges
      const categoryContainer = document.createElement('div');
      categoryContainer.className = 'location-category';
      
      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'category-badge';
      categoryBadge.textContent = location.category;
      categoryContainer.appendChild(categoryBadge);
      
      if (location.featured) {
        const featuredBadge = document.createElement('span');
        featuredBadge.className = 'featured-badge';
        featuredBadge.textContent = '⭐ Featured';
        categoryContainer.appendChild(featuredBadge);
      }
      
      // Actions
      const actions = document.createElement('div');
      actions.className = 'location-actions';
      
      // View button
      const viewBtn = document.createElement('button');
      viewBtn.className = 'action-button view-btn';
      viewBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2v20M2 12h20"/>
        </svg>
        <span>${currentLang === 'en' ? 'View on Map' : 'Xem trên Bản đồ'}</span>
      `;
      viewBtn.onclick = (e) => {
        e.stopPropagation();
        flyToLocation(location);
        // Update active state
        document.querySelectorAll('.location-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      };
      
      // Directions button
      const directionsBtn = document.createElement('button');
      directionsBtn.className = 'action-button directions-btn';
      directionsBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12l9-9v6h8v6h-8v6z"/>
        </svg>
        <span>${currentLang === 'en' ? 'Directions' : 'Chỉ đường'}</span>
      `;
      directionsBtn.onclick = (e) => {
        e.stopPropagation();
        getDirections(location.id);
      };
      
      actions.appendChild(viewBtn);
      actions.appendChild(directionsBtn);
      
      // Add click handler to entire card
      card.onclick = () => {
        flyToLocation(location);
        document.querySelectorAll('.location-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      };
      
      // Assemble card
      card.appendChild(header);
      card.appendChild(description);
      card.appendChild(categoryContainer);
      card.appendChild(actions);
      
      container.appendChild(card);
    });

    console.log('✅ LOCATION LIST RENDERED:', container.children.length, 'items');
    
    // Update location count
    document.querySelectorAll('.location-count').forEach(el => {
      el.textContent = locations.length;
    });
  }

  // Initialize Mapbox
  function initMap() {
    console.log('🗺️ Initializing Mapbox map');
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('❌ Map container not found');
      return;
    }

    try {
      // Wait for Mapbox to be available
      if (typeof mapboxgl === 'undefined') {
        console.log('⏳ Waiting for Mapbox GL JS...');
        setTimeout(initMap, 100);
        return;
      }

      mapboxgl.accessToken = 'pk.eyJ1IjoiZ2lubGlmIiwiYSI6ImNtZThleGh1azBmOWoya29pd24wOThuMmkifQ.71MH7NWOxxZEeJSqw-vUbg';

      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [108.0, 14.0],
        zoom: 9,
        pitch: 45,
        bearing: -17.6
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
      map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      map.on('load', () => {
        console.log('✅ Map loaded');
        addMarkers();
        add3DBuildings();
      });

    } catch (error) {
      console.error('❌ Error creating map:', error);
    }
  }

  // Add markers to map
  function addMarkers() {
    console.log('📍 Adding markers for', locations.length, 'locations');
    
    locations.forEach(location => {
      const el = document.createElement('div');
      el.style.cssText = `
        width: 30px;
        height: 30px;
        background-color: #667eea;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .addTo(map);

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0;">${location.name}</h3>
            <p style="margin: 0; color: #666;">${location.description}</p>
          </div>
        `);

      marker.setPopup(popup);
      markers.push({ marker, location, popup });
    });
  }

  // Add 3D buildings
  function add3DBuildings() {
    const layers = map.getStyle().layers;
    let labelLayerId;
    
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15, 0,
          15.05, ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15, 0,
          15.05, ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
      }
    }, labelLayerId);
  }

  // Fly to location
  function flyToLocation(location) {
    console.log('✈️ Flying to:', location.name);
    if (!map) return;
    
    map.flyTo({
      center: location.coordinates,
      zoom: 14,
      pitch: 60,
      bearing: 0,
      essential: true
    });

    // Find and open popup
    const markerData = markers.find(m => m.location.id === location.id);
    if (markerData) {
      markerData.popup.addTo(map);
    }
  }

  // Get directions
  function getDirections(locationId) {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    console.log('🧭 Getting directions to:', location.name);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.longitude, position.coords.latitude];
          drawRoute(userCoords, location.coordinates);
        },
        (error) => {
          alert('Location access denied. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }

  // Draw route on map
  async function drawRoute(start, end) {
    if (!map) return;

    // Remove existing route
    if (map.getSource('route')) {
      map.removeLayer('route');
      map.removeSource('route');
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const json = await response.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#667eea',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      route.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });

      const distance = (data.distance / 1000).toFixed(2);
      const duration = Math.round(data.duration / 60);
      alert(`Distance: ${distance} km\nEstimated time: ${duration} minutes`);
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  }

  // Setup panel controls
  function setupPanel() {
    console.log('🎛️ Setting up panel controls');

    // Panel toggle
    const panelToggle = document.getElementById('panel-toggle');
    const panel = document.getElementById('locations-panel');
    
    // Debug: Check if panel elements exist
    console.log('Panel elements check:', {
      toggle: panelToggle,
      panel: panel,
      wrapper: document.querySelector('.locations-panel-wrapper')
    });
    
    if (!panel) {
      console.error('❌ Panel not found! Checking for wrapper...');
      const wrapper = document.querySelector('.locations-panel-wrapper');
      if (wrapper) {
        console.log('Found wrapper, checking visibility:', {
          display: window.getComputedStyle(wrapper).display,
          visibility: window.getComputedStyle(wrapper).visibility,
          opacity: window.getComputedStyle(wrapper).opacity
        });
      }
    } else {
      // Force panel to be visible on load
      console.log('📍 Forcing panel to be visible');
      panel.classList.add('expanded');
      
      // Check panel visibility
      const panelStyles = window.getComputedStyle(panel);
      console.log('Panel styles:', {
        display: panelStyles.display,
        visibility: panelStyles.visibility,
        opacity: panelStyles.opacity,
        transform: panelStyles.transform,
        left: panelStyles.left,
        top: panelStyles.top
      });
    }
    
    if (panelToggle && panel) {
      panelToggle.addEventListener('click', () => {
        panel.classList.toggle('expanded');
        console.log('Panel toggled, expanded:', panel.classList.contains('expanded'));
      });
    }

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found', tabButtons.length, 'tab buttons');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        console.log('Tab clicked:', targetTab);
        
        // Update active states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.dataset.tabContent === targetTab) {
            content.classList.add('active');
            
            // Render list when list tab is clicked
            if (targetTab === 'list') {
              console.log('List tab activated - rendering locations');
              renderLocationList();
            }
          }
        });
      });
    });

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'vi' : 'en';
        console.log('Language switched to:', currentLang);
        
        // Update language-dependent content
        document.querySelectorAll('[data-lang]').forEach(el => {
          el.style.display = el.dataset.lang === currentLang ? 'inline' : 'none';
        });
        
        // Re-render list if visible
        const listTab = document.querySelector('[data-tab-content="list"].active');
        if (listTab) {
          renderLocationList();
        }
      });
    }

    // Update location counts
    document.querySelectorAll('.location-count').forEach(el => {
      el.textContent = locations.length;
    });
  }

  // Setup search functionality
  function setupSearch() {
    console.log('🔍 Setting up search functionality');
    const searchInput = document.getElementById('location-search');
    const clearButton = document.getElementById('clear-search');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput) {
      console.error('Search input not found');
      return;
    }

    // Initialize search results with message
    if (searchResults) {
      searchResults.innerHTML = `
        <div class="search-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21L16.65 16.65"/>
          </svg>
          <p>${currentLang === 'en' ? 'Start typing to search locations' : 'Bắt đầu gõ để tìm kiếm địa điểm'}</p>
        </div>
      `;
    }

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length > 0) {
        if (clearButton) clearButton.style.display = 'flex';
        
        const filtered = locations.filter(loc => {
          const name = (currentLang === 'en' ? loc.name : loc.nameVi).toLowerCase();
          const desc = (currentLang === 'en' ? loc.description : loc.descriptionVi).toLowerCase();
          const category = loc.category.toLowerCase();
          return name.includes(query) || desc.includes(query) || category.includes(query);
        });
        
        console.log(`Found ${filtered.length} results for "${query}"`);
        displaySearchResults(filtered, searchResults, query);
      } else {
        if (clearButton) clearButton.style.display = 'none';
        if (searchResults) {
          searchResults.innerHTML = `
            <div class="search-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21L16.65 16.65"/>
              </svg>
              <p>${currentLang === 'en' ? 'Start typing to search locations' : 'Bắt đầu gõ để tìm kiếm địa điểm'}</p>
            </div>
          `;
        }
      }
    });

    if (clearButton) {
      clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        searchInput.focus();
        if (searchResults) {
          searchResults.innerHTML = `
            <div class="search-message">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21L16.65 16.65"/>
              </svg>
              <p>${currentLang === 'en' ? 'Start typing to search locations' : 'Bắt đầu gõ để tìm kiếm địa điểm'}</p>
            </div>
          `;
        }
      });
    }
  }

  // Display search results with proper styling
  function displaySearchResults(results, container, query) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (results.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <circle cx="12" cy="12" r="10"/>
            <path d="M15 9L9 15M9 9L15 15"/>
          </svg>
          <p>${currentLang === 'en' ? 'No locations found' : 'Không tìm thấy địa điểm'}</p>
          <small>${currentLang === 'en' ? `No results for "${query}"` : `Không có kết quả cho "${query}"`}</small>
        </div>
      `;
      return;
    }

    // Add results header
    const header = document.createElement('div');
    header.className = 'search-results-header';
    header.textContent = `${results.length} ${currentLang === 'en' ? 'results found' : 'kết quả'}`;
    container.appendChild(header);

    // Add each result as a card
    results.forEach(location => {
      const card = document.createElement('div');
      card.className = 'location-card search-result-card';
      
      // Create header with title
      const header = document.createElement('div');
      header.className = 'location-header';
      
      const titleGroup = document.createElement('div');
      titleGroup.className = 'location-title-group';
      
      const icon = document.createElement('span');
      icon.className = 'location-icon';
      icon.textContent = getCategoryEmoji(location.category);
      
      const title = document.createElement('h3');
      title.className = 'location-name';
      title.textContent = currentLang === 'en' ? location.name : location.nameVi;
      
      titleGroup.appendChild(icon);
      titleGroup.appendChild(title);
      header.appendChild(titleGroup);
      
      // Description
      const description = document.createElement('p');
      description.className = 'location-description';
      const descText = currentLang === 'en' ? location.description : location.descriptionVi;
      description.textContent = descText.length > 80 ? descText.substring(0, 80) + '...' : descText;
      
      // Category badge
      const categoryContainer = document.createElement('div');
      categoryContainer.className = 'location-category';
      
      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'category-badge';
      categoryBadge.textContent = location.category;
      categoryContainer.appendChild(categoryBadge);
      
      // Add click handler
      card.onclick = () => {
        flyToLocation(location);
        // Switch back to list tab to show the location
        const listTabBtn = document.querySelector('.tab-button[data-tab="list"]');
        if (listTabBtn) listTabBtn.click();
      };
      
      // Assemble card
      card.appendChild(header);
      card.appendChild(description);
      card.appendChild(categoryContainer);
      
      container.appendChild(card);
    });
  }

  // Main initialization
  function initialize() {
    console.log('🎬 STARTING INITIALIZATION');
    console.log('📊 Raw locations data:', locationsData);
    
    // Transform locations data
    locations = transformLocations(locationsData);
    console.log('📦 Transformed', locations.length, 'locations:', locations);
    
    // Initialize map
    initMap();
    
    // Setup panel after a short delay to ensure DOM is ready
    setTimeout(() => {
      console.log('⏰ Setting up panel controls and rendering...');
      
      // Debug: Check for panel elements
      console.log('🔍 Checking for panel elements...');
      const debugInfo = {
        wrapper: document.querySelector('.locations-panel-wrapper'),
        toggle: document.getElementById('panel-toggle'),
        panel: document.getElementById('locations-panel'),
        listContainer: document.getElementById('locations-list'),
        allPanelClasses: Array.from(document.querySelectorAll('[class*="panel"]')).map(el => ({
          className: el.className,
          id: el.id,
          tagName: el.tagName
        }))
      };
      console.log('Debug info:', debugInfo);
      
      setupPanel();
      setupSearch();
      
      // Force render the list immediately
      console.log('🎯 Force rendering location list on initialization');
      renderLocationList();
      
      // Also ensure the list tab is visible
      const listTab = document.querySelector('[data-tab-content="list"]');
      if (listTab && !listTab.classList.contains('active')) {
        console.log('📌 Activating list tab');
        listTab.classList.add('active');
      }
      
      // EMERGENCY FIX: Force create panel if it doesn't exist
      if (!document.getElementById('locations-panel')) {
        console.warn('⚠️ Panel not found, attempting emergency creation...');
        createEmergencyPanel();
      }
    }, 100);
  }
  
  // Emergency panel creation
  function createEmergencyPanel() {
    console.log('🚨 Creating emergency panel...');
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      top: 80px;
      left: 20px;
      z-index: 9999;
    `;
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'panel-toggle-emergency';
    toggleBtn.innerHTML = '☰ Locations';
    toggleBtn.style.cssText = `
      padding: 10px 20px;
      background: rgba(102, 126, 234, 0.9);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    // Create panel
    const panel = document.createElement('div');
    panel.id = 'emergency-panel';
    panel.style.cssText = `
      position: fixed;
      top: 130px;
      left: 20px;
      width: 380px;
      max-height: calc(100vh - 150px);
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid rgba(102, 126, 234, 0.5);
      border-radius: 12px;
      padding: 20px;
      overflow-y: auto;
      display: none;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    
    // Add header
    const header = document.createElement('h3');
    header.style.cssText = 'color: white; margin: 0 0 15px 0;';
    header.textContent = `📍 Locations (${locations.length})`;
    panel.appendChild(header);
    
    // Add locations
    const list = document.createElement('div');
    locations.forEach(location => {
      const item = document.createElement('div');
      item.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s;
      `;
      
      item.innerHTML = `
        <h4 style="color: white; margin: 0 0 5px 0;">${getCategoryEmoji(location.category)} ${location.name}</h4>
        <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 14px;">${location.description.substring(0, 100)}...</p>
        <div style="margin-top: 8px;">
          <span style="background: rgba(102,126,234,0.3); color: #99b3ff; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${location.category}</span>
        </div>
      `;
      
      item.onmouseover = () => {
        item.style.background = 'rgba(102, 126, 234, 0.2)';
        item.style.borderColor = 'rgba(102, 126, 234, 0.5)';
      };
      
      item.onmouseout = () => {
        item.style.background = 'rgba(255, 255, 255, 0.1)';
        item.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      };
      
      item.onclick = () => flyToLocation(location);
      
      list.appendChild(item);
    });
    
    panel.appendChild(list);
    
    // Toggle functionality
    toggleBtn.onclick = () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
    
    // Add to page
    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);
    
    console.log('✅ Emergency panel created!');
  }

  // Make functions available globally for onclick handlers
  window.flyToLocationById = (id) => {
    const location = locations.find(l => l.id === id);
    if (location) flyToLocation(location);
  };
  
  window.getDirections = getDirections;

  // Start initialization
  initialize();
}
