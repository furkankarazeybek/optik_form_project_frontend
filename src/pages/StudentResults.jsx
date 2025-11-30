import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    getMyResults();
  }, []);

  const getMyResults = async () => {
    try {
      const response = await axios.get("http://localhost:5050/student/my-results");
      setResults(response.data);
    } catch (error) {
      console.error("Sonuçlar alınamadı", error);
    }
  };

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        <h1 className="title">Sınav Sonuçlarım</h1>
        <table className="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>Sınav Tarihi</th>
              <th>Sınav Adı</th>
              <th>Doğru</th>
              <th>Yanlış</th>
              <th>Boş</th>
              <th>Puan</th>
              <th>Detaylar</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? results.map((res) => (
              <tr key={res.id}>
                <td>{new Date(res.examDate).toLocaleDateString()}</td>
                <td>{res.examTitle}</td>
                <td className="has-text-success has-text-weight-bold">{res.totalCorrect}</td>
                <td className="has-text-danger has-text-weight-bold">{res.totalWrong}</td>
                <td className="has-text-grey">{res.totalEmpty}</td>
                <td>{res.score}</td>
                <td>
                  <Link 
                    to={`/my-results/${res.id}`} 
                    className="button is-small is-link is-outlined"
                  >
                    İncele
                  </Link>
                </td>
              </tr>
            )) : (
                <tr><td colSpan="7" className="has-text-centered">Henüz bir sınav sonucunuz yok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default StudentResults;