import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IoDownloadOutline } from "react-icons/io5"; // İndirme ikonu

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [examTitle, setExamTitle] = useState("Yükleniyor..."); // YENİ: Başlık state'i
  const { id } = useParams(); // examId

  useEffect(() => {
    getResults();
  }, [id]);

  const getResults = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/${id}/results`);
      // Yapılandırılmış cevabı ayrıştırıyoruz
      setExamTitle(response.data.examTitle); 
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
      setExamTitle("Hata: Sınav Başlığı Bulunamadı");
    }
  };
  
  // YENİ FONKSİYON: CSV (Excel) İndirme İşlevi
  const downloadExcel = () => {
    if (results.length === 0) {
      alert("İndirilecek sonuç bulunmamaktadır.");
      return;
    }

    // Başlık satırı (Türkçe karakter sorununu çözmek için)
    const headers = [
      "Ogrenci Numarasi",
      "Ogrenci Adi",
      "Dogru",
      "Yanlis",
      "Bos",
      "Tahmini Puan"
    ].join(';');

    // Veri satırları
    const data = results.map(res => 
      [
        `"${res.studentNumber}"`,
        `"${res.studentName.replace(/"/g, '""')}"`,
        res.totalCorrect,
        res.totalWrong,
        res.totalEmpty,
        res.totalCorrect * 5 // Hesaplanan puan (Örnek: Her soru 5 puan)
      ].join(';')
    ).join('\n');

    // CSV içeriği oluşturma (UTF-8 BOM ile Türkçe karakter desteği)
    const csvContent = headers + '\n' + data;
    const fileName = `${examTitle.replace(/[^a-z0-9_]/gi, '_')}_Sonuclari.csv`;
    
    // Blob oluşturma
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const link = document.createElement('a');
    
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    
    URL.revokeObjectURL(link.href);
  };

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        {/* BAŞLIK VE BUTON İÇİN YENİ LEVEL YAPISI */}
        <nav className="level">
            {/* Sol: Başlık */}
            <div className="level-left">
                <div className="level-item">
                    <h1 className="title">Sınav Sonuçları: {examTitle}</h1> 
                </div>
            </div>
            {/* Sağ: Excel İndir Butonu */}
            <div className="level-right">
                <div className="level-item">
                    <button 
                        className="button is-success"
                        onClick={downloadExcel}
                        disabled={results.length === 0}
                    >
                        <span className="icon">
                            <IoDownloadOutline />
                        </span>
                        <span>Excel Olarak İndir</span>
                    </button>
                </div>
            </div>
        </nav>
        
        <hr />
        
        {/* Tablo gövdesi (önceki haliyle aynı kalır) */}
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>Öğrenci Numarası</th> 
              <th>Öğrenci Adı</th> 
              <th>Doğru</th>
              <th>Yanlış</th>
              <th>Boş</th>
              <th>Puan (Tahmini)</th> 
            </tr>
          </thead>
          <tbody>
            {results.map((res, index) => (
              <tr key={index}>
                <td>{res.studentNumber}</td> 
                <td>{res.studentName}</td> 
                <td className="has-text-success">{res.totalCorrect}</td>
                <td className="has-text-danger">{res.totalWrong}</td>
                <td className="has-text-grey">{res.totalEmpty}</td>
                <td>{res.totalCorrect * 5}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ExamResults;