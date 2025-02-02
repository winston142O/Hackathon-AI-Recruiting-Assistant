import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Estilos de AOS
import "./Dashboard.css";
import CountUp from 'react-countup';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {

  // Datos dummy
  const applicantsData = {
    labels: ['Hired', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [12, 5, 7],
        backgroundColor: [
          '#4CAF50',
          '#F44336',
          '#9E9E9E',
        ],
        borderColor: [
          '#fff',
          '#fff',
          '#fff',
        ],
        borderWidth: 2,
      },
    ],
  };

  const getTotalApplicants = () => {
    return applicantsData.datasets[0].data.reduce((sum, num) => sum + num, 0);
  };

  const topApplicants = [
    { name: 'John Doe', status: 'Hired' },
    { name: 'Jane Smith', status: 'Pending' },
    { name: 'Mike Johnson', status: 'Rejected' },
    { name: 'Sarah Williams', status: 'Hired' },
  ];

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Inicia AOS con una duración de animación de 1 segundo
  }, []);

  return (
    <div className="dashboard-container">
      <h1 data-aos="fade-up">Applicants Dashboard</h1>

      <div className="dashboard-content">
        <div className="chart-section">
          <div className="total-applicants" data-aos="fade-right">
            <h2>Total Applicants</h2>
            <p className="total-number">
              <CountUp start={0} end={24} duration={3} /> {/* Animación del número */}
            </p>          
          </div>

          <div className="pie-chart" data-aos="zoom-in">
            <Pie
              data={applicantsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      font: {
                        size: 12
                      }
                    }
                  },
                  title: {
                    display: true,
                    text: 'Applicants Status',
                    color: '#fff',
                    font: {
                      size: 14
                    }
                  }
                }
              }}
              height={750}
              width={750}              
            />
          </div>
        </div>

        <div className="top-list" data-aos="fade-left">
          <h2>Top Applicants</h2>
          <ul className="applicants-list">
            {topApplicants.map((applicant, index) => (
              <li key={index} className="applicant-item">
                <span>{applicant.name}</span>
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
