const axios = require("axios");
const pdfParse = require("pdf-parse");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../utils/s3Utils");  // ✅ Now correctly importing `s3`
const ApplicationReview = require("../models/ApplicationReview");
const Job = require("../models/Job");
const eventEmitter = require("./events");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const extractTextFromS3Pdf = async (s3Url) => {
    try {
        console.log(`Downloading and extracting text from: ${s3Url}`);

        // Extraer la llave del archvio
        const urlParts = new URL(s3Url);
        let s3Key = decodeURIComponent(urlParts.pathname.replace(/^\/+/, "")); // Remove leading "/"
        if (s3Key.startsWith(`${process.env.S3_BUCKET_NAME}/`)) {
            s3Key = s3Key.replace(`${process.env.S3_BUCKET_NAME}/`, "");
        }

        console.log(`Final Extracted S3 Key: "${s3Key}"`);

        // Buscar el archivo en el S3
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
        });

        const { Body } = await s3.send(command);
        const pdfBuffer = await Body.transformToByteArray();
        const pdfData = await pdfParse(pdfBuffer);

        console.log(`✅ Extracted text from CV successfully!`);
        return pdfData.text;
    } catch (error) {
        console.error("Error extracting text from CV:", error);
        return null;
    }
};


// Review el CV usando OpenAI
const reviewCV = async (application) => {
    try {
        console.log(`🔍 Reviewing CV for Application ID: ${application._id}`);

        // Extraer el texto del CV
        const cvText = await extractTextFromS3Pdf(application.cvUrl);
        if (!cvText) {
            console.error("Failed to extract text from CV");
            return;
        }
        
        // Buscar el trabajo asociado
        const job = await Job.findById(application.jobId);
        if (!job) {
            console.error("Job not found for Application ID:", application._id);
            return;
        }

        // Promp para la review
        const prompt = `
        Eres un AI especializado en revisar currículums. Analiza el siguiente CV para la aplicación de trabajo ${application.jobId}.

        La aplicación es para el puesto de ${job.jobTitle}.
        Que tiene como descripción: ${job.jobDescription}.

        Primero, da una lista de razones por las que el candidato es adecuado para el trabajo.

        Luego, si hay, da una lista de áreas en las que el candidato podría mejorar o no seria apto para el trabajo.

        Por último, proporciona un resumen de las habilidades del candidato, experiencia y ajuste laboral general.

        CV TEXT:
        ${cvText}
        `;

        console.log("Prompt for AI Review:", prompt);

        // Enviar solicitud a OpenAI
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [{ role: "system", content: prompt }],
                temperature: 0.7,
                max_tokens: 500,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Guarda la Review en la base de datos
        const reviewText = response.data.choices[0].message.content;
        console.log(`✅ AI Review Completed for ${application._id}`);

        const review = new ApplicationReview({
            applicationId: application._id,
            jobId: application.jobId,
            reviewText,
        });

        await review.save();
        console.log("Review Saved in Database!");

    } catch (error) {
        console.error("Error reviewing CV:", error);
    }
};

// Listen for "cvUploaded" event
eventEmitter.on("cvUploaded", async (application) => {
    console.log(`Processing event 'cvUploaded' for Application ID: ${application._id}`);
    await reviewCV(application);
});

module.exports = reviewCV;
