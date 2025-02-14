// Add an event listener to the "No" button
document.getElementById("feedbackNo").addEventListener("click", () => {
    const fileInput = document.getElementById('fileInput'); // Get the file input element
    const file = fileInput.files[0];  // Get the first selected file

    if (file) {
        // If a file is selected, prepare it to send to the server
        const formData = new FormData();
        formData.append('file', file);  // Append the file to the FormData object

        // Send the image file to the server via a POST request
        fetch('/feedback2', {
            method: 'POST', // HTTP method
            body: formData   // File data
        })
        .then(response => response.json()) // Parse the server's response as JSON
        .then(data => {
            alert(data.message);  // Display a thank-you message
            location.reload();  // Reload the page to reset the UI
        })
        .catch(error => {
            console.error('Error:', error);  // Log any errors to the console
        });
    }

    // Hide the feedback section and reset its state
    resetFeedbackSection();
});

// Add an event listener to the "Yes" button
document.getElementById("feedbackYes").addEventListener("click", () => {
    // Handle feedback submission when the "Yes" button is clicked
    alert('Thank you for your feedback!');  // Display a thank-you message
    resetFeedbackSection();  // Reset the feedback section
    location.reload();  // Reload the page to reset the UI
});

// Utility function to reset the feedback section
function resetFeedbackSection() {
    document.getElementById("feedback").hidden = true; // Hide the feedback section
    document.getElementById("uploadForm").reset();  // Reset the upload form inputs
    document.getElementById("predictionResult").innerText = "";  // Clear the prediction result text
}
