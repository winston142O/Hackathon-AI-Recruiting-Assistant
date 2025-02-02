import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
//import axios from 'axios';
import "./Dashboard.css";
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

  const topApplicants = [
    { name: 'John Doe', status: 'Hired' },
    { name: 'Jane Smith', status: 'Pending' },
    { name: 'Mike Johnson', status: 'Rejected' },
    { name: 'Sarah Williams', status: 'Hired' },
  ];

  return (
    <div className="dashboard-container">
      <h1>Applicants Dashboard</h1>

      <div className="dashboard-content">
        <div className="chart-section">
          <div className="total-applicants">
            <h2>Total Applicants</h2>
            <p className="total-number">24</p>
          </div>

          <div className="pie-chart">
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
        height={300}
        width={400}
        />
          </div>
        </div>

        <div className="top-list">
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