import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url, model_url } from '../../config/config';


axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const FaceCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); 
  const [isDetecting, setIsDetecting] = useState<boolean>(false); 
  const [detectionMessage, setDetectionMessage] = useState<string>(''); 
  const [isVerified, setIsVerified] = useState<boolean>(false); 

  const location = useLocation();
  const formData = location.state?.formData;
  const navigate = useNavigate();

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc); 
      setIsVerified(false); 
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setShowModal(false); 
    setIsVerified(false); 
  };

  const verifyFace = async () => {
    if (!capturedImage) return;

    setIsDetecting(true);

    try {
      const byteString = atob(capturedImage.split(',')[1]);
      const mimeString = capturedImage.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const formData = new FormData();
      formData.append('image', blob, 'captured_face.jpg');

      const res = await axios.post(model_url+'/detect_face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.result) {
        setDetectionMessage('Face verified successfully.');
        setIsVerified(true); 
      } else {
        setDetectionMessage('No face detected. Please retake the photo.');
        setIsVerified(false); 
      }
    } catch (error) {
      console.error('Face verification failed:', error);
      setDetectionMessage('Error verifying face. Please try again.');
      setIsVerified(false); 
    }

    setIsDetecting(false);
    setShowModal(true); 
  };

  const submitImage = async () => {
    if (!capturedImage || !isVerified) return; 
  
    setIsDetecting(true); 
  
    try {
      const byteString = atob(capturedImage.split(',')[1]);
      const mimeString = capturedImage.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const image = new FormData();
      image.append('image', blob, 'captured_face.jpg');

      const res = await axios.post(backend_url+"/api/user/signup", {
        image,
        formData
      }, {withCredentials:true})
      
      if(res.status===200){
        navigate("/user/dashboard");
      }
      else{
        navigate("/signup");
      }

      
    } catch (error) {
      console.error('Submission failed:', error);
    }
  
    setIsDetecting(false);
    setShowModal(false); 
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
              style={{
                transform: 'scaleX(-1)', // Flip horizontally
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
            <img src={capturedImage} alt="Captured face" className="rounded-lg mb-4 w-full object-cover" style={{
                transform: 'scaleX(-1)', // Flip horizontally
              }} />
            
            <div className="flex gap-4 w-full">
              <button
                onClick={retakeImage}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md flex-1 hover:bg-yellow-600 transition duration-200"
              >
                Retake Photo
              </button>
              
              <button
                onClick={verifyFace}
                className="bg-blue-500 text-white py-2 px-4 rounded-md flex-1 hover:bg-blue-600 transition duration-200"
              >
                Verify Face
              </button>
            </div>

            <button
              onClick={submitImage}
              disabled={!isVerified} // Disable until face is verified
              className={`mt-4 py-2 px-4 rounded-md w-full transition duration-200 ${isVerified ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
            >
              Submit Photo
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-4">
                {isDetecting ? 'Processing...' : 'Verification Complete'}
              </h3>
              <p>{detectionMessage}</p>
              {!isDetecting && (
                <div className="mt-4">
                  {detectionMessage === 'Face verified successfully.' ? (
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
