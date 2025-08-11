from flask import Flask, render_template, request, jsonify  # Import necessary Flask modules
import os  # For file and directory operations
import numpy as np  # For numerical computations
import tensorflow as tf  # For TensorFlow operations
from tensorflow.keras.models import load_model  # For loading the trained model
import backend as bk  # Import custom backend functions

# Initialize Flask app with template and static folder configurations
app = Flask(__name__, template_folder='templates', static_folder='static')

# Load the pre-trained model
model = load_model(r'C:\Users\rohit\Desktop\image_classifier_server\Image_classifier.keras')

# Categories corresponding to the model's output labels
data_cat = ['battery', 'cardboard', 'food_waste', 'glass', 'metal', 'paper', 'plastic']

# Directory to save uploaded images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create directory if it doesn't exist

# Directory to save incorrect prediction feedback images
WRONG_FOLDER = 'feedback_data'
os.makedirs(WRONG_FOLDER, exist_ok=True)  # Create directory if it doesn't exist

# Set image dimensions for model input
img_height = 180
img_width = 180

# Route for the home page
@app.route('/')
def index():
    return render_template('index.html')  # Render the main HTML page

# Route for predicting the waste type
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:  # Check if file is part of the request
        return jsonify({'result': 'No file part'})  # Return error if no file is provided

    file = request.files['file']  # Get the file from the request
    if file.filename == '':  # Check if a filename is provided
        return jsonify({'result': 'No selected file'})  # Return error if no file is selected

    # Save the uploaded file to the upload directory
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Load and preprocess the image for the model
    image_load = tf.keras.utils.load_img(filepath, target_size=(img_height, img_width))  # Resize image
    img_arr = tf.keras.utils.img_to_array(image_load)  # Convert image to array format
    img_bat = np.expand_dims(img_arr, axis=0)  # Add batch dimension for model compatibility

    # Perform prediction using the model
    predict = model.predict(img_bat)
    score = tf.nn.softmax(predict)  # Convert logits to probabilities

    # Determine the predicted class and its accuracy
    predicted_class = data_cat[np.argmax(score)]  # Map model output to category
    accuracy = np.max(score) * 100  # Get the highest probability

    # Return the prediction result as JSON
    result = f'Image is {predicted_class} with accuracy of {accuracy:.2f}%'
    return jsonify({'result': result, 'predicted_class': predicted_class})

# Route for generating creative art and craft suggestions
@app.route('/suggestions', methods=['POST'])
def suggestions():
    # Retrieve the predicted waste type from the request
    predicted_class = request.json.get('wasteType', None)  # Extract "wasteType" from request JSON
     
    if not predicted_class:  # Check if waste type is provided
        return jsonify({'error': 'Waste type not provided'}), 400  # Return error if not provided

    # Call backend function to generate suggestions based on predicted class
    output = bk.get_text_output(predicted_class+"from this which creativity art and craft we can do")
    
    # Return the suggestions as JSON
    return jsonify({'ideas': output})

# Route for generating YouTube suggestions
@app.route('/ytsuggestions', methods=['POST'])
def ytsuggestions():
    # Retrieve the predicted waste type from the request
    predicted_class = request.json.get('wasteType', None)  # Extract "wasteType" from request JSON
     
    if not predicted_class:  # Check if waste type is provided
        return jsonify({'error': 'Waste type not provided'}), 400  # Return error if not provided

    # Try to fetch YouTube links for creative projects
    try:
        output = bk.get_text_output(f"Find YouTube links for creative art and craft projects using {predicted_class}") 
    except Exception as e:  # Handle any errors during the process
        print(f"Error in get_text_output: {e}")  # Log the error
        return jsonify({'error': 'Failed to generate YouTube links'}), 500  # Return error response

    # Return the generated YouTube links as JSON
    return jsonify({'links': output})

# Route for handling incorrect predictions and feedback
@app.route('/feedback2', methods=['POST'])
def feedback2():
    try:
        file = request.files.get('file')  # Retrieve file from the request
        if file:  # Check if file is uploaded
            filepath = os.path.join(WRONG_FOLDER, file.filename)  # Define path to save file
            file.save(filepath)  # Save file to the feedback directory
            return jsonify({'message': 'Thank you for your feedback!'}), 200  # Acknowledge feedback
        else:  # Handle case where no file is uploaded
            return jsonify({'message': 'No file uploaded!'}), 400  # Return error response
    except Exception as e:  # Handle any exceptions
        return jsonify({'error': str(e)}), 500  # Return error details as JSON
    

    

# Run the Flask app in debug mode
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
