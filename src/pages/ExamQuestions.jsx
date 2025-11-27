import React, { useState, useEffect } from "react";
import Layout from "../pages/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

const ExamQuestions = () => {
  const [exam, setExam] = useState(null);
  const [msg, setMsg] = useState("");
  const { id } = useParams(); // examId

  useEffect(() => {
    getExamById();
  }, [id]);

  const getExamById = async () => {
    try {
      // Backend'deki sınavı ve sorularını çeken endpoint
      const response = await axios.get(`http://localhost:5050/${id}`);
      setExam(response.data);
      setMsg("");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Sınav bilgileri çekilirken bir hata oluştu.");
      }
    }
  };
  
  if (!exam) {
    return (
        <Layout>
            <div className="box mt-3 mr-3">
                <h1 className="title">Sınav Soruları</h1>
                <p>{msg || "Yükleniyor..."}</p>
            </div>
        </Layout>
    );
  }

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        <h1 className="title">Sınav Soruları: {exam.title}</h1>
        <h2 className="subtitle is-5">Toplam Soru: {exam.questions ? exam.questions.length : 0}</h2>
        
        {msg && <p className="notification is-danger">{msg}</p>}

        <div className="columns is-multiline">
          {exam.questions && exam.questions
            // questionNumber'a göre sırala
            .sort((a, b) => a.questionNumber - b.questionNumber)
            .map((question, index) => (
              <div className="column is-full" key={question.id}>
                <div className="card has-background-light">
                  <header className="card-header level is-mobile p-3">
                    <div className="level-left">
                        <p className="card-header-title has-text-dark is-size-5">
                            {question.questionNumber}. Soru
                        </p>
                    </div>
                    <div className="level-right">
                        <p className="tag is-success is-large">
                            <span className="icon mr-1"><IoCheckmarkCircle /></span> 
                            Doğru Cevap: {question.correctAnswer}
                        </p>
                    </div>
                  </header>
                  <div className="card-content">
                    <div className="content">
                      {/* Soru Metni */}
                      <p className="is-size-5 has-text-weight-semibold">
                          {question.questionText}
                      </p>

                      {/* Şıklar Listesi */}
                      <div className="columns is-multiline mt-3">
                        {['A', 'B', 'C', 'D', 'E'].map(opt => (
                            <div className="column is-one-fifth" key={opt}>
                                <div className={`box p-3 ${question.correctAnswer === opt ? 'has-background-success-light' : ''}`}>
                                    <strong>{opt}:</strong> {question[`option${opt}`] || '—'}
                                </div>
                            </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default ExamQuestions;