import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const f = async () => {
        const res = await axios.get('http://localhost:3000/api/admin/islogined', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(res.status === 200) {
            navigate('/admin/dashboard');
        }
    }
    f();
  },[]);


  const handleEmailSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('http://localhost:3000/api/admin/getotp', { email });

      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:3000/api/admin/getotp', { email, otp });
      if(response.status === 200) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin/dashboard');
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin {step === 'email' ? 'Login' : 'OTP Verification'}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {step === 'email' ? (
          <div>
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter your email"
              required
            />
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full mt-4 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter OTP"
              required
            />
            <button
              onClick={handleOtpSubmit}
              disabled={loading}
              className="w-full mt-4 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-all"
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
