import { Routes, Route } from "react-router-dom";
import { JobPage } from "../pages/Jobs";
import { CreateJobs } from "../pages/CreateJobs";

export function JobRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JobPage/>}/>
            <Route path="/createJob" element={<CreateJobs/>}/>
        </Routes>
    );
}
