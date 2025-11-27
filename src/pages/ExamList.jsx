// src/pages/ExamList.jsx
import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { Link } from "react-router-dom";

const ExamList = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    getExams();
  }, []);

  const getExams = async () => {
    const response = await axios.get("http://localhost:5050/exams");
    setExams(response.data);
  };

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        <h1 className="title">Sınavlar</h1>
        <Link to="/exams/add" className="button is-primary mb-3">Yeni Sınav Ekle</Link>
        
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>Sınav Başlığı</th>
              <th>Oluşturulma Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, index) => (
              <tr key={exam.id}>
                <td>{index + 1}</td>
                <td>{exam.title}</td>
                <td>{exam.teacherId}</td>
                <td>{new Date(exam.createdAt).toLocaleDateString()}</td>
                <td>
                    {/* Sonuçları Gör butonu */}
                    <Link 
                        to={`/exams/${exam.id}/results`} 
                        className="button is-small is-info mr-2"
                    >
                        Sonuçları Gör
                    </Link>
                    
                    {/* YENİ BUTON: Soruları Gör */}
                    <Link 
                        to={`/exams/${exam.id}/questions`} 
                        className="button is-small is-warning mr-2"
                    >
                        Soruları Gör
                    </Link>

                   
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ExamList;