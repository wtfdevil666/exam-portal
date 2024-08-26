import axios from 'axios';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollno: '',
    branch: '',
    phone: '',
    faceImage: '',  
  });

  const [isCapturing, setIsCapturing] = useState(false); // To manage camera state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null); // To show verification status
  const webcamRef = useRef<any>(null);  // Reference to the webcam
  const [faceverify, setFaceverify] = useState(false); 
  
  const navigate = useNavigate();
  const branches = ['Computer Engineering', 'Electronics and Computer', 'Mechanical Engineering', 'Civil Engineering'];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCapturing(false);
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setVerificationStatus(null);
    setIsCapturing(true);
  };

  const verifyFace = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/user/verify-face', { faceImage: capturedImage }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.status === 200 && res.data.valid) {
        setVerificationStatus('Face verified successfully.');
        setFaceverify(true);
      } else {
        setVerificationStatus('Face verification failed. Please try again.');
      }
    } catch (error) {
      setVerificationStatus('Error during face verification.');
      console.error("Error during face verification:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (capturedImage) {
      const formDataWithImage = new FormData();
      formDataWithImage.append('name', formData.name);
      formDataWithImage.append('rollno', formData.rollno);
      formDataWithImage.append('branch', formData.branch);
      formDataWithImage.append('phone', formData.phone);
      formDataWithImage.append('faceImage', capturedImage);  // Add the image data

      try {
        const res = await axios.post('http://localhost:3000/api/user/signup', formDataWithImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        if (res.status === 200) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    } else {
      alert('Please capture your face image.');
    }
  };

  return (
    <div className="flex justify-center h-screen bg-black">
      <div className='flex '>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md ">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your name"
            required
            />
        </div>

        <div className="mb-4">
          <label htmlFor="rollno" className="block text-gray-700">Roll Number</label>
          <input
            type="text"
            name="rollno"
            value={formData.rollno}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your roll number"
            required
            />
        </div>

        <div className="mb-4">
          <label htmlFor="branch" className="block text-gray-700">Branch</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
            >
            <option value="" disabled>Select your branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your phone number"
            required
            />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Face Capture</label>
          {isCapturing ? (
            <div className="flex flex-col items-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={350}
                height={350}
                />
              <button
                type="button"
                onClick={capture}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                >
                Capture Photo
              </button>
              
            </div>
          ) : (
            <button
            type="button"
            onClick={() => setIsCapturing(true)}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Open Camera
            </button>
          )}
          {capturedImage && (
            <div className="mt-4">
              <p>Preview:</p>
              <img src={capturedImage} alt="Captured face" className="w-full max-w-xs rounded-md border border-gray-300" />
              <button
                type="button"
                onClick={verifyFace}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                Verify Face
              </button>
              <button
                type="button"
                onClick={retakePhoto}
                className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                >
                Retake Photo
              </button>
              {verificationStatus && (
                <p className={`mt-2 ${verificationStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {verificationStatus}
                </p>
              )}
            </div>
          )}
        </div>
          {
            faceverify ? (
              <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Sign Up
              </button>
            ) : null
            
          }
      </form>
      </div>
    </div>
  );
};

export default SignupForm;
