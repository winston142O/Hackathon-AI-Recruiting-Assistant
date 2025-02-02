import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-3 shadow-lg">
            <div className="container">
                <Link to="/Jobs" className="navbar-brand">
                Job Recruiting Assistance
                </Link>
                {/* Toggler para móvil */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                        <Link to="/Jobs/" className="nav-link">
                            Vacantes
                        </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
