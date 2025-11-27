// src/pages/UploadOptic.jsx
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useSelector } from "react-redux";

const UploadOptic = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [files, setFiles] = useState(null);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getExams();
  }, []);

  const getExams = async () => {
    try {
      const response = await axios.get("http://localhost:5050/exams");
      setExams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async (e) => {
    e.preventDefault();
    if (!files || !selectedExam) {
        setMsg("Lütfen bir sınav seçin ve dosya yükleyin.");
        return;
    }

    const formData = new FormData();
    formData.append("examId", selectedExam);
    formData.append("teacherId", user.id); // veya backend session'dan alabilir

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    setIsLoading(true);
    setMsg("Formlar işleniyor, lütfen bekleyin (Python OCR)...");

    try {
      const response = await axios.post("http://localhost:5050/upload-optics", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMsg(`Başarılı: ${response.data.msg}. Toplam ${response.data.total} kağıt okundu.`);
    } catch (error) {
      if (error.response) {
        setMsg(`Hata: ${error.response.data.msg}`);
      } else {
        setMsg("Sunucu hatası oluştu.");
      }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        <h1 className="title">Optik Form Yükle</h1>
        
        <form onSubmit={uploadFiles}>
            <div className="field">
                <label className="label">Sınav Seçiniz</label>
                <div className="control">
                    <div className="select is-fullwidth">
                        <select 
                            value={selectedExam} 
                            onChange={(e) => setSelectedExam(e.target.value)}
                        >
                            <option value="">Seçiniz...</option>
                            {exams.map((exam) => (
                                <option key={exam.id} value={exam.id}>{exam.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="field">
                <label className="label">Optik Form Resimleri (Çoklu Seçim)</label>
                <div className="control">
                    <input 
                        type="file" 
                        className="input" 
                        multiple 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="field mt-5">
                <button 
                    type="submit" 
                    className={`button is-primary is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                    disabled={isLoading}
                >
                    Yükle ve Değerlendir
                </button>
            </div>
        </form>
        
        {msg && (
            <div className={`notification mt-4 ${msg.includes('Hata') ? 'is-danger' : 'is-success'}`}>
                {msg}
            </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadOptic;