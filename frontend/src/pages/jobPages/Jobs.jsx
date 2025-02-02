// src/pages/JobPage.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import { Spinner } from "../../components/Spinner";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import "./Jobs.css";

export function JobPage() {
    const jobsUrl = import.meta.env.VITE_REACT_APP_JOBS_URL;

    // Estados de las vacantes, loading y error
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estado para el modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);

    // Estado de los filtros
    const [filterName, setFilterName] = useState("");
    const [filterOpen, setFilterOpen] = useState("all"); // 'all' | 'true' | 'false'
    const [filterSort, setFilterSort] = useState("");   // '' | 'asc' | 'desc'

    const fetchJobs = useCallback(() => {
        setLoading(true);
        setError(null);
    
        // Build query params
        const params = new URLSearchParams();
        if (filterName) {
            params.set("name", filterName);
        }
        if (filterOpen !== "all") {
            params.set("open", filterOpen);
        }
        if (filterSort) {
            params.set("sort", filterSort);
        }
    
        // Simular una demora de 2 segundos para que se vea el spinner
        setTimeout(() => {
            axios
                .get(`${jobsUrl}/jobs?${params.toString()}`)
                .then((response) => {
                    setJobs(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                });
        }, 750);
    }, [filterName, filterOpen, filterSort, jobsUrl]);

    // Abrir el modal y guardar el job a eliminar
    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setModalVisible(true);
        setTimeout(() => setShowDeleteModal(true), 10);
    };

    // Confirmar eliminación
    const confirmDeleteJob = () => {
        if (!jobToDelete) return;
        
        setLoading(true);
        axios.delete(`${jobsUrl}/jobs/${jobToDelete._id}`)
            .then(() => {
                setJobs(jobs.filter(job => job._id !== jobToDelete._id)); // Eliminar del estado
                setShowDeleteModal(false); // Cerrar el modal
                toast.success("Vacante eliminada correctamente");
            })
            .catch(error => {
                console.error("Error deleting job:", error);
                setError(error);
            })
            .finally(() => setLoading(false));
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setTimeout(() => setModalVisible(false), 300);
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchJobs();
        }, 500);
        
        // Debounce para evitar múltiples llamadas al servidor si el usuario escribe rápido
        return () => clearTimeout(delay);
    }, [filterName, filterOpen, filterSort, jobsUrl, fetchJobs]);

    // Mostrar un toast si hay un error, pero no en el primer render para evitar un bucle
    useEffect(() => {
        if (error) {
            toast.error("Error al cargar las vacantes");
        }
    }, [error]);

    // Event handlers para cambios en los filtros
    const handleNameChange = (e) => {
        setFilterName(e.target.value);
    };

    const handleOpenChange = (e) => {
        setFilterOpen(e.target.value);
    };

    const handleSortChange = (e) => {
        setFilterSort(e.target.value);
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="container my-4">
            <h1 className="mb-4">Lista de Vacantes</h1>

            {/* Barra de filtros */}
            <div className="row g-3 mb-3">
                {/* Name Filter */}
                <div className="col-12 col-sm-4">
                    <label htmlFor="nameFilter" className="form-label">
                        Buscar por Título
                    </label>
                    <input
                        id="nameFilter"
                        type="text"
                        className="form-control"
                        placeholder="Ej: Desarrollador..."
                        value={filterName}
                        onChange={handleNameChange}
                    />
                </div>

                {/* Open Filter */}
                <div className="col-6 col-sm-3">
                    <label htmlFor="openFilter" className="form-label">
                        Estado
                    </label>
                    <select
                        id="openFilter"
                        className="form-select"
                        value={filterOpen}
                        onChange={handleOpenChange}
                    >
                        <option value="all">Todas</option>
                        <option value="true">Abiertas</option>
                        <option value="false">Cerradas</option>
                    </select>
                </div>

                {/* Sort Filter */}
                <div className="col-6 col-sm-3">
                    <label htmlFor="sortFilter" className="form-label">
                        Ordenar
                    </label>
                    <select
                        id="sortFilter"
                        className="form-select"
                        value={filterSort}
                        onChange={handleSortChange}
                    >
                        <option value="">Sin orden</option>
                        <option value="asc">Fecha Ascendente</option>
                        <option value="desc">Fecha Descendente</option>
                    </select>
                </div>

                {/* Botóm para crear otra vacante */}
                <div className="col-12 col-sm-2" style={{ alignSelf: "flex-end" }}>
                    <Link to="/jobs/createJob" className="btn btn-success" style={{ alignSelf: "flex-end" }}>
                        Crear Nueva Vacante
                    </Link>
                </div>
            </div>

            {/* Jobs List */}
            {jobs.length > 0 ? (
                <div className="jobs-list">
                    {jobs.map((job) => (
                        <div key={job._id} className="col">
                            <div className="card h-100">
                                <div className="card-body d-flex justify-content-between">
                                    <div>
                                        <span
                                            className={`badge mb-2 ${job.open ? "bg-success" : "bg-danger"
                                                }`}
                                        >
                                            {job.open ? "Abierta" : "Cerrada"}
                                        </span>
                                        <p className="text-muted m-0">
                                            Publicado el {new Date(job.createdAt).toLocaleDateString()}
                                        </p>
                                        <Link to={`/jobs/jobDetails/${job._id}`} className="card-title fs-4 text-primary" style={{ textDecoration: "none" }}>
                                                {job.jobTitle}
                                        </Link>

                                        <p className="card-text">{job.jobDescription}</p>
                                    </div>
                                    <div className="d-flex flex-column gap-2">
                                        <Link className="btn btn-primary" to={`/jobs/dashboard/${job._id}`}>Visualizar</Link>
                                        <Link className="btn btn-secondary" to={`/jobs/editJob/${job._id}`}>Editar</Link>
                                        <button className="btn btn-danger" onClick={() => handleDeleteClick(job)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay vacantes disponibles.</p>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {modalVisible && (
                <>
                    {/* Backdrop */}
                    <div className={`modal-backdrop fade ${showDeleteModal ? "show" : ""}`} />

                    {/* Modal */}
                    <div 
                        className={`modal fade ${showDeleteModal ? "show" : ""}`} 
                        tabIndex="-1" 
                        role="dialog" 
                        style={{ display: showDeleteModal ? "block" : "none" }}
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar Eliminación</h5>
                                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas eliminar la vacante <strong>{jobToDelete?.jobTitle}</strong>?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDeleteJob}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
