let map; // Variable to store the Google Map object
let currentPositionMarker; // Marker to represent the user's current location

// Get the elements
const toggleMapBtn = document.getElementById("toggleMapBtn"); // Button to toggle map visibility
const floatingMap = document.getElementById("floatingMap"); // Container for the floating map

// Toggle map visibility when the button is clicked
toggleMapBtn.addEventListener("click", () => {
    if (floatingMap.classList.contains("hidden")) {
        // Show the map if it's currently hidden
        floatingMap.classList.remove("hidden");
        floatingMap.style.display = "block"; // Make the map visible
        initMap(); // Initialize the map
    } else {
        // Hide the map if it's currently visible
        floatingMap.classList.add("hidden");
        floatingMap.style.display = "none"; // Make the map invisible
    }
});

// Function to initialize the map with a default location
function initMap() {
    const defaultLocation = { lat: 22.5726, lng: 88.3639 }; // Default location: Kolkata
    if (!map) {
        // Create a new map instance only if it hasn't been created yet
        map = new google.maps.Map(document.getElementById("map"), {
            center: defaultLocation, // Set default center
            zoom: 12, // Default zoom level
        });
        alert("Click the location button to find recycling centers near you!"); // Inform the user
        findCurrentLocation(); // Automatically try to find the user's location
    }
}

// Function to find and show the user's current location
function findCurrentLocation() {
    if (navigator.geolocation) {
        // Check if geolocation is supported by the browser
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Successfully retrieved user's location
                const userLocation = {
                    lat: position.coords.latitude, // Latitude of user's location
                    lng: position.coords.longitude, // Longitude of user's location
                };

                // Center the map on the user's location
                map.setCenter(userLocation);

                // Remove the existing marker if present
                if (currentPositionMarker) {
                    currentPositionMarker.setMap(null);
                }

                // Add a marker for the user's location
                currentPositionMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Your Location", // Tooltip text for the marker
                });

                // Find nearby recycling facilities
                findRecyclingFacilities(userLocation);
            },
            () => {
                // Error handling for location retrieval failure
                alert("Unable to retrieve your location. Please ensure location services are enabled.");
            }
        );
    } else {
        // Geolocation is not supported by the browser
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to find recycling facilities nearby using the Places API
function findRecyclingFacilities(location) {
    const service = new google.maps.places.PlacesService(map); // Create a new PlacesService instance
    const request = {
        location: location, // User's location as the center
        radius: 5000, // Search radius in meters (5 km)
        keyword: "recycling center", // Keyword for search
    };

    // Perform a nearby search
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // If the search is successful, add a marker for each result
            results.forEach((place) => {
                addMarkerWithInfo(place);
            });
        } else {
            // No recycling facilities found or an error occurred
            alert("No recycling facilities found nearby. Please try again later.");
        }
    });
}

// Function to add a marker with hover and click functionality
function addMarkerWithInfo(place) {
    const marker = new google.maps.Marker({
        position: place.geometry.location, // Location of the recycling facility
        map: map, // The map instance to place the marker on
        title: place.name, // Tooltip text for the marker
    });

    // Create an InfoWindow to display information about the recycling facility
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div>
                <strong>${place.name}</strong><br> <!-- Facility name -->
                ${place.vicinity || "Address not available"}<br> <!-- Facility address -->
                <a href="https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">
                    View on Google Maps
                </a> <!-- Link to open the facility on Google Maps -->
            </div>
        `,
    });

    // Show the InfoWindow when the marker is clicked
    marker.addListener("click", () => {
        infoWindow.open(map, marker); // Open the InfoWindow for the clicked marker
    });
}
