import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { IoCheckmarkCircle, IoCloseCircle, IoHelpCircle, IoArrowBack, IoEye } from "react-icons/io5";

const StudentResultDetail = () => {
  const [examData, setExamData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Optik resim popup durumu
  const { resultId } = useParams();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/student/result-details/${resultId}`);
        setExamData(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.msg : "Veri alınamadı.");
      }
    };
    getDetails();
  }, [resultId]);

  if (error) return <Layout><div className="notification is-danger mt-5 mx-3">{error}</div></Layout>;
  if (!examData) return <Layout><div className="box mt-5 mx-3 has-text-centered">Yükleniyor...</div></Layout>;

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        {/* Üst Başlık ve Butonlar */}
        <div className="level is-mobile">
            <div className="level-left">
                <Link to="/my-results" className="button is-small is-white mr-2">
                    <IoArrowBack size={20}/>
                </Link>
                <h1 className="title is-4 mb-0">{examData.examTitle}</h1>
            </div>
            
            {/* Optik Görüntüleme Butonu */}
            {examData.opticUrl && (
                <div className="level-right">
                    <button 
                        className="button is-info is-light" 
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className="icon"><IoEye /></span>
                        <span>Optiği Gör</span>
                    </button>
                </div>
            )}
        </div>
        
        {/* Puan ve İstatistikler */}
        <div className="tags are-medium mb-5">
            <span className="tag is-success is-light">Doğru: <b>{examData.stats.correct}</b></span>
            <span className="tag is-danger is-light">Yanlış: <b>{examData.stats.wrong}</b></span>
            <span className="tag is-warning is-light">Boş: <b>{examData.stats.empty}</b></span>
            <span className="tag is-info">Puan: <b>{examData.score}</b></span>
        </div>

        <hr />

        {/* Sorular ve Şıklar */}
        <div className="columns is-multiline">
          {examData.questions.map((q) => (
            <div className="column is-full" key={q.questionNumber}>
              {/* Kart Rengi: Doğru=Yeşilimsi, Yanlış=Kırmızımsı, Boş=Gri */}
              <div className={`card ${q.isCorrect ? 'has-background-success-light' : q.isEmpty ? 'has-background-white-ter' : 'has-background-danger-light'}`} 
                   style={{border: q.isCorrect ? '1px solid #48c774' : q.isEmpty ? '1px solid #dbdbdb' : '1px solid #f14668'}}>
                
                <div className="card-content p-4">
                  <div className="level is-mobile mb-3">
                    <div className="level-left">
                        <span className="tag is-dark mr-2">{q.questionNumber}</span>
                        <span className="has-text-weight-semibold">{q.questionText}</span>
                    </div>
                    <div className="level-right">
                        {q.isCorrect ? (
                            <span className="tag is-success"><IoCheckmarkCircle className="mr-1"/> Doğru</span>
                        ) : q.isEmpty ? (
                            <span className="tag is-warning"><IoHelpCircle className="mr-1"/> Boş</span>
                        ) : (
                            <span className="tag is-danger"><IoCloseCircle className="mr-1"/> Yanlış</span>
                        )}
                    </div>
                  </div>

                  {/* Şık Butonları - ALT ALTA LİSTE */}
                  <div className="columns is-multiline">
                    {['A', 'B', 'C', 'D', 'E'].map(opt => {
                        // DÜZELTME BAŞLANGICI: Buton sınıfları görünürlük için güncellendi
                        let btnClass = "button is-fullwidth mb-2 p-2 "; 
                        let icon = null;

                        // Renklendirme Mantığı
                        if (q.correctAnswer === opt) {
                            btnClass += "is-success"; // Doğru cevap YEŞİL (Beyaz yazı)
                            icon = <IoCheckmarkCircle className="ml-2"/>;
                        } 
                        else if (q.studentAnswer === opt && !q.isCorrect) {
                            btnClass += "is-danger"; // Yanlış işaretlenen KIRMIZI (Beyaz yazı)
                            icon = <IoCloseCircle className="ml-2"/>;
                        } 
                        else {
                            // DİĞER ŞIKLAR İÇİN DÜZELTME:
                            // is-white ve is-outlined yerine net görünürlük sağlayan sınıflar:
                            // has-background-white: Arka planı kesin beyaz yapar (Renkli kart üstünde görünür)
                            // has-text-grey-dark: Yazıyı koyu gri yapar (Okunabilir)
                            // style prop ile border ekleyeceğiz
                            btnClass += "has-background-white has-text-grey-dark";
                        }
                        // DÜZELTME BİTİŞİ

                        return (
                            <div className="column is-12" key={opt} style={{padding: '0.25rem 0.75rem'}}>
                                <button 
                                    className={btnClass} 
                                    disabled 
                                    style={{
                                        opacity: 1, 
                                        cursor: 'default', 
                                        justifyContent: 'flex-start',
                                        height: 'auto', 
                                        whiteSpace: 'normal',
                                        textAlign: 'left',
                                        // Diğer şıklar için kenarlık ekle ki beyaz kart üzerinde kaybolmasın
                                        border: (q.correctAnswer !== opt && q.studentAnswer !== opt) ? '1px solid #dbdbdb' : 'none'
                                    }}
                                >
                                    <strong className="mr-2" style={{minWidth: '20px'}}>{opt})</strong> 
                                    
                                    <span style={{flex: 1}}>{q.options[opt] || "—"}</span>
                                    
                                    {icon}
                                    
                                    {q.studentAnswer === opt && (
                                        <span className="tag is-dark ml-2" style={{height: '1.5em'}}>Sen</span>
                                    )}
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

      {/* Optik Resim Modal (Popup) */}
      {isModalOpen && (
        <div className="modal is-active" style={{zIndex: 9999}}>
          <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="modal-content" style={{
              width: 'auto', 
              maxWidth: '95%',
              maxHeight: '95vh', 
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
          }}>
            <p className="image">
              <img 
                src={`http://localhost:5050/public/uploads/${examData.opticUrl}`} 
                alt="Öğrenci Optik Formu" 
                style={{
                    maxHeight: '90vh', 
                    width: 'auto',     
                    objectFit: 'contain'
                }}
              />
            </p>
          </div>
          
          <button 
            className="modal-close is-large" 
            aria-label="close" 
            onClick={() => setIsModalOpen(false)}
          ></button>
        </div>
      )}

    </Layout>
  );
};

export default StudentResultDetail;