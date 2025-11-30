
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoTrashOutline, IoEyeOutline, IoDocumentTextOutline, IoCreateOutline } from "react-icons/io5";
const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [msg, setMsg] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getExams();
  }, []);

  const getExams = async () => {
    try {
      const response = await axios.get("http://localhost:5050/exams");
      setExams(response.data);
      setMsg("");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        setExams([]);
      } else {
        setMsg("Sınav listesi çekilirken bir hata oluştu.");
      }
    }
  };
  
  const deleteExam = async (examId) => {
    if (!window.confirm("Bu sınavı ve ilişkili tüm sonuçları/soruları silmek istediğinizden emin misiniz?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5050/exams/${examId}`);
      getExams();
      setMsg("Sınav başarıyla silindi.");
    } catch (error) {
      if (error.response) {
        setMsg(`Silme hatası: ${error.response.data.msg}`);
      } else {
        setMsg("Sınav silinirken beklenmedik bir hata oluştu.");
      }
    }
  };

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        <h1 className="title">Sınav Listesi</h1>
        
        <nav className="level">
            <div className="level-left">
                <Link to="/exams/add" className="button is-primary mb-3">
                    Yeni Sınav Oluştur
                </Link>
            </div>
            {msg && (
                <div className="level-right">
                    <p className={`notification is-light ${msg.includes("başarıyla") ? 'is-success' : 'is-danger'} p-2`}>
                        {msg}
                    </p>
                </div>
            )}
        </nav>
        
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Sınav Başlığı</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
                exams.map((exam, index) => (
                    <tr key={exam.id}>
                        <td>{index + 1}</td>
                        <td>{exam.title}</td>
                        <td>{new Date(exam.createdAt).toLocaleDateString()}</td>
                        <td>
                            <div className="buttons are-small">
                                {/* Sonuçları Gör */}
                                <Link 
                                    to={`/exams/${exam.id}/results`} 
                                    className="button is-info"
                                    title="Sonuçları Listele"
                                >
                                    <span className="icon"><IoDocumentTextOutline /></span>
                                    <span>Sonuçlar</span>
                                </Link>
                                
                                {/* Soruları Gör */}
                                <Link 
                                    to={`/exams/${exam.id}/questions`} 
                                    className="button is-warning"
                                    title="Soruları İncele"
                                >
                                    <span className="icon"><IoEyeOutline /></span>
                                    <span>Sorular</span>
                                </Link>

                                {/* Sınavı Sil (Sadece Admin veya Sahibi silebilir) */}
                                {(user && (user.role === "admin" || user.id === exam.teacherId)) && (
                                    <button 
                                        onClick={() => !exam.hasResults && deleteExam(exam.id)}
                                        className="button is-danger"
                                        disabled={exam.hasResults} // Sonuç varsa buton pasif
                                        title={exam.hasResults ? "Okunmuş sınav silinemez" : "Sınavı Sil"}
                                    >
                                        <span className="icon">
                                            <IoTrashOutline />
                                        </span>
                                        <span>{exam.hasResults ? "Silme Kilitli" : "Sil"}</span>
                                    </button>
                                )}

                                {(user && (user.role === "admin" || user.id === exam.teacherId)) && (
                                    <Link
                                        to={!exam.hasResults ? `/exams/edit/${exam.id}` : "#"} // Sonuç varsa link çalışmasın
                                        className={`button is-primary ${exam.hasResults ? "is-disabled" : ""}`}
                                        title={exam.hasResults ? "Okunmuş sınav güncellenemez" : "Sınavı Düzenle"}
                                        // Tıklamayı engellemek için style veya onClick kontrolü
                                        style={{ pointerEvents: exam.hasResults ? "none" : "auto" }}
                                        disabled={exam.hasResults}
                                    >
                                        <span className="icon"><IoCreateOutline /></span>
                                        <span>{exam.hasResults ? "Kilitli" : "Düzenle"}</span>
                                    </Link>
                                )}
                            </div>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="has-text-centered">
                        {msg || "Henüz sınav bulunmamaktadır."}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ExamList;