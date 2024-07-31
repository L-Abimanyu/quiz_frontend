import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import black from "../Assets/black.jpg";
import "../App.css";
import { lobbyStyle } from "../pageStyle";
import { socket } from "../Auth/env";

function Result() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.emit("getUserScores", roomId);

    socket.on("userScores", (result) => {
      setScores(result.scores);
      setLoading(false);
    });

    return () => {
      socket.off("getUserScores");
      socket.off("userScores");
    };
  }, [roomId]);

  const getMaxScoreUser = (scores) => {
    let maxUser = null;
    let maxScore = -1;
    for (const [user, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        maxUser = user;
      }
    }
    return maxUser;
  };

  const maxScoreUser = getMaxScoreUser(scores);

  const handleOk = () => {
    socket.emit("endGame", roomId);
    navigate("/");
  };

  return (
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
        {loading ? (
          <h2>Loading...</h2> // Display loading indicator while loading
        ) : (
          <>
            <h1>Game Over</h1>
            <br />
            <h2>Scores</h2>
            <br />
            <ul style={{ listStyleType: "none" }}>
              {Object.entries(scores).map(([user, score]) => (
                <li
                  key={user}
                  style={{
                    fontSize: "30px",
                    marginTop: "5px",
                    marginLeft: "-20px",
                  }}
                >
                  {user}: {score}
                  &emsp;
                  {user === maxScoreUser ? (
                    <span style={{ color: "green" }}>Congrats!</span>
                  ) : (
                    <span style={{ color: "red" }}>Better luck next time</span>
                  )}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                handleOk();
              }}
              style={lobbyStyle.button}
            >
              EXIT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Result;
