import axios from 'axios'
import { useState, useEffect } from "react";

export function JobPage() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;


    useEffect(() => {

        axios.get(`${jobsUrl}/jobs`)
        .then(response => {
            setJobs(response.data);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, []);

    if(loading) return <p>Loading jobs...</p>;
    if(error) return <p>Error fetching jobs {error}</p>;


    return(
        <div>
            <h1>
                Jobs Page
            </h1>
            {jobs.length > 0 ? (
                <ul>
                {jobs.map(job => (
                    <li key={job._id}>
                    <h2>{job.jobTitle}</h2>
                    <p>{job.jobDescription}</p>
                    <p>Status: {job.open ? "Open" : "Closed"}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p>No jobs available</p>
            )}
        </div>
    );
}