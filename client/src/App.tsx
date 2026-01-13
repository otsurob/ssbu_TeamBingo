import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Lobby from "./pages/lobby";
import PreGame from "./pages/room";
import Game from "./pages/game";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/" element={<Lobby />} />
        <Route path="/preGame/" element={<PreGame />} />
        <Route path="/game/" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
