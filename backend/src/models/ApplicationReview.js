const mongoose = require("mongoose");

const ApplicationReviewSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    reviewText: { type: String, required: true },
    reviewedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ApplicationReview", ApplicationReviewSchema);
