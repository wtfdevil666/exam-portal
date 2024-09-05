import React from "react";

interface Slot {
  startTime: string;
  endTime: string;
  marks: number;
  userAllowed: number;
  userEnrolled: number;
}

interface TestSlotViewerProps {
  slots: Slot[];
}

const TestSlotViewer: React.FC<TestSlotViewerProps> = ({ slots }) => {
  return (
    <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-md p-4 ml-8">
      <h2 className="text-2xl font-bold mb-4">Test Slots</h2>
      {slots.length > 0 ? (
        <div className="space-y-4">
          {slots.map((slot, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md shadow">
              <p><strong>Start Time:</strong> {slot.startTime}</p>
              <p><strong>End Time:</strong> {slot.endTime}</p>
              <p><strong>Marks:</strong> {slot.marks}</p>
              <p><strong>User Allowed:</strong> {slot.userAllowed}</p>
              <p><strong>User Enrolled:</strong> {slot.userEnrolled}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No slots available for this test.</p>
      )}
    </div>
  );
};

export default TestSlotViewer;
