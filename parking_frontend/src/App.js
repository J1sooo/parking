import './App.css';
import {Routes, Route} from "react-router-dom";
import Main from "./page/Main";
import ParkingDetail from './page/ParkingDetail';

function App() {
    return (
        <div className="page">
            <Routes>
                <Route path="/search/:keyword" element={<Main />} />
                <Route path="/" element={<Main />} />
                <Route path="/parking/:prkplceNo" element={<ParkingDetail />} />
            </Routes>
        </div>
    );
}

export default App;
