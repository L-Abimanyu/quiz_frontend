import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import black from "../Assets/black.jpg";
import "../App.css";
import { lobbyStyle } from "../pageStyle";
import { socket } from "../Auth/env";

function Game() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  const getName = localStorage.getItem("Name");

  useEffect(() => {
    socket.emit("startGame", roomId);
    setLoading(true);

    socket.on("question", (question) => {
      setQuestion(question);
      setSeconds(15);
      setLoading(false);
    });

    socket.on("navigateToResult", (roomId) => {
      navigate(`/result/${roomId}`);
      window.location.reload();
    });

    return () => {
      socket.off("question");
      socket.off("gameOver");
      socket.off("navigateToResult");
    };
  }, [roomId, navigate]);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0 && question !== "") {
      submitAnswer();
    }
  }, [seconds]);

  const submitAnswer = () => {
    socket.emit("answer", roomId, answer, getName);
    setAnswer("");
    setLoading(true);
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center vh-100 p-3 p-md-5"
        style={{
          backgroundImage: `url(${black})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "JostMedium",
        }}
      >
        <div style={lobbyStyle.container}>
          <h1>QUIZ GAME</h1>
          <br /> <br />
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <>
              <h1>{question}</h1>
              <h2>Time left: {seconds} seconds</h2>
              <input
                type="text"
                className="form-control"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Your answer"
              />
              <br />
              <button
                className="btn btn-primary m-2"
                style={lobbyStyle.button}
                onClick={submitAnswer}
              >
                Submit Answer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;
