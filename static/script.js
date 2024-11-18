
// Handling file upload and preview
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const uploadForm = document.getElementById('uploadForm');
const uploadedImage = document.getElementById('uploadedImage');
const predictionResult = document.getElementById('predictionResult');
const binContainer = document.getElementById('binimg');
const recycleBin = document.getElementById('recycleBin');
const hazardousBin = document.getElementById('hazardousBin');
const foodWasteBin = document.getElementById('foodWasteBin');
const creativityButton = document.getElementById('creativity');
const creativitySuggestions = document.getElementById('creativitySuggestions');
const suggestionList = document.getElementById('suggestionList');
const ytlink = document.getElementById("ytlink");

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(uploadForm);
    const response = await fetch('/predict', {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    displayPrediction(data);
});

function displayPrediction(data) {
    const resm = document.getElementById('resm');
    resm.removeAttribute('hidden');

    // Show the uploaded image
    uploadedImage.src = imagePreview.src; // Use the preview image source
    uploadedImage.style.display = 'block';

    // Display the prediction result
    predictionResult.textContent = data.result;

    // Show the correct bin section based on the prediction
    binContainer.removeAttribute('hidden');

    // Set up waste categorization
    const recycle_bin = document.getElementById('recycle');
    recycle_bin.addEventListener('click', async (event) => {
        event.preventDefault();
        creativityButton.hidden = true;

        const wasteType = data.result.split(' ')[2].toLowerCase(); // Extract waste type
        // Hide all bins initially
        recycleBin.style.display = 'none';
        hazardousBin.style.display = 'none';
        foodWasteBin.style.display = 'none';

        // Show the appropriate bin based on waste type
        const recyclableItems = ["metal", "paper", "plastic", "glass", "cardboard"];
        if (recyclableItems.includes(wasteType)) {
            recycleBin.style.display = 'flex';
        } else if (wasteType === "battery") {
            hazardousBin.style.display = 'flex';
        } else if (wasteType === "food_waste") {
            foodWasteBin.style.display = 'flex';
        }
    });
}

// Camera capture functionality
const startCameraButton = document.getElementById('startCamera');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const predictCameraButton = document.getElementById('predictCamera');

// Start the camera when the start button is clicked
startCameraButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = 'block';
        captureButton.style.display = 'inline-block';
        predictCameraButton.style.display = 'inline-block';
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
});

// Capture image from video stream and display on canvas
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.style.display = 'block';
    video.style.display = 'none';  // Hide the video after capture
});

// Handle prediction from camera image
predictCameraButton.addEventListener('click', async () => {
    // Convert canvas image to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

    // Display the captured image in the uploadedImage element
    uploadedImage.src = canvas.toDataURL('image/jpeg');
    uploadedImage.style.display = 'block';

    // Send image blob to server for prediction
    const formData = new FormData();
    formData.append('file', blob, 'capture.jpg');

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        // Display prediction result
        displayPrediction(data);
    } catch (error) {
        console.error('Error during prediction:', error);
    }
});

// Fetch creativity ideas dynamically
creativityButton.addEventListener('click', async () => {
    const wasteType = predictionResult.textContent.split(' ')[2].toLowerCase();
    console.log("Sending waste type to backend:", wasteType);
    ytlink.removeAttribute('hidden');
    try {
        const response = await fetch('/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wasteType: wasteType }) // Corrected key
        });
        console.log("Received response:", response);

        const data = await response.json();
        console.log("Generated ideas:", data);

        if (data.ideas) {
            const ideas = data.ideas.split('\n');
            suggestionList.innerHTML = '';
            ideas.forEach(idea => {
                const li = document.createElement('li');
                li.textContent = idea;
                suggestionList.appendChild(li);
            });
            ytSuggestions.setAttribute('hidden', '');
            creativitySuggestions.removeAttribute('hidden');
        } else {
            console.error("No ideas found in response.");
        }
    } catch (error) {
        console.error("Error during suggestion generation:", error);
    }
});
ytlink.addEventListener('click', async () => {
    const wasteType = predictionResult.textContent.split(' ')[2].toLowerCase();
    console.log("Sending waste type to backend:", wasteType);
    ytlink.removeAttribute('hidden');
    try {
        const response = await fetch('/ytsuggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wasteType: wasteType }) // Corrected key
        });
        console.log("Received response:", response);

        const data = await response.json();
        console.log("Generated links:", data);

        if (data.links) { // Use 'data.links' to access the links
            const links = data.links.split('\n');
            ytList.innerHTML = '';
            links.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a'); // Create an anchor element
                a.href = link; // Set the href to the link
                a.textContent = link; // Set the link text
                a.target = '_blank'; // Open in a new tab
                a.rel = 'noopener noreferrer'; // Add security attributes
                li.appendChild(a); // Append the anchor to the list item
                ytList.appendChild(li); // Append the list item to the list
            });
            creativitySuggestions.setAttribute('hidden', '');
            ytSuggestions.removeAttribute('hidden');
        } else {
            console.error("No links found in response.");
        }
    } catch (error) {
        console.error("Error during suggestion generation:", error);
    }
});



