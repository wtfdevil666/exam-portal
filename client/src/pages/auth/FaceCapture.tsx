import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); 
  const [isDetecting, setIsDetecting] = useState<boolean>(false); 
  const [detectionMessage, setDetectionMessage] = useState<string>(''); 

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc); 
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setShowModal(false); 
  };

  const submitImage = async () => {
    if (!capturedImage) return;

    setShowModal(true); 
    setIsDetecting(true); 
    
    try {
      const res = await axios.post('http://127.0.0.1:5000/detect_face', { image: capturedImage });

      if (res.data.faceDetected) {
        setDetectionMessage('Face detected successfully.');
      } else {
        setDetectionMessage('No face detected. Please retake the photo.');
      }
    } catch (error) {
      console.error('Face detection failed:', error);
      setDetectionMessage('Error detecting face. Please try again.');
    }

    setIsDetecting(false); 
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Capture Your Face</h2>
        
        {!capturedImage ? (
          <div className="flex flex-col items-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg mb-4 w-full"
              videoConstraints={{
                facingMode: "user", 
              }}
            />
            <button
              onClick={captureImage}
              className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition duration-200"
            >
              Capture Photo
            </button>
          </div>
        ) : (
        <div className="flex flex-col items-center">
            <img src={capturedImage} alt="Captured face" className="rounded-lg mb-4 w-full object-cover" />
            
            <div className="flex gap-4 w-full">
                <button
                onClick={retakeImage}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md flex-1 hover:bg-yellow-600 transition duration-200"
                >
                Retake Photo
                </button>
                
                <button
                onClick={submitImage}
                className="bg-green-500 text-white py-2 px-4 rounded-md flex-1 hover:bg-green-600 transition duration-200"
                >
                Submit Photo
                </button>
            </div>
        </div>
        )}
        
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4">
                {isDetecting ? 'Detecting...' : 'Detection Complete'}
              </h3>
              <p>{detectionMessage}</p>
              {!isDetecting && (
                <div className="mt-4">
                  {detectionMessage === 'Face detected successfully.' ? (
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={retakeImage}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200"
                    >
                      Retake Photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceCapture;
