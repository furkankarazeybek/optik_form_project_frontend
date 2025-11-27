import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [role, setRole] = useState("user"); // Varsayılan olarak öğrenci
  const [number, setNumber] = useState(""); // YENİ: Öğrenci Numarası
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/users", {
        name: name,
        email: email,
        password: password,
        confPassword: confPassword,
        role: role,
        number: role === "user" ? number : null, // Sadece öğrenci ise numarayı gönder
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
      <h2 className="subtitle">Add New User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveUser}>
              <p className="has-text-centered has-text-danger">{msg}</p>
              
              {/* Name ve Email alanları... */}
              <div className="field">{/* Name Field */}</div>
              <div className="field">{/* Email Field */}</div>
              {/* ... */}
              
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

              {/* Password ve Confirm Password alanları... */}
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    placeholder="***********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                    required
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
                        setNumber(""); // Rol değişince numarayı temizle
                      }}
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Öğretmen</option>
                      <option value="user">Öğrenci</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* KRİTİK DEĞİŞİKLİK: Öğrenci Numarası Alanı (Koşullu Render) */}
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
                      required={role === "user"} // Öğrenci ise zorunlu yap
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <div className="control">
                  <button type="submit" className="button px-6 mt-6 is-success">
                    Create
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

export default FormAddUser;