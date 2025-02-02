// Importaciones de librerías y componentes
import { Pie } from 'react-chartjs-2'; // Componente de gráfico circular
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Elementos de Chart.js
import { useEffect } from 'react'; // Hook de React para efectos secundarios
import AOS from 'aos'; // Librería para animaciones de scroll
import 'aos/dist/aos.css'; // Estilos CSS para las animaciones
import "./Dashboard.css"; // Estilos personalizados del dashboard
import CountUp from 'react-countup'; // Componente para animación numérica

// Registro de componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Componente principal del Dashboard
export default function Dashboard() {
  // Datos de ejemplo para el gráfico circular
  const applicantsData = {
    labels: ['Hired', 'Rejected', 'Pending'], // Categorías del gráfico
    datasets: [
      {
        data: [12, 5, 7], // Valores numéricos para cada categoría
        backgroundColor: [ // Colores de fondo para cada segmento
          '#4CAF50', // Verde para contratados
          '#F44336', // Rojo para rechazados
          '#9E9E9E', // Gris para pendientes
        ],
        borderColor: [ // Color del borde de los segmentos
          '#fff',
          '#fff',
          '#fff',
        ],
        borderWidth: 2, // Grosor del borde
      },
    ],
  };

  // Función para calcular el total de aplicantes
  const getTotalApplicants = (chartData) => {
    return chartData.datasets.reduce(
      (total, dataset) => total + dataset.data.reduce((sum, num) => sum + num, 0),
      0
    );
  };

  // Lista de ejemplo de mejores aplicantes
  const topApplicants = [
    { name: 'John Doe', status: 'Hired' },
    { name: 'Jane Smith', status: 'Pending' },
    { name: 'Mike Johnson', status: 'Rejected' },
    { name: 'Sarah Williams', status: 'Hired' },
  ];

  // Efecto para inicializar las animaciones al montar el componente
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Configuración inicial con duración de 1 segundo
  }, []); // Array de dependencias vacío para ejecutar solo una vez

  return (
    <div className="dashboard-container">
      {/* Título principal con animación fade-up */}
      <h1 data-aos="fade-up">Applicants Dashboard</h1>

      <div className="dashboard-content">
        {/* Sección del gráfico */}
        <div className="chart-section">
          {/* Contenedor del total de aplicantes con animación fade-right */}
          <div className="total-applicants" data-aos="fade-right">
            <h2>Total Applicants</h2>
            {/* Animación numérica del total */}
            <p className="total-number">
              <CountUp 
                start={0} // Valor inicial de la animación
                end={getTotalApplicants(applicantsData)} // Valor final calculado
                duration={3} // Duración de la animación en segundos
              />
            </p>
          </div>

          {/* Contenedor del gráfico circular con animación zoom-in */}
          <div className="pie-chart" data-aos="zoom-in">
            <Pie
              data={applicantsData} // Datos del gráfico
              options={{
                responsive: true, // Gráfico responsive
                maintainAspectRatio: false, // Permite modificar la relación de aspecto
                plugins: {
                  legend: { // Configuración de la leyenda
                    position: 'top', // Posición superior
                    labels: {
                      font: {
                        size: 12 // Tamaño de fuente de las etiquetas
                      }
                    }
                  },
                  title: { // Configuración del título
                    display: true,
                    text: 'Applicants Status', // Texto del título
                    color: '#fff', // Color del texto
                    font: {
                      size: 14 // Tamaño de fuente del título
                    }
                  }
                }
              }}
              height={750} // Altura del gráfico
              width={750} // Ancho del gráfico
            />
          </div>
        </div>

        {/* Lista de mejores aplicantes con animación fade-left */}
        <div className="top-list" data-aos="fade-left">
          <h2>Top Applicants</h2>
          <ul className="applicants-list">
            {topApplicants.map((applicant, index) => (
              // Elemento de la lista con key único
              <li key={index} className="applicant-item">
                <span>{applicant.name}</span>
                {/* Estado con clase dinámica según el status */}
                <span className={`status ${applicant.status.toLowerCase()}`}>
                  {applicant.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}