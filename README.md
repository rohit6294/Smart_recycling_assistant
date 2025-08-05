# ♻️ Smart Recycling Assistant

An integrated AI-powered web application that classifies waste items and offers personalized recycling and disposal recommendations. Developed using Python, Flask, and a custom-trained CNN model, this project aims to promote sustainable waste management practices.

---

## 🌟 Features

- ✅ **Waste Image Classification** – Identifies items like plastic bottles, cardboard, metal, and more using deep learning.
- 📍 **Geo-location Suggestions** – Helps users find the nearest recycling centers (future enhancement).
- 🔄 **Reusability Tips** – Offers creative suggestions for reusing recyclable items.
- 🚮 **Disposal Instructions** – Informs users whether an item should be pumped, dumped, or handled with care.
- 🧠 **AI-Powered Backend** – CNN model trained on a labeled image dataset to recognize recyclable items.

---

## 🧑‍💻 Tech Stack

| Technology | Description |
|------------|-------------|
| Python     | Backend logic & ML |
| Flask      | Web framework |
| HTML/CSS   | Frontend |
| JavaScript | Client-side interactions |
| CNN        | Custom-trained model |
| Jupyter Notebook | Model training & testing |

---

## 📁 Project Structure

smart-recycling-assistant/
│
├── model/
│ └── trained_model.h5
│
├── dataset/
│ ├── train/
│ │ ├── plastic_bottle/
│ │ └── cardboard/
│ └── test/
│ ├── plastic_bottle/
│ └── cardboard/
│
├── static/
│ ├── css/
│ └── images/
│
├── templates/
│ ├── index.html
│ └── result.html
│
├── app.py
├── utils.py
├── requirements.txt
└── README.md

yaml
Copy
Edit

---

## 🚀 How to Run the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohit6294/smart-recycling-assistant.git
   cd smart-recycling-assistant
Create a virtual environment

bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

bash
Copy
Edit
pip install -r requirements.txt
Run the Flask server

bash
Copy
Edit
python app.py
Open in browser

arduino
Copy
Edit
http://localhost:5000/
📊 Model Training Summary
Model Type: Convolutional Neural Network (CNN)

Framework: TensorFlow/Keras

Input Shape: 128x128 RGB

Classes: Plastic Bottle, Cardboard (expandable)

Accuracy Achieved: ~95% on validation set

🧠 Future Enhancements
🔍 Integrate Google Maps API to show nearest recycling centers

📱 Deploy as a mobile app using Flutter or React Native

🔔 Real-time alerts for improper waste disposal

🌐 Multi-language support

🗂️ Expand dataset with more categories

