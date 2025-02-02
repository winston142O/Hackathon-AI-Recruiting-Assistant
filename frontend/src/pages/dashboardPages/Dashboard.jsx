import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css"; // Estilos de AOS
import "./Dashboard.css";
import CountUp from "react-countup";

ChartJS.register(ArcElement, Tooltip, Legend);

// Componente principal del Dashboard
export default function Dashboard() {
  const { jobId } = useParams(); // ID de la vacante
  const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    if (!jobId) {
      setError("ID de vacante no encontrado.");
      setLoading(false);
      return;
    }

    axios
      .get(`${jobsUrl}/jobs/${jobId}/applications`)
      .then((response) => {
        setApplications(response.data.applications || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
        setError(error);
        setLoading(false);
      });
  }, [jobId, jobsUrl]);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-danger text-center mt-4">Error: {error.message || error}</p>;

  // Procesar datos para el pie chart basado en experiencia
  const experienceData = {};
  applications.forEach(({ experienceYears }) => {
    if (!experienceData[experienceYears]) {
      experienceData[experienceYears] = 0;
    }
    experienceData[experienceYears]++;
  });

  // Formatear datos para ChartJS
  const chartData = {
    labels: Object.keys(experienceData).map((years) => `${years} años`),
    datasets: [
      {
        data: Object.values(experienceData),
        backgroundColor: ["#4CAF50", "#F44336", "#9E9E9E", "#FF9800", "#3F51B5"],
        borderColor: ["#fff", "#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  // Contar total de aplicaciones
  const totalApplicants = applications.length;

  // Ordenar los candidatos por años de experiencia (ascendente)
  const sortedApplicants = [...applications].sort(
    (a, b) => a.experienceYears - b.experienceYears
  );

  return (
    <div className="dashboard-container">
      <h1 data-aos="fade-up">Dashboard de Aplicantes</h1>
      <Link to="/jobs" className="btn btn-secondary mb-3">Volver a la lista de trabajos</Link>

      <div className="dashboard-content">
        {/* Sección del Total de Aplicantes */}
        <div className="chart-section">
          {/* Contenedor del total de aplicantes con animación fade-right */}
          <div className="total-applicants" data-aos="fade-right">
            <h2>Total Aplicaciones</h2>
            <p className="total-number">
              <CountUp start={0} end={totalApplicants} duration={3} />
            </p>
          </div>

          {/* Pie Chart basado en años de experiencia */}
          <div className="pie-chart" data-aos="zoom-in">
            <Pie
              data={chartData}
              options={{
                responsive: true, // Gráfico responsive
                maintainAspectRatio: false, // Permite modificar la relación de aspecto
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: {
                        size: 12,
                      },
                    },
                  },
                  title: { // Configuración del título
                    display: true,
                    text: "Distribución de Experiencia (Años)",
                    color: "#fff",
                    font: {
                      size: 14,
                    },
                  },
                },
              }}
              height={750} // Altura del gráfico
              width={750} // Ancho del gráfico
            />
          </div>
        </div>

        {/* Lista de los mejores candidatos */}
        <div className="top-list" data-aos="fade-left">
          <h2>Top Candidatos (Más Experimentados)</h2>
          <ul className="applicants-list">
            {sortedApplicants.map((applicant, index) => (
              <li key={index} className="applicant-item">
                <span>{`Candidato #${index + 1}`}</span>
                <span className="experience">
                  {applicant.experienceYears} años
                </span>
                <Link className="btn btn-primary" to={`/jobs/${jobId}/applications/${applicant._id}/review`}>
                  Visualizar Reseña
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
