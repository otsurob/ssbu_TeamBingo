import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/" element={<Game />} />
        <Route path="/lobby/" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
