import axios from 'axios';
import { useState, useEffect } from "react";

export function CreateJobs(){
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ jobTitle: "", jobDescription: "" });
    
    const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;

    useEffect(() => {
        axios.get(`${jobsUrl}/jobs`)
        .then(response => {
            setJobs(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        }); 
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${jobsUrl}/jobs`, formData)
        .then(response => {
        setJobs([...jobs, response.data]); // Agregar el nuevo trabajo a la lista
        setFormData({ jobTitle: "", jobDescription: "" }); // Limpiar formulario
        })
        .catch(error =>{
            console.error("error creating job:", error);
            setError(error);
        });
    }

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p>Error fetching jobs: {error.message}</p>;

    return(
        <div>
        <h1>Jobs Page</h1>

        {/* Formulario para agregar trabajos */}
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
            <button type="submit">Add Job</button>
        </form>
    </div>
    );
}