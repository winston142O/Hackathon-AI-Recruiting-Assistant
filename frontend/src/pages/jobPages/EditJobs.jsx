import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

export function EditJobs() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ jobTitle: "", jobDescription: "", open: true });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;

    useEffect(() => {
        axios.get(`${jobsUrl}/jobs/${jobId}`)
            .then(response => {
                setFormData({
                    jobTitle: response.data.jobTitle,
                    jobDescription: response.data.jobDescription,
                    open: response.data.open
                });
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [jobId, jobsUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "open" ? value === "true" : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${jobsUrl}/jobs/${jobId}`, formData)
            .then(() => {
                toast.success("Vacante actualizada exitosamente");
                navigate("/jobs");
            })
            .catch(error => {
                console.error('Error editing job:', error);
                setError(error);
                toast.error("Error al actualizar la vacante");
            });
    };

    if (loading) return <p className="text-center mt-4">Cargando Vacante...</p>;
    if (error) return <p className="text-danger text-center mt-4">Error al cargar la vacante: {error.message}</p>;

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Editar Vacante</h1>

            <Link to="/jobs" className="btn btn-secondary mb-3">Volver a la lista de trabajos</Link>

            <p className="text-muted">Modifica los datos de la vacante y guarda los cambios.</p>

            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                {/* Job Title */}
                <div className="mb-3">
                    <label htmlFor="jobTitle" className="form-label">Título de la Vacante</label>
                    <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        className="form-control"
                        placeholder="Escribe el título de la vacante aquí..."
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Job Description */}
                <div className="mb-3">
                    <label htmlFor="jobDescription" className="form-label">Descripción</label>
                    <textarea
                        id="jobDescription"
                        name="jobDescription"
                        className="form-control"
                        placeholder="Escribe la descripción de la vacante aquí..."
                        rows="3"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Job Status (Open/Closed) */}
                <div className="mb-3">
                    <label htmlFor="open" className="form-label">Estado de la Vacante</label>
                    <select
                        id="open"
                        name="open"
                        className="form-select"
                        value={formData.open}
                        onChange={handleChange}
                    >
                        <option value="true">Abierta</option>
                        <option value="false">Cerrada</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-lg w-100">Guardar Cambios</button>
            </form>
        </div>
    );
}
