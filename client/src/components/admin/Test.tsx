import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TestProps {
  id: string;
  name: string;
  year: number;
  createdAt: string;
}

interface TestCardProps {
  test: TestProps;
}

interface TestProps {
    key: string;
  
    test: TestProps;
}

const TestCard: React.FC<TestCardProps> = ({ test }) => {
  const navigate  = useNavigate();

    const handleViewSlots = () => {
        navigate("/admin/test/" + test.id + "/slots");
    };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200 p-6 m-4">
      <div className="font-bold text-xl mb-2">{test.name}</div>
      <p className="text-gray-700 text-base">Year: {test.year}</p>
      <p className="text-gray-700 text-base">Created At: {new Date(test.createdAt).toLocaleDateString()}</p>
      <button
        className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        onClick={handleViewSlots}
      >
        View Test Slots
      </button>
    </div>
  );
};


//@ts-ignore
const TestList: React.FC<TestProps> = ({ test }) => {
  return (
    <div className="flex flex-wrap justify-center">
        <TestCard key={test.id} test={test} />
    </div>
  );
};

export default TestList;
