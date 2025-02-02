import { Routes, Route } from "react-router-dom";
import { JobPage } from "../pages/jobPages/Jobs";
import { CreateJobs } from "../pages/jobPages/CreateJobs";
import { EditJobs } from "../pages/jobPages/EditJobs";

export function JobRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JobPage/>}/>
            <Route path="/createJob" element={<CreateJobs/>}/>
            <Route path="/editJob/:jobId" element={<EditJobs/>}/>
        </Routes>
    );
}
