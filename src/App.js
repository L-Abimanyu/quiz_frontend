import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Result from './components/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Lobby />} />
        <Route path="/game/:roomId" element={<Game />} />
        <Route path="/result/:roomId" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
