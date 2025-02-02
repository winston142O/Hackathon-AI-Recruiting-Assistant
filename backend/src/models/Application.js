const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    cvUrl: {
        type: String,
        required: true,
    },
    experienceYears: {
        type: Number,
        required: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Application", ApplicationSchema);
