from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np
import pytesseract
import base64
import re

# Load YOLOv8 model
model = YOLO("best_model.pt")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Path to Tesseract executable (adjust based on your system)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

@app.route("/detect", methods=["POST"])
def detect():
    try:
        file = request.files.get("image")
        if not file:
            return jsonify({"error": "No image provided"}), 400

        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        results = model(img, conf=0.5)

        if not results or not results[0].boxes:
            return jsonify({"processed_image": None, "detections": [], "detected_word": ""})

        detections = []
        detected_word = ""
        for box in results[0].boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            roi = img[y1:y2, x1:x2]
            gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                           cv2.THRESH_BINARY, 11, 2)
            text = pytesseract.image_to_string(thresh, config="--psm 10").strip()
            detected_word += re.sub(r'[^A-Za-z]', '', text)

            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', img)
        encoded_image = base64.b64encode(buffer).decode('utf-8')

        return jsonify({"processed_image": encoded_image, "detections": detections, "detected_word": detected_word})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001)
