from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import torch
import pytesseract
import base64

app = Flask(__name__)
CORS(app)

# Initialize YOLOv8 model
model = torch.hub.load('ultralytics/yolov5', 'yolov8')  # Update to YOLOv8 path if required

# Set Tesseract executable path (if not in PATH)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Adjust for your system


@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Load image from request
        image_data = request.files['image'].read()
        np_img = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        # YOLOv8 Object Detection
        results = model(img)
        detections = results.xyxy[0].numpy()  # [x1, y1, x2, y2, conf, class]

        print(f"YOLOv8 Detections: {detections}")  # Debugging line

        # Perform OCR on detected regions
        annotated_img = img.copy()
        recognized_texts = []
        for detection in detections:
            x1, y1, x2, y2, conf, cls = detection
            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])

            # Crop detected region
            cropped_img = img[y1:y2, x1:x2]
            if cropped_img.size == 0:  # Skip invalid regions
                continue

            # Use Tesseract OCR on cropped region
            ocr_result = pytesseract.image_to_string(cropped_img, lang='eng').strip()
            print(f"OCR Result for Region: {ocr_result}")  # Debugging line

            # Annotate image with YOLOv8 bounding box and OCR text
            cv2.rectangle(annotated_img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(annotated_img, ocr_result, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # Append results
            recognized_texts.append({"bbox": [x1, y1, x2, y2], "text": ocr_result})

        # Encode annotated image
        _, buffer = cv2.imencode('.jpg', annotated_img)
        encoded_image = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            "detected_texts": recognized_texts,
            "processed_image": encoded_image
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Failed to process image"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
