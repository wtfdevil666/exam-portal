import React from "react";
import Navbar from "../components/Navbar";

const Landing: React.FC = () => {

  // Placeholder function for Google Sign-In (Implement actual logic if needed)
  const handleGoogleSignIn = () => {
    window.open('http://localhost:3000/api/auth/oauth', '_self');
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={handleGoogleSignIn}
          className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded shadow hover:bg-gray-50 flex items-center"
        >
          <img
            src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
            alt="Google Logo"
            className="h-6 w-6 mr-2"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Landing;
