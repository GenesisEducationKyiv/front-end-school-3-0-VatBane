import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TrackListPage from "./pages/TrackListPage/TrackListPage.tsx";
import "./App.css"

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/tracks" element={<TrackListPage />} />
                <Route path="/" element={<Navigate to="/tracks" replace />} />
            </Routes>
        </Router>
    );
};

export default App;