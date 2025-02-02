import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, TimeScale } from "chart.js";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css"; // AOS for animations
import "./Dashboard.css";
import CountUp from "react-countup";
import "chartjs-adapter-date-fns"; // Import time adapter for date parsing

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, TimeScale);

export default function Dashboard() {
  const { jobId } = useParams();
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

  // 🔹 Process data for Pie Chart (Experience Distribution)
  const experienceData = {};
  applications.forEach(({ experienceYears }) => {
    experienceData[experienceYears] = (experienceData[experienceYears] || 0) + 1;
  });

  const pieChartData = {
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

  // 🔹 Process data for Line Chart (Experience over Time)
  const sortedApplications = [...applications].sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));

  const lineChartData = {
    labels: sortedApplications.map((app) => new Date(app.appliedAt)), // X-axis (time)
    datasets: [
      {
        label: "Experiencia en años",
        data: sortedApplications.map((app) => app.experienceYears), // Y-axis (experience)
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        pointBorderColor: "#007bff",
        pointBackgroundColor: "#007bff",
        tension: 0.3, // Smooth curves
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "yyyy-MM-dd HH:mm",
          displayFormats: {
            day: "yyyy-MM-dd",
          },
        },
        title: {
          display: true,
          text: "Fecha de Aplicación",
        },
      },
      y: {
        title: {
          display: true,
          text: "Años de Experiencia",
        },
        ticks: {
          stepSize: 1, // Increment by 1 year
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1 data-aos="fade-up">Dashboard de Aplicantes</h1>
      <Link to="/jobs" className="btn btn-secondary mb-3">Volver a la lista de trabajos</Link>

      <div className="dashboard-content">
        {/* Sección del Total de Aplicantes */}
        <div className="chart-section">
          <div className="total-applicants" data-aos="fade-right">
            <h2>Total de Aplicaciones</h2>
            <p className="total-number">
              <CountUp start={0} end={applications.length} duration={3} />
            </p>
          </div>

          {/* Pie Chart */}
          <div className="pie-chart" data-aos="zoom-in">
            <Pie data={pieChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: {
                  display: true,
                  text: "Distribución de Experiencia (Años)",
                },
              },
            }} height={750} width={750} />
          </div>

          {/* Line Chart */}
          <div className="line-chart mt-5" data-aos="fade-left">
            <h2 className="text-center">Tendencias de Aplicación vs. Experiencia</h2>
            {applications.length > 0 ? (
              <div className="chart-container">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            ) : (
              <p className="text-center">Cargando datos...</p>
            )}
          </div>
        </div>

        {/* Lista de los mejores candidatos */}
        <div className="top-list" data-aos="fade-left">
          <h2>Top Candidatos (Más Experimentados)</h2>
          <ul className="applicants-list">
            {sortedApplications
              .sort((a, b) => b.experienceYears - a.experienceYears)
              .map((applicant, index) => (
                <li key={index} className="applicant-item">
                  <span>{`Candidato #${index + 1}`}</span>
                  <span className="experience">{applicant.experienceYears} años</span>
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
