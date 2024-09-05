import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminNavbar";
import TestList from "../../components/admin/TestList";
import AddTestForm from "../../components/admin/AddTestComp";
import TestSlotViewer from "../../components/admin/TestSlotViewer";
import { backend_url } from "../../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface Test {
  id: string;
  name: string;
  year: number;
}

interface Slot {
  startTime: string;
  endTime: string;
  marks: number;
  userAllowed: number;
  userEnrolled: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTestSlots, setSelectedTestSlots] = useState<Slot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddTest = async (newTest: { name: string; year: number }) => {
    try {
      const res = await axios.post(`${backend_url}/api/admin/createTest`, newTest);
      setTests((prevTests) => [...prevTests, res.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  const handleDeleteTest = async (id: string) => {
    try {
      await axios.delete(`${backend_url}/api/admin/deleteTest/${id}`);
      setTests((prevTests) => prevTests.filter((test) => test.id !== id));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const handleViewSlots = (testId: string) => {
    const exampleSlots: Slot[] = [
      {
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        marks: 100,
        userAllowed: 50,
        userEnrolled: 30,
      },
      {
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        marks: 100,
        userAllowed: 50,
        userEnrolled: 25,
      },
    ];
    setSelectedTestSlots(exampleSlots);
  };


  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backend_url}/api/admin/tests`);
        setTests(res.data.tests);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
      setLoading(false);
    };

    fetchTests();
  }, []);

  return (
    <div className="flex min-h-screen p-8 bg-gray-100">
      <div className="flex-1">
        <AdminHeader onLogout={handleLogout} onAddTestClick={() => setShowForm(true)} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {tests.length > 0 ? (
              tests.map((test) => (
                <TestList
                  key={test.id}
                  test={test}
                  handleDeleteTest={() => handleDeleteTest(test.id)}
                  onViewSlots={() => handleViewSlots(test.id)}
                />
              ))
            ) : (
              <p>No tests available.</p>
            )}
          </div>
        )}
        {showForm && (
          <AddTestForm onAddTest={handleAddTest} onClose={() => setShowForm(false)} />
        )}
      </div>

      {selectedTestSlots.length > 0 && (
        <div className="w-1/3">
          <TestSlotViewer slots={selectedTestSlots} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
