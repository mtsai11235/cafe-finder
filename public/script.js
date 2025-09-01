// Global variables
let map;
let service;
let infowindow;
let markers = [];
let currentPosition = null;

// Initialize the map
function initMap() {
    // Show loading indicator in map area
    document.getElementById("map").innerHTML = 
        '<div style="display:flex;justify-content:center;align-items:center;height:100%;flex-direction:column;">' +
        '<div style="margin-bottom:20px;">Loading map...</div>' +
        '<div class="loading-spinner"></div>' +
        '</div>';
        
    // First check if we can get the user's location before initializing the map
    if (navigator.geolocation) {
        // Add a timeout to ensure we don't wait too long for geolocation
        const locationTimeout = setTimeout(() => {
            console.log("Geolocation timeout - using default location");
            initializeMapWithLocation(null);
        }, 5000); // 5 second timeout
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(locationTimeout);
                console.log("Got user location before map initialization");
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                currentPosition = userLocation;
                initializeMapWithLocation(userLocation);
            },
            (error) => {
                clearTimeout(locationTimeout);
                console.log("Error getting location before map init:", error);
                initializeMapWithLocation(null);
            },
            { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
        );
    } else {
        // Geolocation not supported
        console.log("Geolocation not supported");
        initializeMapWithLocation(null);
    }
}

// Initialize map with a specific location (or default if location is null)
function initializeMapWithLocation(location) {
    // Default location (San Francisco)
    const defaultLocation = { lat: 37.7749, lng: -122.4194 };
    
    // Use provided location or default
    const mapCenter = location || defaultLocation;
    
    // Create map centered at the appropriate location
    map = new google.maps.Map(document.getElementById("map"), {
        center: mapCenter,
        zoom: 14,
    });
    
    // Create InfoWindow for displaying place details
    infowindow = new google.maps.InfoWindow();
    
    // Create PlacesService to interact with the Places API
    try {
        service = new google.maps.places.PlacesService(map);
    } catch (error) {
        console.error("Error creating PlacesService:", error);
        alert("There was an error initializing the Google Maps Places service. Please check your API key and make sure the Places API is enabled.");
    }
    
    // Add map idle event listener to ensure API is fully loaded
    google.maps.event.addListenerOnce(map, 'idle', function() {
        console.log("Map is fully loaded and ready");
        
        // If we have user's location, add marker and search for cafes
        if (location) {
            // Add marker for user's location
            addUserLocationMarker(location);
            
            // Search for cafes near user's location
            searchCafesNearby(location);
        } else {
            // Search for cafes in the default location
            searchCafesNearby(defaultLocation);
        }
    });
    
    // Set up locate me button
    document.getElementById("locate-me").addEventListener("click", getCurrentLocation);
    
    // Set up search button click event
    document.getElementById("search-button").addEventListener("click", searchCafes);
    
    // Allow search by pressing Enter in the search input
    document.getElementById("search-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchCafes();
        }
    });
    
    // Add map idle event listener to ensure API is fully loaded
    google.maps.event.addListenerOnce(map, 'idle', function() {
        console.log("Map is fully loaded and ready");
    });
}

// Function to add user location marker
function addUserLocationMarker(location) {
    try {
        // Try to use AdvancedMarkerElement if available (newer API)
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
            const userLocationMarker = new google.maps.marker.AdvancedMarkerElement({
                position: location,
                map: map,
                title: "Your Location",
                content: createUserLocationMarker()
            });
        } else {
            // Fall back to legacy Marker
            new google.maps.Marker({
                position: location,
                map: map,
                title: "Your Location",
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                },
            });
        }
    } catch (error) {
        console.error("Error creating user location marker:", error);
        // Simplified fallback marker
        new google.maps.Marker({
            position: location,
            map: map,
            title: "Your Location"
        });
    }
}

// Get user's current location when button is clicked
function getCurrentLocation() {
    // Show loading indicator
    const placesListElement = document.getElementById("places-list");
    placesListElement.innerHTML = "<p>Getting your location...</p>";
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                
                console.log("Got user location from button click");
                
                // Clear existing markers
                clearMarkers();
                
                // Center map on user's location
                map.setCenter(currentPosition);
                
                // Add marker for user's location
                addUserLocationMarker(currentPosition);
                
                // Search for cafes near the user's location
                searchCafesNearby(currentPosition);
            },
            (error) => {
                console.error("Error getting location:", error);
                placesListElement.innerHTML = "<p>Unable to get your location. Please try searching manually.</p>";
                alert("Unable to get your location. Please try searching manually.");
            },
            { maximumAge: 0, timeout: 10000, enableHighAccuracy: true } // Fresh location, 10s timeout
        );
    } else {
        placesListElement.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
        alert("Geolocation is not supported by your browser.");
    }
}

// Search for cafes based on user input
function searchCafes() {
    const input = document.getElementById("search-input").value;
    
    if (!input) {
        alert("Please enter a location to search for cafes.");
        return;
    }
    
    try {
        // Try to use browser's geocoding if Google's geocoding fails
        if (navigator.geolocation && input.toLowerCase() === "my location") {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(location);
                    searchCafesNearby(location);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Unable to get your location. Please try a specific address instead.");
                }
            );
            return;
        }
        
            // Try to use our secure geocoding API
    try {
        // Show loading indicator
        document.getElementById("places-list").innerHTML = "<p>Searching for location...</p>";
        
        // Use our secure API to geocode the address
        SecureAPI.geocode({ address: input })
            .then(response => {
                if (response.status === "OK" && response.results && response.results.length > 0) {
                    const result = response.results[0];
                    const location = {
                        lat: result.geometry.location.lat,
                        lng: result.geometry.location.lng
                    };
                    
                    map.setCenter(location);
                    
                    // Search for cafes near this location
                    searchCafesNearby(location);
                } else {
                    console.error("Geocoding failed with status:", response.status);
                    
                    // Fallback to a hardcoded location based on the search input
                    alert("Geocoding service failed. Using approximate location instead.");
                    const fallbackLocation = approximateLocation(input);
                    map.setCenter(fallbackLocation);
                    searchCafesNearby(fallbackLocation);
                }
            })
            .catch(error => {
                console.error("Geocoding error:", error);
                alert("Error with geocoding service. Please try again later.");
            });
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Error with geocoding service. Please try again later.");
        }
    } catch (error) {
        console.error("Search error:", error);
        alert("An error occurred while searching. Please try again.");
    }
}

// Simple function to provide approximate coordinates for common locations
// This is a fallback when geocoding fails
function approximateLocation(input) {
    const lowercaseInput = input.toLowerCase();
    
    // Very basic mapping of some major cities
    const locations = {
        "new york": { lat: 40.7128, lng: -74.0060 },
        "los angeles": { lat: 34.0522, lng: -118.2437 },
        "chicago": { lat: 41.8781, lng: -87.6298 },
        "houston": { lat: 29.7604, lng: -95.3698 },
        "phoenix": { lat: 33.4484, lng: -112.0740 },
        "philadelphia": { lat: 39.9526, lng: -75.1652 },
        "san antonio": { lat: 29.4241, lng: -98.4936 },
        "san diego": { lat: 32.7157, lng: -117.1611 },
        "dallas": { lat: 32.7767, lng: -96.7970 },
        "san francisco": { lat: 37.7749, lng: -122.4194 },
        "london": { lat: 51.5074, lng: -0.1278 },
        "paris": { lat: 48.8566, lng: 2.3522 },
        "tokyo": { lat: 35.6762, lng: 139.6503 },
        "sydney": { lat: -33.8688, lng: 151.2093 },
    };
    
    // Try to find a match in our simple database
    for (const city in locations) {
        if (lowercaseInput.includes(city)) {
            return locations[city];
        }
    }
    
    // Default to San Francisco if no match
    console.log("No location match found, using default location");
    return { lat: 37.7749, lng: -122.4194 };
}

// Search for cafes near a specific location
function searchCafesNearby(location) {
    // Clear previous markers
    clearMarkers();
    
    // Show loading indicator
    document.getElementById("places-list").innerHTML = "<p>Searching for cafes...</p>";
    
    try {
        // Define search request parameters
        const params = {
            location: `${location.lat},${location.lng}`,
            radius: 1500, // Search within 1500 meters
            keyword: "cafe coffee",
            type: "cafe" // The API expects a single type, not an array
        };
        
        console.log("Searching with params:", params);
        
        // Perform nearby search with our secure API
        SecureAPI.nearbySearch(params)
            .then(response => {
                console.log("Search status:", response.status);
                console.log("Results:", response.results);
                
                if (response.status === "OK" && response.results && response.results.length > 0) {
                    // Display results on map and in list
                    displayResults(response.results);
                } else if (response.status === "ZERO_RESULTS") {
                    // Try searching for restaurants that might be cafes
                    searchWithType("restaurant");
                } else {
                    // Try using textSearch as a fallback
                    searchWithTextSearch(location);
                }
            })
            .catch(error => {
                console.error("Error in nearbySearch call:", error);
                searchWithTextSearch(location);
            });
    } catch (error) {
        console.error("Error in searchCafesNearby:", error);
        document.getElementById("places-list").innerHTML = 
            "<p>An error occurred while searching. Please try again.</p>";
    }
}

// Handle search results and try alternative search if needed
function handleSearchResults(results, status) {
    console.log("Search status:", status);
    console.log("Results:", results);
    
    if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        // Display results on map and in list
        displayResults(results);
    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        // Try searching for restaurants that might be cafes
        searchWithType("restaurant");
    } else {
        // Try using textSearch as a fallback
        searchWithTextSearch(map.getCenter());
    }
}

// Search with a different type
function searchWithType(typeValue) {
    console.log("Trying search with type:", typeValue);
    const center = map.getCenter();
    const params = {
        location: `${center.lat()},${center.lng()}`,
        radius: 2000,
        keyword: "coffee cafe",
        type: typeValue
    };
    
    SecureAPI.nearbySearch(params)
        .then(response => {
            console.log(`${typeValue} search status:`, response.status);
            console.log(`${typeValue} results:`, response.results);
            
            if (response.status === "OK" && response.results && response.results.length > 0) {
                displayResults(response.results);
            } else {
                // Try textSearch as a last resort
                searchWithTextSearch(center);
            }
        })
        .catch(error => {
            console.error(`Error in ${typeValue} search:`, error);
            searchWithTextSearch(center);
        });
}

// Use textSearch as a fallback
function searchWithTextSearch(location) {
    console.log("Trying textSearch as fallback");
    
    // Convert location to string if it's a LatLng object
    let locationStr;
    if (typeof location.lat === 'function') {
        locationStr = `${location.lat()},${location.lng()}`;
    } else {
        locationStr = `${location.lat},${location.lng}`;
    }
    
    const params = {
        location: locationStr,
        radius: 2500,
        query: "coffee cafe"
    };
    
    try {
        SecureAPI.textSearch(params)
            .then(response => {
                console.log("Text search status:", response.status);
                console.log("Text search results:", response.results);
                
                if (response.status === "OK" && response.results && response.results.length > 0) {
                    displayResults(response.results);
                } else {
                    document.getElementById("places-list").innerHTML = 
                        "<p>No cafes found nearby. Try a different location or search term.</p>";
                }
            })
            .catch(error => {
                console.error("Error in textSearch:", error);
                document.getElementById("places-list").innerHTML = 
                    "<p>No cafes found nearby. Try a different location or search term.</p>";
            });
    } catch (error) {
        console.error("Error in textSearch:", error);
        document.getElementById("places-list").innerHTML = 
            "<p>No cafes found nearby. Try a different location or search term.</p>";
    }
}

// Helper function to create a custom user location marker element
function createUserLocationMarker() {
    const markerElement = document.createElement('div');
    markerElement.style.width = '20px';
    markerElement.style.height = '20px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.backgroundColor = '#4285F4';
    markerElement.style.border = '2px solid white';
    markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    return markerElement;
}

// Helper function to create a custom cafe marker element
function createCafeMarker(name) {
    const markerElement = document.createElement('div');
    markerElement.className = 'cafe-marker';
    markerElement.style.backgroundColor = 'white';
    markerElement.style.border = '1px solid #ccc';
    markerElement.style.borderRadius = '4px';
    markerElement.style.padding = '6px 8px';
    markerElement.style.fontSize = '14px';
    markerElement.style.fontWeight = 'bold';
    markerElement.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    markerElement.style.minWidth = '50px';
    markerElement.style.textAlign = 'center';
    markerElement.innerHTML = `<span style="color:#D4582B;">☕</span> ${name.length > 15 ? name.substring(0, 15) + '...' : name}`;
    return markerElement;
}

// Display search results on map and in list
function displayResults(places) {
    const placesList = document.getElementById("places-list");
    placesList.innerHTML = ""; // Clear previous results
    
    console.log(`Found ${places.length} places before filtering`);
    
    // Filter results to prioritize actual cafes
    const filteredPlaces = places.filter(place => {
        // Check if types include cafe or if name/vicinity contains cafe-related keywords
        const hasCafeType = place.types && place.types.includes("cafe");
        const nameHasCafe = place.name && place.name.toLowerCase().match(/cafe|coffee|espresso|tea|bakery/);
        const vicinityHasCafe = place.vicinity && place.vicinity.toLowerCase().match(/cafe|coffee|espresso|tea|bakery/);
        
        return hasCafeType || nameHasCafe || vicinityHasCafe;
    });
    
    console.log(`Filtered to ${filteredPlaces.length} cafe-related places`);
    
    // Use filtered results if available, otherwise use all places
    const displayPlaces = filteredPlaces.length > 0 ? filteredPlaces : places;
    
    // Add each place to the map and list
    displayPlaces.forEach((place) => {
        let marker;
        
        try {
            // Try to use AdvancedMarkerElement if available (newer API)
            if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
                marker = new google.maps.marker.AdvancedMarkerElement({
                    map: map,
                    position: place.geometry.location,
                    title: place.name,
                    content: createCafeMarker(place.name)
                });
            } else {
                // Fall back to legacy Marker
                marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location,
                    title: place.name,
                });
            }
        } catch (error) {
            console.error("Error creating place marker:", error);
            // Simplified fallback marker
            marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: place.name,
            });
        }
        
        markers.push(marker);
        
        // Add click event to marker
        marker.addListener("click", () => {
            getPlaceDetails(place.place_id, marker);
        });
        
        // Create list item for this place
        const placeItem = document.createElement("div");
        placeItem.className = "place-item";
        placeItem.addEventListener("click", () => {
            getPlaceDetails(place.place_id, marker);
            map.setCenter(place.geometry.location);
        });
        
        // Add place name
        const placeName = document.createElement("div");
        placeName.className = "place-name";
        placeName.textContent = place.name;
        placeItem.appendChild(placeName);
        
        // Add place address if available
        if (place.vicinity) {
            const placeAddress = document.createElement("div");
            placeAddress.className = "place-address";
            placeAddress.textContent = place.vicinity;
            placeItem.appendChild(placeAddress);
        }
        
        // Add place rating if available
        if (place.rating) {
            const placeRating = document.createElement("div");
            placeRating.className = "place-rating";
            placeRating.textContent = `Rating: ${place.rating} ⭐ (${place.user_ratings_total || 0} reviews)`;
            placeItem.appendChild(placeRating);
        }
        
        placesList.appendChild(placeItem);
    });
    
    // Adjust map bounds to show all markers
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach((marker) => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
    }
}

// Get and display detailed information about a place
function getPlaceDetails(placeId, marker) {
    const params = {
        place_id: placeId,
        fields: "name,formatted_address,website,formatted_phone_number,opening_hours,rating,reviews"
    };
    
    SecureAPI.getPlaceDetails(params)
        .then(response => {
            if (response.status === "OK" && response.result) {
                const place = response.result;
                
                // Create content for info window
                let content = `<div class="info-window">
                    <h3>${place.name}</h3>
                    <p>${place.formatted_address || ""}</p>`;
                
                if (place.formatted_phone_number) {
                    content += `<p>Phone: ${place.formatted_phone_number}</p>`;
                }
                
                if (place.website) {
                    content += `<p><a href="${place.website}" target="_blank">Website</a></p>`;
                }
                
                if (place.rating) {
                    content += `<p>Rating: ${place.rating} ⭐</p>`;
                }
                
                if (place.opening_hours && place.opening_hours.weekday_text) {
                    content += `<p>Hours:<br>${place.opening_hours.weekday_text.join("<br>")}</p>`;
                }
                
                content += `</div>`;
                
                // Open info window at marker position
                infowindow.setContent(content);
                infowindow.open(map, marker);
            } else {
                console.error("Error getting place details:", response.status);
                infowindow.setContent("<div class='info-window'><p>Error loading place details</p></div>");
                infowindow.open(map, marker);
            }
        })
        .catch(error => {
            console.error("Error getting place details:", error);
            infowindow.setContent("<div class='info-window'><p>Error loading place details</p></div>");
            infowindow.open(map, marker);
        });
}

// Clear all markers from the map
function clearMarkers() {
    markers.forEach((marker) => marker.setMap(null));
    markers = [];
}
