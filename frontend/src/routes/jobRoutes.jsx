import { Routes, Route } from "react-router-dom";

export function JobRoutes() {
    return (
        <Routes>
            <Route path="/" element={<h1>Todos los jobs (pasa el comp aqui cuando esté ready)</h1>} />
        </Routes>
    );
}
