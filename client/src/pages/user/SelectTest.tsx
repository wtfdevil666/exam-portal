import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TestComponent from '../../components/test/GetTests';

interface Test{
    name:string;
    id:string;
    timeSlot:Date;
    usersAllowed:number;
    usersFilled:number;
    totalMarks:number;
}

//hello world
const SelectTest:React.FC = () => {

    const [test, setTest] = useState<Test[]>([]);

    useEffect(() => {
        const getTests = async () => {
            const testsFromServer = await axios.get("http:///localhost:3000/api/user/getTests",{
                withCredentials:true
            });

            setTest(testsFromServer.data);
        }
        getTests();
    }, [])



  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2'>
        {test.map((test) => (
            <div key={test.id} className="p-6 rounded-lg">
                <TestComponent test={test}/>
            </div>
        ))}
    </div>
  )
}

export default SelectTest
