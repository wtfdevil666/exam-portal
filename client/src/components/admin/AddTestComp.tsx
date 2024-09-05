import React, { useState } from "react";

interface AddTestFormProps {
  onAddTest: (newTest: { id: string; name: string; year: number }) => void;
  onClose: () => void;
}

const AddTestForm: React.FC<AddTestFormProps> = ({ onAddTest, onClose }) => {
  const [testName, setTestName] = useState("");
  const [testYear, setTestYear] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!testName) {
      alert("Please provide a test name");
      return;
    }

    const newTest = {
      id: Math.random().toString(36), // Generate a unique ID
      name: testName,
      year: testYear,
    };

    onAddTest(newTest);
    onClose(); // Close the form after submission
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Test</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="testName" className="block font-medium mb-2">
              Test Name
            </label>
            <input
              type="text"
              id="testName"
              className="w-full border border-gray-300 rounded-md p-2"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="testYear" className="block font-medium mb-2">
              Test Year
            </label>
            <input
              type="number"
              id="testYear"
              className="w-full border border-gray-300 rounded-md p-2"
              value={testYear}
              onChange={(e) => setTestYear(Number(e.target.value))}
              min={1}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Add Test
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestForm;
