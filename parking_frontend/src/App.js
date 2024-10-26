import './App.css';
import {Routes, Route} from "react-router-dom";
import Main from "./page/Main";

function App() {
    return (
        <div className="page">
            <Routes>
                <Route path="/search/:keyword" element={<Main />} />
                <Route path="/" element={<Main />} />
            </Routes>
        </div>
    );
}

export default App;
