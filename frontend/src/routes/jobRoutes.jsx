import { Routes, Route } from "react-router-dom";
import { JobPage } from "../pages/JobPages/Jobs";
import { CreateJobs } from "../pages/JobPages/CreateJobs";
import { EditJobs } from "../pages/JobPages/EditJobs";
import Dashboard from "../pages/dashboardPages/Dashboard";

export function JobRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JobPage/>}/>
            <Route path="/createJob" element={<CreateJobs/>}/>
            <Route path="/editJob/:jobId" element={<EditJobs/>}/>
            <Route path="/dashboard/:jobId" element={<Dashboard/>}/>
        </Routes>
    );
}
