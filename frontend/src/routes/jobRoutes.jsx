import { Routes, Route } from "react-router-dom";
import { JobPage } from "../pages/Jobs";
import { CreateJobs } from "../pages/CreateJobs";
import { EditJobs } from "../pages/EditJobs";

export function JobRoutes() {
    return (
        <Routes>
            <Route path="/" element={<JobPage/>}/>
            <Route path="/createJob" element={<CreateJobs/>}/>
            <Route path="/editJob/:jobId" element={<EditJobs/>}/>
        </Routes>
    );
}
