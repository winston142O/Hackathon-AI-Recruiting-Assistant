import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

    const handleSubmit = (e) => {
        e.preventDefault();

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

    if (loading) return <p className="text-center mt-4">Cargando Vacante...</p>;
    if (error) return <p className="text-danger text-center mt-4">Error al cargar la vacante.</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4" style={{ textAlign: "left" }}>Título de la Vacante:</h1>
            <p>{job.jobTitle}</p>
            <h2>Descripción:</h2>
            <p style={{ whiteSpace: "pre-line" }}>{job.jobDescription}</p>

            <Link to="/jobs" className="btn btn-secondary mb-3">Volver a la lista de trabajos</Link>

            <p className="text-muted">Completa los siguientes campos y sube tu CV para aplicar.</p>

            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                {/* CV Upload */}
                <div className="mb-3">
                    <label htmlFor="cv" className="form-label">Sube tu CV</label>
                    <input
                        type="file"
                        id="cv"
                        name="cv"
                        className="form-control"
                        accept=".pdf"
                        onChange={(e) => setCv(e.target.files[0])}
                        required
                    />
                </div>

                {/* Experience Years */}
                <div className="mb-3">
                    <label htmlFor="experienceYears" className="form-label">Años de experiencia</label>
                    <input
                        type="number"
                        id="experienceYears"
                        name="experienceYears"
                        className="form-control"
                        placeholder="Escribe tus años de experiencia..."
                        min="1"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        required
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-lg w-100">Aplicar a esta vacante</button>
            </form>
        </div>
    );
}
