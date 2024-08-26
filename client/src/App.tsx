import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import GoogleSignInButton from './pages/auth/Signin';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import SignupForm from './pages/auth/Signup';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Addmcqs from './pages/admin/Addmcqs';
import Addcodingquestions from './pages/admin/Addcodingquestions';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Landing/>} />
        <Route path="/signin" element={< GoogleSignInButton/>} />
        <Route path="/login" element={< Login/>} />
        <Route path="/signup" element={< SignupForm/>} />
        <Route path="/dashboard" element={< Dashboard/>} />
        <Route path="/admin/login" element={< AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/test/:testid/addmcqs" element={<Addmcqs/>} />
        <Route path="/admin/test/:testid/addcodingquestions" element={<Addcodingquestions/>} />
        
      </Routes>  
    </BrowserRouter>
  );
}