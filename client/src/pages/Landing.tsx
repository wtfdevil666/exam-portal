import React from "react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {

  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 text-blue-900">
      <h1 className="text-4xl">ACM EXAM PORTAL</h1>
      <button className="bg-blue-400 p-4 rounded" onClick={()=>{
        navigate('/signin')
      }}>Signin</button>
    </div>
  );
};

export default Landing;
