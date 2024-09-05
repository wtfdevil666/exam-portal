import React from "react";

interface AdminHeaderProps {
  onLogout: () => void;
  onAddTestClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, onAddTestClick }) => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
      <div className="flex justify-between gap-3">
        <button
          className="bg-red-500 text-white px-4 py-2 mb-4 rounded"
          onClick={onLogout}
        >
          Logout
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 mb-4 rounded"
          onClick={onAddTestClick}
        >
          Add New Test
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
