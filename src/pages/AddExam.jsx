import React, { useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoAddCircle, IoTrash } from "react-icons/io5"; // İkonlar için

const AddExam = () => {
  const [title, setTitle] = useState("");
  // Başlangıçta sadece 1 boş soru olsun
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      optionE: "",
      correctAnswer: "A",
    },
  ]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Sorudaki herhangi bir alanı güncelleme
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Yeni boş soru ekleme
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        correctAnswer: "A",
      },
    ]);
  };

  // Soru silme
  const removeQuestion = (index) => {
    if (questions.length === 1) {
      alert("En az bir soru olmalıdır!");
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1); // İlgili indisteki soruyu çıkar
    setQuestions(newQuestions);
  };

  const saveExam = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/exams", {
        title: title,
        //teacherId: user.id,
        questions: questions,
      });
      navigate("/exams");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <Layout>
      <div className="box mt-3 mr-3">
        <h1 className="title">Yeni Sınav Oluştur</h1>
        <h2 className="subtitle">
          Toplam Soru Sayısı: <span className="has-text-info">{questions.length}</span>
        </h2>
        
        <form onSubmit={saveExam}>
          <p className="has-text-centered has-text-danger mb-3">{msg}</p>

          {/* Sınav Başlığı */}
          <div className="field mb-5">
            <label className="label is-large">Sınav Başlığı</label>
            <div className="control">
              <input
                type="text"
                className="input is-medium"
                placeholder="Örn: 2023-2024 Fizik Finali"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <hr />

          {/* Soru Kartları */}
          {questions.map((q, index) => (
            <div className="card mb-5 has-background-white-ter" key={index}>
              <header className="card-header level is-mobile p-3">
                <div className="level-left">
                  <p className="card-header-title has-text-primary is-size-5">
                    {index + 1}. Soru
                  </p>
                </div>
                <div className="level-right">
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="button is-danger is-small is-outlined"
                      onClick={() => removeQuestion(index)}
                    >
                      <span className="icon">
                        <IoTrash />
                      </span>
                      <span>Sil</span>
                    </button>
                  )}
                </div>
              </header>
              
              <div className="card-content">
                <div className="content">
                  
                  <div className="columns">
                    <div className="column is-9">
                      <div className="field">
                        <label className="label">Soru Metni</label>
                        <div className="control">
                          <textarea
                            className="textarea"
                            rows="2"
                            placeholder="Soruyu buraya yazınız..."
                            value={q.questionText}
                            onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="column is-3">
                      <div className="field">
                        <label className="label has-text-danger">Doğru Cevap</label>
                        <div className="control">
                          <div className="select is-fullwidth is-danger">
                            <select
                              value={q.correctAnswer}
                              onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                              <option value="E">E</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="label">Şıklar</label>
                  <div className="columns is-multiline">
                    {["A", "B", "C", "D", "E"].map((opt) => (
                      <div className="column is-one-fifth" key={opt}>
                        <div className="field">
                          <div className="control has-icons-left">
                            <input
                              className="input is-small"
                              type="text"
                              placeholder={`${opt} Şıkkı`}
                              value={q[`option${opt}`]}
                              onChange={(e) => handleQuestionChange(index, `option${opt}`, e.target.value)}
                              required
                            />
                            <span className="icon is-small is-left">
                              <b>{opt}</b>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          ))}

          {/* Aksiyon Butonları */}
          <div className="level">
            <div className="level-left">
              <button
                type="button"
                className="button is-info is-medium"
                onClick={addQuestion}
              >
                <span className="icon">
                  <IoAddCircle />
                </span>
                <span>Yeni Soru Ekle</span>
              </button>
            </div>
            <div className="level-right">
              <button type="submit" className="button is-success is-medium px-6">
                Sınavı Kaydet
              </button>
            </div>
          </div>
          
        </form>
      </div>
    </Layout>
  );
};

export default AddExam;