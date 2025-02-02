import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export function JobDetailPage() {
    const { id } = useParams();
    const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [cv, setCv] = useState(null);
    const [experienceYears, setExperienceYears] = useState("");

    useEffect(() => {
        axios.get(`${jobsUrl}/jobs/${id}`)
            .then(response => {
                setJob(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [id, jobsUrl]);

    const handleApply = () => {
        if (!cv || !experienceYears) {
            toast.error("Por favor, sube tu CV y proporciona tu experiencia.");
            return;
        }

        if (experienceYears <= 0) {
            toast.error("Los años de experiencia deben ser un número positivo.");
            return;
        }

        const formData = new FormData();
        formData.append("cv", cv);
        formData.append("experienceYears", experienceYears);

        axios.post(`${jobsUrl}/jobs/apply/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            }
        })
        .then(() => toast.success("Aplicación enviada correctamente"))
        .catch(() => toast.error("Error al enviar la aplicación"));
    };

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar la vacante.</p>;

    return (
        <div className="container my-4">
            <h1 className="text-center">{job.jobTitle}</h1>
            <p className="text-center">{job.jobDescription}</p>

            <div className="d-flex flex-column align-items-center mt-4">
                <label className="form-label">Sube tu CV</label>
                <input 
                    type="file" 
                    className="form-control mb-2 w-50" 
                    onChange={(e) => setCv(e.target.files[0])}
                />

                <label className="form-label">Años de experiencia</label>
                <input 
                    type="number" 
                    className="form-control mb-3 w-25 text-center" 
                    min="1"
                    value={experienceYears} 
                    onChange={(e) => setExperienceYears(e.target.value)} 
                />

                <button className="btn btn-primary w-50" onClick={handleApply}>
                    Aplicar a esta vacante
                </button>
            </div>
        </div>
    );
}
