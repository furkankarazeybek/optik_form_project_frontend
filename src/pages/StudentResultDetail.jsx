import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoCheckmarkCircle, IoCloseCircle, IoHelpCircle } from "react-icons/io5";

const StudentResultDetail = () => {
  const [examData, setExamData] = useState(null);
  const { resultId } = useParams();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/student/result-details/${resultId}`);
        setExamData(response.data);
      } catch (error) {
        console.error("Detaylar alınamadı", error);
      }
    };
    getDetails();
  }, [resultId]);

  if (!examData) return <Layout><div className="box">Yükleniyor...</div></Layout>;

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        <h1 className="title is-4">{examData.examTitle} - Sonuç Detayı</h1>
        <div className="tags are-medium mb-5">
            <span className="tag is-success">Doğru: {examData.stats.correct}</span>
            <span className="tag is-danger">Yanlış: {examData.stats.wrong}</span>
            <span className="tag is-light">Boş: {examData.stats.empty}</span>
            <span className="tag is-info is-light">Puan: {examData.score}</span>
        </div>

        <div className="columns is-multiline">
          {examData.questions.map((q) => (
            <div className="column is-full" key={q.questionNumber}>
              <div className={`card ${q.isCorrect ? 'has-background-success-light' : q.isEmpty ? '' : 'has-background-danger-light'}`}>
                <div className="card-content p-3">
                  <div className="level is-mobile mb-2">
                    <div className="level-left">
                        <strong className="mr-2">{q.questionNumber}.</strong> {q.questionText}
                    </div>
                    <div className="level-right">
                        {q.isCorrect ? (
                            <span className="has-text-success is-flex is-align-items-center"><IoCheckmarkCircle className="mr-1"/> Doğru</span>
                        ) : q.isEmpty ? (
                            <span className="has-text-grey is-flex is-align-items-center"><IoHelpCircle className="mr-1"/> Boş</span>
                        ) : (
                            <span className="has-text-danger is-flex is-align-items-center"><IoCloseCircle className="mr-1"/> Yanlış</span>
                        )}
                    </div>
                  </div>

                  {/* Şıklar */}
                  <div className="columns is-mobile is-multiline is-gapless">
                    {['A', 'B', 'C', 'D', 'E'].map(opt => {
                        let btnClass = "button is-small is-fullwidth mr-1 mb-1 ";
                        // Renklendirme Mantığı
                        if (q.correctAnswer === opt) btnClass += "is-success "; // Doğru cevap her zaman yeşil
                        else if (q.studentAnswer === opt && !q.isCorrect) btnClass += "is-danger "; // Yanlış işaretlenen kırmızı
                        else btnClass += "is-white "; // Diğerleri beyaz

                        return (
                            <div className="column" key={opt}>
                                <button className={btnClass} disabled>
                                    <strong>{opt}</strong> 
                                    {q.studentAnswer === opt && <span className="ml-1">(Senin Cevabın)</span>}
                                </button>
                            </div>
                        );
                    })}
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

export default StudentResultDetail;