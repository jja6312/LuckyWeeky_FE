import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import PasswordReset from "./pages/password-reset/PasswordReset"; // 비밀번호 찾기 페이지

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<PasswordReset />} />
          <Route path="/main" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
