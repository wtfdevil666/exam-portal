import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TestList from "../../components/admin/Test";

// Setting up axios interceptor to add token to request headers
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Test interface for typing
interface Test {
  id: string;
  name: string;
  year: number;
}

const AdminDashboard = () => {
  const [tests, setTests] = useState<Test[]>([]); // State to store the tests
  const [loading, setLoading] = useState(false); // State to manage loading
  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const [newTest, setNewTest] = useState({ name: "", year: 1 }); // State for new test data
  const navigate = useNavigate();

  // Fetching the tests on component mount
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/admin/tests");
        setTests(res.data.tests); // Setting the fetched tests
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
      setLoading(false);
    };
    fetchTests();
  }, []);

  // Handle delete test
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/deleteTest/${id}`);
      setTests(tests.filter((test) => test.id !== id)); // Removing the deleted test from state
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  // Handle adding new test
  const handleAddTest = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/admin/createTest", newTest);
      setTests([...tests, res.data]); // Adding the newly created test to state
      setShowForm(false); // Closing the form
      setNewTest({ name: "", year: 1 }); // Resetting form fields
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Button to show form */}
      <button
        className="bg-green-500 text-white px-4 py-2 mb-2 rounded"
        onClick={() => setShowForm(true)}
      >
        Add New Test
      </button>

      {/* Loading spinner or message */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests && tests.length > 0 ? (
            tests.map((test) => (
              //@ts-ignore
              <TestList key={test.id} test={test} />
            ))
          ) : (
            <p>No tests available.</p>
          )}
        </div>
      )}

      {/* Popup for adding a new test */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-md text-white w-96">
            <h2 className="text-2xl font-bold mb-4">Add New Test</h2>
            <div className="mb-4">
              <label className="block text-sm">Name:</label>
              <input
                className="w-full p-2 mt-2 rounded bg-gray-700"
                type="text"
                value={newTest.name}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Year:</label>
              <input
                className="w-full p-2 mt-2 rounded bg-gray-700"
                type="number"
                value={newTest.year}
                onChange={(e) => setNewTest({ ...newTest, year: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddTest}
              >
                Add Test
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
