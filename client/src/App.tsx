import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import GoogleSignInButton from './pages/Signin';
import Login from './pages/Login';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< Landing/>} />
        <Route path="/signin" element={< GoogleSignInButton/>} />
        <Route path="/login" element={< Login/>} />
      </Routes>  
    </BrowserRouter>
  );
}