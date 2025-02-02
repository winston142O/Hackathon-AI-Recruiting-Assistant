const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

/**
 * CREATE - Crear un nuevo job
*/
router.post("/", async (req, res) => {
    try {
        const { jobTitle, jobDescription } = req.body;

        const newJob = await Job.create({
            jobTitle,
            jobDescription,
            // open: true (por defecto)
            // closed_at: undefined (null por defecto)
            // createdAt: now
            // updatedAt: now
        });

        return res.status(201).json(newJob);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

/**
 * GET - Ver todos los jobs con filtros y ordenación
*/
router.get("/", async (req, res) => {
    try {
        const { name, open, sort } = req.query;
        const query = {};

        // Aplicar filtros
        if (name) {
            query.jobTitle = { $regex: name, $options: "i" };
        }
        if (open !== undefined) {
            // 'open' es un string en req.query; convertir a booleano
            query.open = open === "true";
        }
        let sortOption = {};
        if (sort === "asc") {
            sortOption.createdAt = 1; // ascendente
        } else if (sort === "desc") {
            sortOption.createdAt = -1; // descendente
        }

        // Recuperar jobs de la base de datos
        const jobs = await Job.find(query).sort(sortOption);

        return res.json(jobs);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/**
 * GET - Inspeccionar un job por ID
*/
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        return res.json(job);
    } catch (error) {
        return res.status(400).json({ error: "ID inválido" });
    }
});

/**
 * UPDATE - Actualizar un job por ID
*/
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            jobTitle,
            jobDescription,
            open, // opcional
        } = req.body;

        const updateFields = {
            jobTitle,
            jobDescription,
            updatedAt: new Date(), // ahora
        };

        if (typeof open !== "undefined") {
            updateFields.open = open;
            if (!open) {
                updateFields.closed_at = new Date();
            } else {
                updateFields.closed_at = null;
            }
        }

        const updatedJob = await Job.findByIdAndUpdate(id, updateFields, {
            new: true,
            runValidators: true,
        });

        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found" });
        }
        return res.json(updatedJob);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

/**
 * DELETE - Eliminar un job por ID
*/
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
        return res.status(404).json({ error: "Job not found" });
        }
        return res.json({ message: "Job Eliminado Exitosamente" });
    } catch (error) {
        return res.status(400).json({ error: "ID inválido" });
    }
});

module.exports = router;
