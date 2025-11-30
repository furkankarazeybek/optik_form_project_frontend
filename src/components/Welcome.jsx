import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoPerson, IoSchool, IoPeople, IoDocumentText, IoStatsChart } from "react-icons/io5";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);

  const getRoleName = (role) => {
    if (role === 'admin') return 'Yönetici (Admin)';
    if (role === 'teacher') return 'Öğretmen';
    if (role === 'user') return 'Öğrenci';
    return role;
  };

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axios.get("http://localhost:5050/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("İstatistik hatası:", error);
      }
    };

    if (user) {
      getStats();
    }
  }, [user]);

  return (
    <div className="container mt-5">
      <div className="box has-background-primary-light">
        <h1 className="title is-2 has-text-primary">
          Hoşgeldin, {user && user.name}
        </h1>
        <h2 className="subtitle is-4">
          Yetkiniz: <strong>{user && getRoleName(user.role)}</strong>
        </h2>
      </div>

      <div className="columns is-multiline mt-4">
        {/* ADMIN EKRANI */}
        {user && user.role === "admin" && stats && (
          <>
            <div className="column is-3">
              <div className="box has-background-info has-text-white">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <p className="heading">Toplam Kullanıcı</p>
                    <p className="title has-text-white">{stats.totalUsers}</p>
                  </div>
                  <IoPerson size={50} style={{ opacity: 0.5 }} />
                </div>
              </div>
            </div>
            <div className="column is-3">
              <div className="box has-background-warning has-text-grey-dark">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <p className="heading">Öğretmen Sayısı</p>
                    <p className="title has-text-grey-dark">{stats.totalTeachers}</p>
                  </div>
                  <IoSchool size={50} style={{ opacity: 0.5 }} />
                </div>
              </div>
            </div>
            <div className="column is-3">
              <div className="box has-background-success has-text-white">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <p className="heading">Öğrenci Sayısı</p>
                    <p className="title has-text-white">{stats.totalStudents}</p>
                  </div>
                  <IoPeople size={50} style={{ opacity: 0.5 }} />
                </div>
              </div>
            </div>
            <div className="column is-3">
              <div className="box has-background-danger has-text-white">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <p className="heading">Toplam Sınav</p>
                    <p className="title has-text-white">{stats.totalExams}</p>
                  </div>
                  <IoDocumentText size={50} style={{ opacity: 0.5 }} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* ÖĞRETMEN EKRANI */}
        {user && user.role === "teacher" && stats && (
          <div className="column is-4">
            <div className="box has-background-link has-text-white">
              <div className="is-flex is-justify-content-space-between is-align-items-center">
                <div>
                  <p className="heading">Oluşturduğum Sınavlar</p>
                  <p className="title has-text-white">{stats.myExams}</p>
                </div>
                <IoDocumentText size={60} style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>
        )}

        {/* ÖĞRENCİ EKRANI */}
        {user && user.role === "user" && stats && (
          <div className="column is-4">
            <div className="box has-background-primary has-text-white">
              <div className="is-flex is-justify-content-space-between is-align-items-center">
                <div>
                  <p className="heading">Katıldığım Sınavlar</p>
                  <p className="title has-text-white">{stats.myResults}</p>
                </div>
                <IoStatsChart size={60} style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;