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


# Path to Tesseract executable (adjust based on your system installation)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


@app.route("/detect", methods=["POST"])
def detect():
    try:
        print("Received request")


        # Get the uploaded image
        file = request.files.get("image")
        if not file:
            return jsonify({"error": "No image provided"}), 400


        print("Image received")
        img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)


        print("Running YOLO detection")
        results = model(img, conf=0.5)  # Adjust confidence threshold as needed


        # Ensure results are valid
        if not results or not results[0].boxes:
            print("No detections found")
            return jsonify({"processed_image": None, "detections": [], "detected_word": ""})


        detections = []
        letter_images = []  # To store cropped letter images
        bounding_boxes = []  # To store bounding boxes for sorting


        # Extract bounding boxes and crop ROIs
        for box in results[0].boxes:
            try:
                coords = box.xyxy[0].tolist()  # Get x1, y1, x2, y2
                conf = box.conf[0].item()  # Confidence score
                cls = int(box.cls[0].item())  # Class index
                label = f"{model.names[cls]} ({conf:.2f})"


                # Append detection details
                detections.append({"label": label, "confidence": conf, "coordinates": coords})


                # Extract ROI
                x1, y1, x2, y2 = map(int, coords)


                # Add padding around the bounding box
                padding = 5
                x1 = max(0, x1 - padding)
                y1 = max(0, y1 - padding)
                x2 = min(img.shape[1], x2 + padding)
                y2 = min(img.shape[0], y2 + padding)


                roi = img[y1:y2, x1:x2]


                # Preprocess ROI for better OCR
                gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
                blurred = cv2.bilateralFilter(gray, 9, 75, 75)  # Retain edges while reducing noise
                thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                               cv2.THRESH_BINARY, 11, 2)


                # Enhance text visibility
                processed = cv2.equalizeHist(thresh)
                kernel = np.ones((2, 2), np.uint8)
                processed = cv2.morphologyEx(processed, cv2.MORPH_CLOSE, kernel)


                # Resize the ROI to improve OCR accuracy
                resized = cv2.resize(processed, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)


                # Append preprocessed ROI for OCR
                letter_images.append(resized)
                bounding_boxes.append((x1, y1, x2, y2))


                # Draw the bounding box and label on the image
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)


            except Exception as e:
                print(f"Error processing box: {e}")


        # Perform OCR on each ROI and combine letters to form a word
        detected_word = ""
        if letter_images:
            # Sort bounding boxes strictly left-to-right, top-to-bottom
            sorted_indices = sorted(
                range(len(bounding_boxes)),
                key=lambda i: (bounding_boxes[i][1], bounding_boxes[i][0])  # Sort by y1, then x1
            )


            for idx in sorted_indices:
                roi = letter_images[idx]
               
                # Additional preprocessing for better OCR
                kernel = np.ones((1, 1), np.uint8)
                processed_roi = cv2.dilate(roi, kernel, iterations=1)  # Slightly enlarge characters


                # Apply OCR to extract letters with better configuration
                text = pytesseract.image_to_string(
                    processed_roi, config="--psm 10 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                ).strip()
                print(f"Detected letter: {text}")
                detected_word += text


        # Remove non-alphabetic characters from the word
        detected_word = re.sub(r'[^A-Za-z]', '', detected_word)
        print(f"Detected word: {detected_word}")


        # Encode the processed image to base64
        _, buffer = cv2.imencode('.jpg', img)
        encoded_image = base64.b64encode(buffer).decode('utf-8')


        print("Returning processed image and detected word")
        return jsonify({"processed_image": encoded_image, "detections": detections, "detected_word": detected_word})


    except Exception as e:
        print(f"Error during detection: {e}")
        return jsonify({"error": str(e)}), 500




if __name__ == "__main__":
    app.run(port=5001)