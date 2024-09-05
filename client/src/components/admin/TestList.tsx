interface TestListProps {
  test: Test;
  handleDeleteTest: (id: string) => void;
  onViewSlots: () => void;
}

interface Test {
  id: string;
  name: string;
  year: number;
}
const TestList: React.FC<TestListProps> = ({ test, handleDeleteTest, onViewSlots }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-lg mb-4">
      <h3 className="text-xl font-bold mb-2">{test.name}</h3>
      <p>Year: {test.year}</p>
      <p>Created At: {new Date().toLocaleDateString()}</p>
      <div className="flex justify-between mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onViewSlots}>
          View Test Slots
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => handleDeleteTest(test.id)}
        >
          Delete Test
        </button>
      </div>
    </div>
  );
};

export default TestList;
