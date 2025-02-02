import axios from 'axios'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function EditJobs(){

    const {jobId} = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState({ jobTitle: "", jobDescription: "" , open: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ jobTitle: "", jobDescription: "", open: true });

    const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;

    useEffect(() =>{
        axios.get(`${jobsUrl}/jobs/${jobId}`)
        .then(response =>{
            setJob(response.data);
            setFormData(
                {jobTitle: response.data.jobTitle, 
                jobDescription: response.data.jobDescription,
                open: response.data.open
            });
            setLoading(false);
        })
        .catch(error =>{
            setError(error);
            console.error(error);
            setLoading(false);
        })
    },[jobId, jobsUrl]);

    const handleChange = (e) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value });
    } 

    console.log(formData)
    const handleSubmit = (e) =>{
        e.preventDefault();
        axios.put(`${jobsUrl}/jobs/${jobId}`, formData)
        .then(response =>{
            navigate("/jobs");
        })
        .catch(error =>{
            console.error('error editing job');
            setError(error);
        });
    };

    if(loading) return <p>Loading Job...</p>;
    if(error) return <p>Error fetching the job {error.message}</p>
    return(
            <div>
            <h1>Edit Job</h1>

            {/* Formulario para editar trabajo */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="jobDescription"
                    placeholder="Job Description"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    required
                />
                <select 
                    name="open" 
                    value={formData.open} 
                    onChange={handleChange} 
                >
                    <option value="true">Open</option>
                    <option value="false">Closed</option>
                </select>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}