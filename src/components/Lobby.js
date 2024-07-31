import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import black from "../Assets/black.jpg";
import "../App.css";
import { lobbyStyle } from "../pageStyle";
import { socket } from "../Auth/env"; 



// const  socket = io('https://quiz-backend-1-5cq2.onrender.com:8000')

function Lobby() {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [name, setName] = useState("");
  const [joinNames, setJoinNames] = useState({});

  useEffect(() => {
    socket.on("availableRooms", (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on("errorName", (message) => {
      MySwal.fire({
        title: <p>{message}</p>,
        icon: "error",
        confirmButtonText: "Ok",
      });
    });

    socket.on("navigateToGame", (roomId) => {
      navigate(`/game/${roomId}`);
      window.location.reload();
    });

    return () => {
      socket.off("availableRooms");
      socket.off("navigateToGame");
    };
  }, [navigate]);

  const createRoom = () => {
    if (name.trim() === "") {
      MySwal.fire({
        title: <p>Please Enter Name</p>,
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    socket.emit("createRoom", name);
    localStorage.setItem("Name", name);
    setName("");
  };

  const joinRoom = (roomId) => {
    const joinName = joinNames[roomId];
    if (!joinName || joinName.trim() === "") {
      MySwal.fire({
        title: <p>Please Enter Name</p>,
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }
    socket.emit("joinRoom", joinName, roomId);
    localStorage.setItem("Name", joinName);
    setJoinNames({ ...joinNames, [roomId]: "" });
  };

  const handleJoinNameChange = (roomId, value) => {
    setJoinNames({ ...joinNames, [roomId]: value });
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
        <h1>QUIZ GAME</h1>
        <br /> <br />
        <p style={lobbyStyle.inputlabel}>NAME</p>
        <input
          className="form-control ml-3"
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          style={{ marginLeft: "7px" }}
        />
        <button
          className="btn btn-primary m-2"
          style={lobbyStyle.button}
          onClick={createRoom}
        >
          Create Room
        </button>
        <br /> <br /> <br />
        <h2>Available Rooms</h2>
        <br/>
        <div style={lobbyStyle.roomList}>
          {availableRooms.length === 0 ? (
            <center>
              <h4>No rooms available !</h4>
            </center>
          ) : (
            availableRooms.map((room, index) => (
              <div
                key={room.roomId}
                className="card"
                style={{ marginTop: "2em", padding: "5px" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Room ID: {index + 1}</h5>
                  <p>NAME</p>
                  <input
                    className="form-control ml-7px"
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) =>
                      handleJoinNameChange(room.roomId, e.target.value)
                    }
                    style={{ marginLeft: "7px" }}
                    value={joinNames[room.roomId] || ""}
                  />
                  <br />
                  <h6>Users: {room.users.length}/2</h6>
                  <br />
                  <button
                    className="btn btn-secondary m-2"
                    style={lobbyStyle.button}
                    onClick={() => joinRoom(room.roomId)}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Lobby;
