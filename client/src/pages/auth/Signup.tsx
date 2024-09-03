import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollno: '',
    branch: '',
    phone: '',
  });

  useEffect(() => {
    if(!document.cookie){
      navigate('/');
    }
  }, []);

  const navigate = useNavigate();
  const branches = ['Computer Engineering', 'Electronics and Computer', 'Mechanical Engineering', 'Civil Engineering'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!formData.name || !formData.rollno || !formData.branch || !formData.phone) {
      alert('Please fill all the fields');
      return;
    }
    navigate('/signup/facecapture');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="  rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">Enter your details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="">
            <label htmlFor="name" className="block text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="">
            <label htmlFor="rollno" className="block text-gray-700 font-semibold">Roll Number</label>
            <input
              type="text"
              name="rollno"
              value={formData.rollno}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your roll number"
              required
            />
          </div>

          <div className="">
            <label htmlFor="branch" className="block text-gray-700 font-semibold">Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="">
            <label htmlFor="phone" className="block text-gray-700 font-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
