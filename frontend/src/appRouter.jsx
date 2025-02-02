// src/appRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { JobRoutes } from "./routes/jobRoutes";
import { Navbar } from "./components/NavBar";

export const AppRouter = () => {
    return (
        <Router>
            <>
                <ToastContainer />
                <Navbar />

                <Routes>    
                    <Route path="/jobs/*" element={<JobRoutes />} />

                    {/* 404 - Not Found (fallback) */}
                    <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
            </>
        </Router>
    );
};
