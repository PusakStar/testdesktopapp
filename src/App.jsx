import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/AuthPage';
import Home from './components/common/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="790197480919-8eonqg0rv4uigopvhjhiii61op2tihhj.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
