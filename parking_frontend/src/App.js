import './App.css';
import Main from "./page/Main";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="page">
      <Routes>
        <Route path="/" element={<Main/>} />
      </Routes>
    </div>
  );
}

export default App;
