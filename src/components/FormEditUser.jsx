import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("");
  const [number, setNumber] = useState(""); // Öğrenci Numarası state'i eklendi
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getUserById();
  }, [id]); // id değiştiğinde tekrar yükle

  const getUserById = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/users/${id}`);
      setName(response.data.name);
      setEmail(response.data.email);
      setRole(response.data.role);
      // Öğrenci Numarası varsa yükle
      setNumber(response.data.number || ""); 
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5050/users/${id}`, {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
        role: role,
        // Backend'e number'ı sadece rol 'user' ise gönder
        number: role === "user" ? number : null, 
      });
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Users</h1>
      <h2 className="subtitle">Update User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateUser}>
              <p className="has-text-centered has-text-danger">{msg}</p>
              
              {/* MEVCUT ALANLAR KORUNDU */}
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    type="email"
                    className="input"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    placeholder="***********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    placeholder="***********"
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Role Seçimi */}
              <div className="field">
                <label className="label">Role</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        // Rol değiştiğinde öğrenci numarasını temizle
                        if (e.target.value !== "user") {
                            setNumber(""); 
                        }
                      }}
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Öğretmen</option>
                      <option value="user">Öğrenci</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* YENİ EKLENEN ÖĞRENCİ NUMARASI ALANI */}
              {role === "user" && (
                <div className="field">
                  <label className="label has-text-danger">Öğrenci Numarası</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      placeholder="Öğrenci Okul Numarası"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      // Öğrenci rolü seçiliyken bu alan zorunludur
                      required={role === "user"} 
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <div className="control">
                  <button type="submit" className="button px-6 mt-6 is-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditUser;