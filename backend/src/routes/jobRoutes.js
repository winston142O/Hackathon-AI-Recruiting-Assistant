const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const { upload } = require("../utils/s3Utils");
const eventEmitter = require("../utils/events");
const ApplicationReview = require("../models/ApplicationReview");

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


/**
 * POST - Aplicar a una vacante
 * Body: { "cv": <PDF File>, "experienceYears": 5 }
 */
router.post("/apply/:id", upload.single("cv"), async (req, res) => {
    try {
        const { id } = req.params;
        const { experienceYears } = req.body;

        // Revisar que el job exista
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No CV file uploaded!" });
        }

        // GUardar la aplicación en la base de datos
        const newApplication = new Application({
            jobId: id,
            cvUrl: req.file.location, // S3 File URL
            experienceYears,
        });

        await newApplication.save();

        // Emitir evento
        console.log(`Emitting event 'cvUploaded' for Application ID: ${newApplication._id}`);
        eventEmitter.emit("cvUploaded", newApplication);

        return res.status(201).json({
            message: "Aplicación enviada exitosamente!",
            application: newApplication,
        });

    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * GET - Recuperar el CV de un aplicante
 */
router.get("/applications/:applicationId", async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Buscar la aplicación en la base de datos
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Return CV URL
        return res.status(200).json({
            message: "CV recuperado exitosamente",
            cvUrl: application.cvUrl,  // URL del S3
        });

    } catch (error) {
        console.error("Error retrieving CV:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * GET - Recuperar la revisión de un CV
 */
router.get("/applications/:applicationId/review", async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Buscar la revisión en la base de datos
        const review = await ApplicationReview.findOne({ applicationId });

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        return res.status(200).json({
            message: "Review retrieved successfully",
            review,
        });

    } catch (error) {
        console.error("Error fetching CV review:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * GET - Recuperar todas las aplicaciones de CV para una vacante
 */
router.get("/:jobId/applications", async (req, res) => {
    try {
        const { jobId } = req.params;

        // Buscar todas las aplicaciones en la base de datos
        const applications = await Application.find({ jobId });

        return res.status(200).json({
            message: "Applications retrieved successfully",
            applications,
        });

    } catch (error) {
        console.error("Error fetching CV applications:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * GET - Recuperar todas las revisiones de CV para una vacante
 */
router.get("/applications/:jobId/reviews", async (req, res) => {
    try {
        const { jobId } = req.params;

        // Buscar todas las revisiones en la base de datos
        const reviews = await ApplicationReview.find({ jobId });

        return res.status(200).json({
            message: "Reviews retrieved successfully",
            reviews,
        });

    } catch (error) {
        console.error("Error fetching CV reviews:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
