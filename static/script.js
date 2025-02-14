// Handling file upload and preview
const fileInput = document.getElementById('fileInput'); // Input element for file selection
const imagePreview = document.getElementById('imagePreview'); // Element to display the selected image preview
const uploadForm = document.getElementById('uploadForm'); // Form element for uploading images
const uploadedImage = document.getElementById('uploadedImage'); // Element to display the uploaded image
const predictionResult = document.getElementById('predictionResult'); // Element to show the prediction result
const binContainer = document.getElementById('binimg'); // Container for displaying the correct waste bin
const recycleBin = document.getElementById('recycleBin'); // Element for recyclable bin
const hazardousBin = document.getElementById('hazardousBin'); // Element for hazardous bin
const foodWasteBin = document.getElementById('foodWasteBin'); // Element for food waste bin
const creativityButton = document.getElementById('creativity'); // Button to fetch creative suggestions
const creativitySuggestions = document.getElementById('creativitySuggestions'); // Container for creativity suggestions
const suggestionList = document.getElementById('suggestionList'); // List to display creativity suggestions
const ytlink = document.getElementById("ytlink"); // Button for fetching YouTube links

// Event listener for file input change
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the file
        reader.onload = (e) => {
            imagePreview.src = e.target.result; // Set the image preview source
            imagePreview.style.display = 'block'; // Show the image preview
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

// Event listener for form submission
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(uploadForm); // Create FormData object from form
    const response = await fetch('/predict', { // Send POST request to /predict
        method: 'POST',
        body: formData
    });
    const data = await response.json(); // Parse the JSON response
    displayPrediction(data); // Display the prediction result
});

// Function to display prediction result
function displayPrediction(data) {
    const resm = document.getElementById('resm'); // Element to reveal prediction section
    resm.removeAttribute('hidden'); // Show the prediction section

    // Show the uploaded image
    uploadedImage.src = imagePreview.src; // Use the preview image source
    uploadedImage.style.display = 'block'; // Display the uploaded image

    // Display the prediction result
    predictionResult.textContent = data.result; // Set the prediction text
    document.getElementById("feedback").hidden = false; // Show feedback section

    // Show the correct bin section based on the prediction
    binContainer.removeAttribute('hidden'); // Make the bin container visible

    // Set up waste categorization
    const recycle_bin = document.getElementById('recycle'); // Element for recycling bin interaction
    recycle_bin.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default action
        creativityButton.hidden = true; // Hide the creativity button

        const wasteType = data.result.split(' ')[2].toLowerCase(); // Extract waste type from result
        // Hide all bins initially
        recycleBin.style.display = 'none';
        hazardousBin.style.display = 'none';
        foodWasteBin.style.display = 'none';

        // Show the appropriate bin based on waste type
        const recyclableItems = ["metal", "paper", "plastic", "glass", "cardboard"];
        if (recyclableItems.includes(wasteType)) {
            recycleBin.style.display = 'flex'; // Show recycle bin
        } else if (wasteType === "battery") {
            hazardousBin.style.display = 'flex'; // Show hazardous bin
        } else if (wasteType === "food_waste") {
            foodWasteBin.style.display = 'flex'; // Show food waste bin
        }
    });
    const loc=document.getElementById('floatingMapContainer');
    loc.removeAttribute('hidden');
}

// Camera capture functionality
const startCameraButton = document.getElementById('startCamera'); // Button to start the camera
const video = document.getElementById('video'); // Video element for camera feed
const canvas = document.getElementById('canvas'); // Canvas element for captured image
const captureButton = document.getElementById('capture'); // Button to capture the image
const predictCameraButton = document.getElementById('predictCamera'); // Button to predict from camera image

// Start the camera when the start button is clicked
startCameraButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // Access camera stream
        video.srcObject = stream; // Set video source to camera stream
        video.style.display = 'block'; // Display the video feed
        captureButton.style.display = 'inline-block'; // Show capture button
        predictCameraButton.style.display = 'inline-block'; // Show predict button
    } catch (error) {
        console.error('Error accessing camera:', error); // Log camera error
    }
});

// Capture image from video stream and display on canvas
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d'); // Get canvas drawing context
    canvas.width = video.videoWidth; // Set canvas width
    canvas.height = video.videoHeight; // Set canvas height
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame on canvas
    canvas.style.display = 'block'; // Show canvas
    video.style.display = 'none'; // Hide video after capture
});

// Handle prediction from camera image
predictCameraButton.addEventListener('click', async () => {
    // Convert canvas image to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

    // Display the captured image in the uploadedImage element
    uploadedImage.src = canvas.toDataURL('image/jpeg'); // Set uploaded image source
    uploadedImage.style.display = 'block'; // Display the captured image

    // Send image blob to server for prediction
    const formData = new FormData();
    formData.append('file', blob, 'capture.jpg'); // Append image blob to FormData

    try {
        const response = await fetch('/predict', { // Send POST request to /predict
            method: 'POST',
            body: formData
        });
        const data = await response.json(); // Parse the JSON response

        // Display prediction result
        displayPrediction(data);
    } catch (error) {
        console.error('Error during prediction:', error); // Log prediction error
    }
});

// Fetch creativity ideas dynamically
creativityButton.addEventListener('click', async () => {
    const wasteType = predictionResult.textContent.split(' ')[2].toLowerCase(); // Extract waste type
    console.log("Sending waste type to backend:", wasteType);
    ytlink.removeAttribute('hidden'); // Show YouTube link button
    try {
        const response = await fetch('/suggestions', { // Send POST request to /suggestions
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wasteType: wasteType }) // Send waste type in request body
        });
        console.log("Received response:", response);

        const data = await response.json(); // Parse the JSON response
        console.log("Generated ideas:", data);

        if (data.ideas) {
            const ideas = data.ideas.split('\n'); // Split ideas into an array
            suggestionList.innerHTML = ''; // Clear previous suggestions
            ideas.forEach(idea => {
                const li = document.createElement('li'); // Create list item for each idea
                li.textContent = idea; // Set list item text
                suggestionList.appendChild(li); // Append list item to suggestion list
            });
            ytSuggestions.setAttribute('hidden', ''); // Hide YouTube suggestions
            creativitySuggestions.removeAttribute('hidden'); // Show creativity suggestions
        } else {
            console.error("No ideas found in response."); // Log missing ideas
        }
    } catch (error) {
        console.error("Error during suggestion generation:", error); // Log error
    }
});

// Fetch YouTube links dynamically
ytlink.addEventListener('click', async () => {
    const wasteType = predictionResult.textContent.split(' ')[2].toLowerCase(); // Extract waste type
    console.log("Sending waste type to backend:", wasteType);
    ytlink.removeAttribute('hidden'); // Show YouTube link button
    try {
        const response = await fetch('/ytsuggestions', { // Send POST request to /ytsuggestions
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wasteType: wasteType }) // Send waste type in request body
        });
        console.log("Received response:", response);

        const data = await response.json(); // Parse the JSON response
        console.log("Generated links:", data);

        if (data.links) {
            const links = data.links.split('\n'); // Split links into an array
            ytList.innerHTML = ''; // Clear previous links
            links.forEach(link => {
                const li = document.createElement('li'); // Create list item for each link
                const a = document.createElement('a'); // Create anchor element for link
                a.textContent = link; // Set anchor text
                a.href = link; // Set anchor href
                li.appendChild(a); // Append anchor to list item
                ytList.appendChild(li); // Append list item to YouTube list
            });
            creativitySuggestions.setAttribute('hidden', ''); // Hide creativity suggestions
            ytSuggestions.removeAttribute('hidden'); // Show YouTube suggestions
        } else {
            console.error("No links found in response."); // Log missing links
        }
    } catch (error) {
        console.error("Error during YouTube link generation:", error); // Log error
    }
});
