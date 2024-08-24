import React from "react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 text-blue-900">
      <header className="w-full py-6 bg-blue-700 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold">Welcome to the Exam Portal</h1>
        <p className="text-sm">Your gateway to online assessments</p>
      </header>
      
      <main className="flex flex-col items-center mt-12 space-y-8">
        <div className="text-center max-w-xl">
          <h2 className="text-2xl font-semibold">Take the Next Step in Your Career</h2>
          <p className="text-lg mt-4">
            Join us and begin your journey with a smooth and secure online exam experience.
          </p>
        </div>
        
        <div className="space-y-4">
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded">
            Sign In with Gmail
          </button>
          <button className="bg-white border border-blue-600 text-blue-600 font-semibold py-2 px-6 rounded hover:bg-blue-50">
            Learn More
          </button>
        </div>
      </main>
      
      <footer className="w-full py-4 mt-auto bg-blue-700 text-white text-center">
        <p className="text-sm">&copy; 2024 Exam Portal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
