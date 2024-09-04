import  { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../config/config';

const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const f = async () => {
            try {
                const response = await axios.get(backend_url+'/api/user/login/success', { withCredentials: true });
                console.log(response.data.success);
                if(response.data.success === true){
                    navigate('/user/dashboard');
                }
                else{
                    navigate('/signup');
                } 
            } catch (error) {
                console.log(error)
            }
        }
        f();
    },[])

  return (
    <div className='text-black'>
      Redirecting you...
    </div>
  )
}

export default Login

    
