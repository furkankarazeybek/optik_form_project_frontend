// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import AddUser from "./pages/AddUser.jsx";
import EditUser from "./pages/EditUser.jsx";
import ExamQuestions from "./pages/ExamQuestions.jsx";
// Yeni eklenen sayfalar
import ExamList from "./pages/ExamList.jsx";
import AddExam from "./pages/AddExam.jsx";
import UploadOptic from "./pages/UploadOptic.jsx";
import ExamResults from "./pages/ExamResults.jsx";
import StudentResults from "./pages/StudentResults.jsx";
import StudentResultDetail from "./pages/StudentResultDetail.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Kullanıcı İşlemleri */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          
          {/* Sınav İşlemleri */}
          <Route path="/exams" element={<ExamList />} />
          <Route path="/exams/add" element={<AddExam />} />
          <Route path="/upload-optic" element={<UploadOptic />} />
          <Route path="/exams/:id/results" element={<ExamResults />} />
          <Route path="/exams/:id/questions" element={<ExamQuestions />} />
          <Route path="/my-results" element={<StudentResults />} />
          <Route path="/my-results/:resultId" element={<StudentResultDetail />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;