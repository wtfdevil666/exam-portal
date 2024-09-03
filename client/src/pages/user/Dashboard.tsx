import { useEffect } from "react";
import SelectTest from "./SelectTest"
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate()
  useEffect(() => {
    if(!document.cookie){
      navigate('/');
    }
  }, []);
  return (
    <div className=''>
      <h1 className='text-3xl text-center mt-5 font-extrabold'>Book your test slot</h1>
      <SelectTest/>
    </div>
  )
}

export default Dashboard 
