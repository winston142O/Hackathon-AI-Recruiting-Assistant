import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export function ReviewPage() {
    const { jobId, applicationId } = useParams();
    const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;

    const [review, setReview] = useState(null);
    const [cvUrl, setCvUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(`🔍 Solicitando reseña para la aplicación ID: ${applicationId}`);

        axios
            .get(`${jobsUrl}/jobs/applications/${applicationId}/review`)
            .then((response) => {
                console.log("Respuesta de la API:", response.data);
                if (response.data.review) {
                    setReview(response.data.review);
                } else {
                    console.warn("No se encontró una reseña en la respuesta:", response.data);
                    setError("No se encontró ninguna reseña.");
                }
            })
            .catch((error) => {
                console.error("Error al obtener la reseña:", error);
                setError("Error al obtener la reseña.");
            });

        axios
            .get(`${jobsUrl}/jobs/applications/${applicationId}`)
            .then((response) => {
                console.log("📄 CV URL:", response.data.cvUrl);
                setCvUrl(response.data.cvUrl);
            })
            .catch((error) => {
                console.error("Error al obtener el CV:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [applicationId, jobsUrl]);

    if (loading) return <p className="text-center mt-4">Cargando reseña...</p>;
    if (error) return <p className="text-danger text-center mt-4">Error: {error.message || error}</p>;

    const formatReviewText = (text) => {
        return text.split("\n\n").map((section, index) => {
            // Detectar si la sección es una lista numerada
            if (/^\d+\./.test(section.trim())) {
                const listItems = section.split("\n").map((line, idx) => (
                    <li key={idx}>{line.replace(/^\d+\.\s*/, "")}</li>
                ));
                return <ul key={index}>{listItems}</ul>;
            }
            return <p key={index} className="text-justify">{section}</p>;
        });
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Reseña del Candidato</h1>
            <Link to={`/jobs/dashboard/${jobId}`} className="btn btn-secondary mb-3">
                Volver al Dashboard
            </Link>

            <div className="p-4 border rounded shadow-sm bg-light">
                <h4>Detalles de la Reseña</h4>
                <p><strong>Aplicante ID:</strong> {review.applicationId}</p>
                <p><strong>Fecha de Reseña:</strong> {new Date(review.reviewedAt).toLocaleString()}</p>
                <hr />
                <h5>Evaluación del Candidato</h5>
                
                {/* Formatear texto de la reseña con listas bien estructuradas */}
                {formatReviewText(review.reviewText)}

                {/* Botón para descargar el CV */}
                {cvUrl && (
                    <div className="mt-4">
                        <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            📄 Descargar CV
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
