import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

interface Test {
  id: string;
  name: string;
  timeSlot: string;
  endTime: string;
  usersAllowed: number;
  totalMarks: number;
  usersFilled: number;
}

const AdminDashboard = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTest, setNewTest] = useState({
    name: "",
    timeSlot: "",
    endTime: "",
    usersAllowed: 0,
    totalMarks: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/admin/tests");
        const data = res.data // Ensure data is an array
        setTests(data.tests);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
      setLoading(false);
    };
    fetchTests();
  }, []);

  
  const addMcqs = async (id: string) => {
    try {
      navigate(`/admin/test/${id}/addmcqs`);
    } catch (error) {
      console.error("Error fetching mcqs:", error);
    }
  }

  const addCodingQuestions = async (id: string) => {
    try {
      navigate(`/admin/test/${id}/addcodingquestions`);
    } catch (error) {
      console.error("Error fetching coding questions:", error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/deleteTest/${id}`);
      setTests(tests.filter((test) => test.id !== id));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleAddTest = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/admin/createTest", newTest);
      setTests([...tests, res.data]);
      setShowForm(false); 
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 mb-2 rounded"
        onClick={() => setShowForm(true)}
      >
        Add New Test
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests && tests.length > 0 ? (
            tests.map((test) => (
                <div key={test.id} className="p-6 bg-gray-800 rounded-md">
                <h2 className="text-xl font-bold mb-2">{test.name}</h2>
                <p>Test id: {test.id}</p>
                <p>Time Slot: {new Date(test.timeSlot).toLocaleString()}</p>
                <p>End Time: {new Date(test.endTime).toLocaleString()}</p>
                <p>Users Allowed: {test.usersAllowed}</p>
                <p>Users Filled: {test.usersFilled}</p>
                <p>Total Marks: {test.totalMarks}</p>
                <div className="flex gap-3">
                <button
                  className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
                  onClick={() => handleDelete(test.id)}
                  >
                  Delete Test
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" onClick={() => addMcqs(test.id)}>
                  Add mcqs
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" onClick={()=> addCodingQuestions(test.id)}>
                  Add coding questions
                </button>
                  </div>
              </div>
            ))
          ) : (
            <p>No tests available.</p>
          )}
        </div>
      )}

      

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
                onChange={(e) =>
                  setNewTest({ ...newTest, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Time Slot:</label>
              <input
                className="w-full p-2 mt-2 rounded bg-gray-700"
                type="datetime-local"
                value={newTest.timeSlot}
                onChange={(e) =>
                  setNewTest({ ...newTest, timeSlot: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">End Time:</label>
              <input
                className="w-full p-2 mt-2 rounded bg-gray-700"
                type="datetime-local"
                value={newTest.endTime}
                onChange={(e) =>
                  setNewTest({ ...newTest, endTime: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Users Allowed:</label>
              <input
                className="w-full p-2 mt-2 rounded bg-gray-700"
                type="number"
                value={newTest.usersAllowed}
                onChange={(e) =>
                  setNewTest({
                    ...newTest,
                    usersAllowed: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Total Marks:</label>
              <input
                className="w-full p-2 mt-2 rounded bg-gray-700"
                type="number"
                value={newTest.totalMarks}
                onChange={(e) =>
                  setNewTest({
                    ...newTest,
                    totalMarks: parseInt(e.target.value),
                  })
                }
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
