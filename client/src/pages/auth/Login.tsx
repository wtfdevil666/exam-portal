import  { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../../config/config';

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

const Login = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const f = async () => {
            try {
                const response = await axios.get(backend_url+'/api/user/login/success', { withCredentials: true });
                console.log(response.data.success);
                if(response.data.success=== false){
                    navigate('/signup');
                }
                else{
                    navigate('/user/dashboard');
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

    
