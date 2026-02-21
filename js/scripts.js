// LAZY LOADING - Load background images on scroll
(function() {
  var lazyBgs = document.querySelectorAll('[data-bg]');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.backgroundImage = entry.target.getAttribute('data-bg');
          entry.target.removeAttribute('data-bg');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    lazyBgs.forEach(function(el) { observer.observe(el); });
  } else {
    lazyBgs.forEach(function(el) {
      el.style.backgroundImage = el.getAttribute('data-bg');
      el.removeAttribute('data-bg');
    });
  }
})();

// NAVIGATION - Sticky main menu on scroll
(function() {
  const mainMenu = document.getElementById('mainMenu');
  if (mainMenu) {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          // Get the menu's initial distance from top
          const menuTop = mainMenu.offsetTop;
          
          // Menu becomes sticky when scroll position reaches its original position
          if (window.scrollY >= menuTop) {
            mainMenu.classList.add('sticky');
          } else {
            mainMenu.classList.remove('sticky');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();

window.onload = function () {
  

  //LONG, LAT!!!!!
  //const mapGalgenweel = initializeMap("map-race", galgenweel, 15.5);

  

  /*
  // Coordinates to connect with a line
  const coordinates = [
    [4.3728103, 51.2131447],
    [4.3775, 51.2155],
    [4.3775, 51.2135],
    [4.3728103, 51.2131447], //repeat first coordinates to close the loop
  ];
  // Add line between these coordinates
  //addLineBetweenCoordinates(mapGalgenweel, coordinates);
  addSmoothCurve(mapGalgenweel, coordinates);

  // URL of the online SVG marker
  const svgUrl = "../img/buoy.svg";

  // Add marker with online SVG
  addCustomMarker(
    mapGalgenweel,
    [4.3728103, 51.2131447],
    svgUrl,
    20,
    20,
    23,
    -6
  );
  addCustomMarker(mapGalgenweel, [4.3775, 51.2155], svgUrl, 20, 20, 0, 16);
  addCustomMarker(mapGalgenweel, [4.3775, 51.2135], svgUrl, 20, 20, -15, -5);
*/

  

};
mapboxgl.accessToken =
  "pk.eyJ1IjoibWF0dGhla2ltIiwiYSI6ImNrdjZmdW4ydjFibXUydm8wNmoxOWxua3cifQ.t3zhCOwIdsJh180Kgukq8Q";

// Function to initialize a Mapbox map in a given container
function initializeMap(containerId, coordinates, zoom) {
  const map = new mapboxgl.Map({
    container: containerId,
    style: "mapbox://styles/matthekim/cm9u0hfgr001001s941ym33e3",
    center: coordinates, // [lng, lat]
    zoom: zoom,
  });

  // Add zoom and rotation controls to the map
  map.addControl(new mapboxgl.NavigationControl());
  // Disable pinch-zoom and rotation
  map.touchZoomRotate.disable(); // Disables pinch-to-zoom & two-finger rotation
  map.scrollZoom.disable(); // Prevents zooming with scroll wheel
  map.dragPan.enable(); // Still allows dragging the map
  return map;
}

// Function to initialize a tour map with marker
function initializeTourMap(containerId, lat, lng, zoom, tourTitle) {
  const map = new mapboxgl.Map({
    container: containerId,
    style: "mapbox://styles/matthekim/cm9u0hfgr001001s941ym33e3",
    center: [lng, lat], // [lng, lat] - Mapbox uses longitude first
    zoom: zoom,
    scrollZoom: false, // Disable zoom on scroll
    dragPan: true, // Keep drag to pan enabled
    dragRotate: false, // Disable rotation
    doubleClickZoom: false, // Disable double-click zoom
    touchZoomRotate: false, // Disable touch zoom and rotate on mobile
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl());

  // No default marker - custom ones will be added later

  return map;
}

// Function to add a custom SVG marker to a Mapbox map
function addCustomMarker(
  map,
  coordinates,
  svgUrl,
  width,
  height,
  offsetX = 0,
  offsetY = 0
) {
  // Create a div container for the marker
  const markerElement = document.createElement("div");

  // Create an image element for the SVG
  const img = document.createElement("img");
  img.src = svgUrl;
  img.style.width = `${width}px`;
  img.style.height = `${height}px`;
  img.style.display = "block"; // Ensures proper rendering

  // Append image to marker element
  markerElement.appendChild(img);

  // Create the marker with proper offset
  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: "bottom", // Align bottom-center to coordinates
    offset: [offsetX, offsetY], // ✅ Correct way to apply offset in Mapbox
  })
    .setLngLat(coordinates) // Set coordinates for the marker
    .addTo(map);
    
  return marker;
}

// Function to add a custom SVG marker with popup to a Mapbox map
function addCustomMarkerWithPopup(
  map,
  coordinates,
  svgUrl,
  width,
  height,
  offsetX = 0,
  offsetY = 0,
  popupTitle,
  popupText
) {
  // Create a div container for the marker
  const markerElement = document.createElement("div");

  // Create an image element for the SVG
  const img = document.createElement("img");
  img.src = svgUrl;
  img.style.width = `${width}px`;
  img.style.height = `${height}px`;
  img.style.display = "block";
  img.style.cursor = "pointer";

  // Append image to marker element
  markerElement.appendChild(img);

  // Create the marker with proper offset
  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: "bottom",
    offset: [offsetX, offsetY],
  })
    .setLngLat(coordinates)
    .addTo(map);

  // Add popup with inline styling
  const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: true,
    closeOnClick: true,
    maxWidth: '300px'
  }).setHTML(`
    <div style="font-family: inherit;">
      <h3 style="margin: 0 0 8px 0; padding: 0; font-size: 16px; font-weight: bold; line-height: 1.2;">${popupTitle}</h3>
      <p style="margin: 0; padding: 0; font-size: 14px; line-height: 1.4;">${popupText}</p>
    </div>
  `);

  marker.setPopup(popup);
  
  return marker;
}

function addLineBetweenCoordinates(map, coordinates) {
  map.on("load", function () {
    // Ensure map is fully loaded before adding the line
    // Create GeoJSON data for the line
    const lineData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: coordinates, // Array of coordinates: [[lng1, lat1], [lng2, lat2], ...]
          },
        },
      ],
    };

    // Add the GeoJSON source if it doesn't exist
    if (!map.getSource("line-source")) {
      map.addSource("line-source", {
        type: "geojson",
        data: lineData,
      });

      // Add a line layer to the map
      map.addLayer({
        id: "line-layer",
        type: "line",
        source: "line-source",
        paint: {
          "line-color": "#2b4e47", // Change to any color
          "line-width": 4, // Adjust thickness
          "line-opacity": 0.85, // Adjust transparency
        },
      });
    } else {
      // If the source already exists, just update the data
      map.getSource("line-source").setData(lineData);
    }
  });
}
// Function to generate a smooth Catmull-Rom spline curve
function catmullRomSpline(points, segments = 50) {
  let curve = [];

  function interpolate(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;

    return [
      0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
      0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
    ];
  }

  // Ensure loop closes by repeating first and last points
  const extendedPoints = [points[0], ...points, points[points.length - 1]];

  for (let i = 1; i < extendedPoints.length - 2; i++) {
    for (let t = 0; t < 1; t += 1 / segments) {
      curve.push(
        interpolate(
          extendedPoints[i - 1],
          extendedPoints[i],
          extendedPoints[i + 1],
          extendedPoints[i + 2],
          t
        )
      );
    }
  }

  return curve;
}

// Function to add a smooth curve to Mapbox
function addSmoothCurve(map, coordinates) {
  if (!map || !(map instanceof mapboxgl.Map)) {
    console.error("Map is not initialized properly.");
    return;
  }

  const smoothPoints = catmullRomSpline(coordinates, 100);

  map.on("load", function () {
    if (!map.getSource("smooth-curve")) {
      map.addSource("smooth-curve", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: smoothPoints,
              },
            },
          ],
        },
      });

      map.addLayer({
        id: "smooth-curve-layer",
        type: "line",
        source: "smooth-curve",
        paint: {
          "line-color": "#f7f0e6",
          "line-width": 4,
          "line-opacity": 0.7,
        },
      });
    } else {
      map.getSource("smooth-curve").setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: smoothPoints,
            },
          },
        ],
      });
    }
  });
}

// Function to initialize marker popups for a tour map
function initializeMarkerPopups(mapElementId, locationData) {
  const mapElement = document.getElementById(mapElementId);
  if (!mapElement) {
    console.log('Map element not found for popup placement');
    return;
  }

  // Ensure map container has relative positioning for absolute popup
  mapElement.style.position = 'relative';

  // Create popup div element
  const popup = document.createElement('div');
  popup.id = 'marker-popup';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.className = 'close-btn';
  closeBtn.onclick = function() {
    popup.style.display = 'none';
  };

  const title = document.createElement('h3');
  const text = document.createElement('p');

  popup.appendChild(closeBtn);
  popup.appendChild(title);
  popup.appendChild(text);
  mapElement.appendChild(popup);

  // Find all marker images and add click handlers
  const markerImages = document.querySelectorAll('.mapboxgl-marker img');
  console.log('Found', markerImages.length, 'marker images');

  markerImages.forEach(function(img, index) {
    img.style.cursor = 'pointer';
    img.style.pointerEvents = 'auto';

    img.addEventListener('click', function(e) {
      console.log('Marker clicked:', index);
      e.preventDefault();
      e.stopPropagation();

      // Get location data for this marker
      const location = locationData[index];
      if (location) {
        title.textContent = location.title;
        text.textContent = location.text;

        // Position popup above the clicked marker
        const markerRect = img.getBoundingClientRect();
        const mapRect = mapElement.getBoundingClientRect();

        // Calculate position relative to map container
        const markerLeft = markerRect.left - mapRect.left;
        const markerTop = markerRect.top - mapRect.top;

        // Position popup above marker, centered horizontally
        popup.style.left = (markerLeft - 150) + 'px'; // Center popup (300px width / 2 = 150px offset)
        popup.style.top = (markerTop - 140) + 'px'; // Position above marker (popup height + margin + 20px extra)

        // Ensure popup doesn't go outside map boundaries
        const popupLeft = parseInt(popup.style.left);
        const popupTop = parseInt(popup.style.top);

        if (popupLeft < 10) {
          popup.style.left = '10px';
        } else if (popupLeft > mapRect.width - 320) {
          popup.style.left = (mapRect.width - 320) + 'px';
        }

        if (popupTop < 10) {
          popup.style.top = '10px';
        }

        popup.style.display = 'block';
        console.log('Popup displayed for:', location.title);
      }
    });
  });

  // Close popup when clicking outside
  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target)) {
      popup.style.display = 'none';
    }
  });
}

// Function to setup map interaction controls
function setupMapInteractionControls(mapElementId) {
  const mapElement = document.getElementById(mapElementId);
  if (!mapElement) {
    return;
  }

  // Make map container position relative for overlay
  mapElement.style.position = 'relative';

  // Make map immediately interactive to avoid the overlay system
  mapElement.classList.add('map-interactive');
  console.log('Map set to interactive by default');

  // Only prevent wheel events when focused, not when hovering
  let mapFocused = false;

  mapElement.addEventListener('mouseenter', function() {
    mapFocused = true;
  });

  mapElement.addEventListener('mouseleave', function() {
    mapFocused = false;
  });

  mapElement.addEventListener('wheel', function(e) {
    if (mapFocused) {
      // Allow map wheel interaction
      return;
    } else {
      // Prevent map wheel when not focused, allow page scroll
      e.preventDefault();
      return;
    }
  }, { passive: false });
}
