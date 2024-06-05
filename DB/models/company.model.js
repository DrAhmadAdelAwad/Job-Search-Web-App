import mongoose, { Schema, model, Types } from "mongoose";

const companySchema = new Schema({
    companyName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        min: 2,
        max: 20
    },
    description: {
        type: String,
        required: true,
        min: 10,
        max: 200
    },
    industry: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        min: 3,
        max: 30
    },
    address: {
        type: String,
        required: true,
        min: 5,
        max: 100
    },
    numberOfEmployees: {
        type: Number,
        required: true,
        min: 11,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    companyHR: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })


const companyModel = mongoose.models.Company || model("Company", companySchema)

export default companyModel