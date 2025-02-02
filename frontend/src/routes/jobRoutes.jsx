import { Routes, Route } from "react-router-dom";
import { JobPage } from "../pages/Jobs";

export function JobRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JobPage/>}/>
        </Routes>
    );
}
