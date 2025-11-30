import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoAddCircle, IoTrash, IoSave } from "react-icons/io5";

const EditExam = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getExamById();
  }, [id]);

  const getExamById = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/${id}`);
      setTitle(response.data.title);
      
      // DÜZELTME BURADA: 'QuestionsList' yerine 'questions' kullanıldı
      if (response.data.questions) {
          const sortedQuestions = response.data.questions.sort((a, b) => a.questionNumber - b.questionNumber);
          setQuestions(sortedQuestions);
      }
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        optionA: "", optionB: "", optionC: "", optionD: "", optionE: "",
        correctAnswer: "A",
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      alert("En az bir soru olmalıdır!");
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateExam = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5050/exams/${id}`, {
        title: title,
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
        <h1 className="title">Sınavı Düzenle</h1>
        <h2 className="subtitle">Toplam Soru: <span className="has-text-info">{questions.length}</span></h2>
        
        <form onSubmit={updateExam}>
          <p className="has-text-centered has-text-danger mb-3">{msg}</p>

          <div className="field mb-5">
            <label className="label is-large">Sınav Başlığı</label>
            <div className="control">
              <input
                type="text"
                className="input is-medium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <hr />

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
                      <span className="icon"><IoTrash /></span>
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
                              {['A','B','C','D','E'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
                            <span className="icon is-small is-left"><b>{opt}</b></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="level">
            <div className="level-left">
              <button type="button" className="button is-info" onClick={addQuestion}>
                <span className="icon"><IoAddCircle /></span>
                <span>Soru Ekle</span>
              </button>
            </div>
            <div className="level-right">
              <button type="submit" className="button is-success is-medium px-6">
                <span className="icon"><IoSave /></span>
                <span>Değişiklikleri Kaydet</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditExam;