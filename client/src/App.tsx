import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Dashboard from './pages/user/Dashboard';
import SignupForm from './pages/auth/Signup';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Addmcqs from './pages/admin/Addmcqs';
import Addcodingquestions from './pages/admin/Addcodingquestions';
import FaceCapture from './pages/auth/FaceCapture';
import Test from './pages/test/Test';


export default function App() {
  return (
    <div >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div></div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={< Landing/>} />
          <Route path="/login" element={< Login/>} />
          <Route path="/signup" element={< SignupForm/>} />
          <Route path="/user/dashboard" element={< Dashboard/>} />
          <Route path="/admin/login" element={< AdminLogin/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
          <Route path="/admin/test/:testid/addmcqs" element={<Addmcqs/>} />
          <Route path="/admin/test/:testid/addcodingquestions" element={<Addcodingquestions/>} />
          <Route path="/signup/facecapture" element={<FaceCapture/>} />
          <Route path='/test' element={<Test />} />
        </Routes>  
      </BrowserRouter>
    </div>
  );
}