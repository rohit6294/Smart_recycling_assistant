let map;
let currentPositionMarker;

// Get the elements
const toggleMapBtn = document.getElementById("toggleMapBtn");
const floatingMap = document.getElementById("floatingMap");

// Toggle map visibility when button is clicked
toggleMapBtn.addEventListener("click", () => {
    if (floatingMap.classList.contains("hidden")) {
        floatingMap.classList.remove("hidden");
        floatingMap.style.display = "block"; // Show the map
        initMap(); // Initialize the map
    } else {
        floatingMap.classList.add("hidden");
        floatingMap.style.display = "none"; // Hide the map
    }
});

// Initialize the map with a default location
function initMap() {
    const defaultLocation = { lat: 22.5726, lng: 88.3639 }; // Default: Kolkata
    if (!map) {
        map = new google.maps.Map(document.getElementById("map"), {
            center: defaultLocation,
            zoom: 12,
        });
        alert("Click the location button to find recycling centers near you!");
        findCurrentLocation(); // Automatically try to find current location
    }
}

// Function to find and show the user's current location
function findCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // Center the map on user's location
                map.setCenter(userLocation);

                // Add a marker for user's location
                if (currentPositionMarker) {
                    currentPositionMarker.setMap(null); // Remove existing marker
                }
                currentPositionMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "Your Location",
                });

                // Find nearby recycling facilities
                findRecyclingFacilities(userLocation);
            },
            () => {
                alert("Unable to retrieve your location. Please ensure location services are enabled.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Find recycling facilities nearby using Places API
function findRecyclingFacilities(location) {
    const service = new google.maps.places.PlacesService(map);
    const request = {
        location: location,
        radius: 5000, // 5 km radius
        keyword: "recycling center",
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                addMarkerWithInfo(place);
            });
        } else {
            alert("No recycling facilities found nearby. Please try again later.");
        }
    });
}
// Add a marker with hover and click functionality
function addMarkerWithInfo(place) {
    const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name, // Title shows on hover (optional, for browsers with native tooltips)
    });

    // Create an InfoWindow to display the address
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div>
                <strong>${place.name}</strong><br>
                ${place.vicinity || "Address not available"}
            </div>
        `,
    });

    // Show the InfoWindow when hovering over the marker
    marker.addListener("mouseover", () => {
        infoWindow.open(map, marker);
    });

    // Close the InfoWindow when the mouse leaves the marker
    marker.addListener("mouseout", () => {
        infoWindow.close();
    });

    // Redirect to Google Maps when the marker is clicked
    marker.addListener("click", () => {
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}`;
        window.open(googleMapsUrl, "_blank"); // Open in a new tab
    });
}


// Add a marker with an InfoWindow for the place
function addMarkerWithInfo(place) {
    const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div>
                <strong>${place.name}</strong><br>
                ${place.vicinity || "Address not available"}<br>
                <a href="https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}" target="_blank">
                    View on Google Maps
                </a>
            </div>
        `,
    });

    // Show the InfoWindow when the marker is clicked
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });
}
