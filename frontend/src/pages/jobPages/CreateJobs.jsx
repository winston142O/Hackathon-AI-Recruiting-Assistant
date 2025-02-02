import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function CreateJobs() {
    const [formData, setFormData] = useState({ jobTitle: "", jobTags: "", jobDescription: "" });
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
        axios
            .post(`${jobsUrl}/jobs`, formData)
            .then(() => {
                setFormData({ jobTitle: "", jobTags: "", jobDescription: "" });
                toast.success("¡Vacante creada exitosamente!");
                navigate("/jobs");
            })
            .catch((error) => {
                console.error("Error creating job:", error);
                toast.error("Error creando la vacante");
            });
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Crear Nueva Vacante</h1>
            <Link to="/jobs" className="btn btn-secondary" style={{ marginBottom: "1rem" }}>
                Volver a la lista de jobs
            </Link>
            
            <p className="text-muted">Completa el siguiente formulario para crear una nueva vacante.</p>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <div className="mb-3">
                    <label htmlFor="jobTitle" className="form-label">Título de la vacante</label>
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
                <div className="mb-3">
                    <label htmlFor="jobDescription" className="form-label">Descripción de la vacante</label>
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
                <button type="submit" className="btn btn-primary btn-lg w-100">Crear Vacante</button>
            </form>
        </div>
    );
}
