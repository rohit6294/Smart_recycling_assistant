document.getElementById("feedbackNo").addEventListener("click", () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];  // Get the first selected file

    if (file) {
        // Send the image to the server when 'No' button is clicked
        const formData = new FormData();
        formData.append('file', file);  // Append the file

        fetch('/feedback2', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Thank you message
            location.reload();  // Refresh the page
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Hide feedback section and reset
    resetFeedbackSection();
});

document.getElementById("feedbackYes").addEventListener("click", () => {
    // Handle feedback submission for 'Yes' button
    alert('Thank you for your feedback!');
    resetFeedbackSection();  // Reset the feedback section
    location.reload();  // Refresh the page
});

// Utility function to reset the feedback section
function resetFeedbackSection() {
    document.getElementById("feedback").hidden = true;
    document.getElementById("uploadForm").reset();  // Reset form inputs
    document.getElementById("predictionResult").innerText = "";  // Clear the prediction result
}
