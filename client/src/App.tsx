import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";
import PreGame from "./pages/PreGame";

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
