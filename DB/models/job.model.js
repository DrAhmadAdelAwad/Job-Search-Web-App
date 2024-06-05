import mongoose, { Schema, model, Types } from "mongoose";

const jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        min: 3,
        max: 20
    },
    jobLocation: {
        type: String,
        required: true,
        enum: ["onsite", "remotely", "hybrid"],
        default: "onsite"
    },
    workingTime: {
        type: String,
        required: true,
        enum: ["part-time", "full-time"],
        default: "full-time"
    },
    seniorityLevel: {
        type: String,
        required: true,
        enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
        default: "Junior"
    },
    jobDescription: {
        type: String,
        required: true,
        min: 10,
        max: 200
    },
    technicalSkills: ["String"],
    softSkills: ["String"],
    addedBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true , strictQuery: true})


const jobModel = mongoose.models.Job || model("Job", jobSchema)

export default jobModel