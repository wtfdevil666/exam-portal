import axios from 'axios';
import React, { useEffect } from 'react';

interface Test {
  name: string;
  id: string;
  timeSlot: Date;
  usersAllowed: number;
  usersFilled: number;
  totalMarks: number;
}

interface TestProps {
  test: Test;
}

const TestComponent: React.FC<TestProps> = ({ test }) => {
  const { name, id, timeSlot, usersAllowed, usersFilled, totalMarks } = test;

  const handleBookTest = async () => {

    const response = await axios.post('http://localhost:3000/api/user/test/'+id+"/booktest",{withCredentials:true});
    console.log(response);
  }


  return (
    <div className=" w-fit p-4">
      <div className="md:w-96 min-w-72 p-4 border  rounded-lg shadow-lg  bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-xs text-gray-400 mb-4">Test ID: {id}</p>
        <div className="space-y-4">
          <p className="text-base text-gray-700">
            <span className="font-medium text-gray-600">Time Slot:</span> {timeSlot.toLocaleString()}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-medium text-gray-600">Users Allowed:</span> {usersAllowed}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-medium text-gray-600">Users Filled:</span> {usersFilled}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-medium text-gray-600">Total Marks:</span> {totalMarks}
          </p>
        </div>
        <div className='flex justify-end'>
          <button className='bg-green-500 p-2 rounded-lg hover:bg-green-700 text-white' onClick={handleBookTest}>Book Test</button>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
