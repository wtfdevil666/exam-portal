import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {

    const navigate = useNavigate();

  return (
    <nav className="bg-white  shadow-lg p-4">
      <div className="container mx-auto flex justify-center items-center">
        <div className="flex items-center">
          
            Acm Exam Portal
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
