from flask import Flask, render_template, request, jsonify
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import backend as bk

app = Flask(__name__, template_folder='templates', static_folder='static')

# Load the model
model = load_model(r'C:\Users\rohit\Desktop\image_classifier_server\Image_classifier.keras')
data_cat = ['battery', 'cardboard', 'food_waste', 'glass', 'metal', 'paper', 'plastic']

# Directory to save uploaded images
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#directory to save wrong prediction images
WRONG_FOLDER = 'feedback_data\wrong_predictions'
os.makedirs(WRONG_FOLDER, exist_ok=True)

img_height = 180
img_width = 180

@app.route('/')
def index():
    return render_template('index.html')





@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'result': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'result': 'No selected file'})

    # Save the uploaded file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Load and preprocess the image
    image_load = tf.keras.utils.load_img(filepath, target_size=(img_height, img_width))
    img_arr = tf.keras.utils.img_to_array(image_load)  # Use img_to_array instead of array_to_img
    img_bat = np.expand_dims(img_arr, axis=0)  # Add batch dimension

    # Perform prediction
    predict = model.predict(img_bat)
    score = tf.nn.softmax(predict)

    # Get the prediction result
    predicted_class = data_cat[np.argmax(score)]
    accuracy = np.max(score) * 100

    result = f'Image is {predicted_class} with accuracy of {accuracy:.2f}%'
    return jsonify({'result': result, 'predicted_class': predicted_class})

@app.route('/suggestions', methods=['POST'])
def suggestions():
    # Retrieve the predicted waste type from the request
    predicted_class = request.json.get('wasteType', None)  # Corrected key to match JavaScript
     
    if not predicted_class:
        return jsonify({'error': 'Waste type not provided'}), 400

    # Generate creativity suggestions using the predicted class
    output = bk.get_text_output(predicted_class+"from this which creativity art and craft we can do")
    
    return jsonify({'ideas': output})

@app.route('/ytsuggestions', methods=['POST'])
def ytsuggestions():
    # Retrieve the predicted waste type from the request
    predicted_class = request.json.get('wasteType', None)  # Corrected key to match JavaScript
     
    if not predicted_class:
        return jsonify({'error': 'Waste type not provided'}), 400

    # Generate creativity suggestions using the predicted class
    try:
        output = bk.get_text_output(f"Find YouTube links for creative art and craft projects using {predicted_class}") 
    except Exception as e:
        print(f"Error in get_text_output: {e}")  # Log the error
        return jsonify({'error': 'Failed to generate YouTube links'}), 500

    return jsonify({'links': output})


@app.route('/feedback2', methods=['POST'])
def feedback2():
    try:
        file = request.files.get('file')
        if file:
            filepath = os.path.join(WRONG_FOLDER, file.filename)
            file.save(filepath)
            return jsonify({'message': 'Thank you for your feedback!'}), 200
        else:
            return jsonify({'message': 'No file uploaded!'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Send the error as JSON


if __name__ == '__main__':
    app.run(debug=True)
