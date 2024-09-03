import mediapipe as mp
import cv2
from flask import Flask, jsonify, request
import numpy as np

app = Flask(__name__)

mp_face_detect = mp.solutions.face_detection
face_detect = mp_face_detect.FaceDetection(model_selection=1, min_detection_confidence=0.65)

@app.route('/detect_face', methods=['POST'])
def detect_faces():
    if 'image' not in request.files:
        return jsonify({'result': False, 'message': "Image not given!"})
    
    image_file = request.files['image']
    file_bytes = np.frombuffer(image_file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'result': False, 'message': "Image processing failed!"})
    
    results = face_detect.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    if results.detections and len(results.detections) == 1:
        return jsonify({'result': True})
    else:
        return jsonify({'result': False, 'message': "Warning!"})

if __name__ == '__main__':
    app.run()