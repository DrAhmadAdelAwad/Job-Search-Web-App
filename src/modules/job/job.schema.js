import joi from "joi";
import { validObjectId } from "../../middlewares/validation.js";

//addJob
export const addJob = joi.object({
    jobTitle: joi.string().min(3).max(20).required(),
    jobLocation: joi.string().required(),
    workingTime: joi.string().required(),
    seniorityLevel: joi.string().required(),
    jobDescription: joi.string().min(10).max(200).required(),
    technicalSkills: joi.array().items(joi.string().required()).required(),
    softSkills: joi.array().items(joi.string().required()).required()
}).required();

//updateJob
export const updateJob = joi.object({
    id: joi.string().custom(validObjectId),
    jobTitle: joi.string().min(3).max(20),
    jobLocation: joi.string(),
    workingTime: joi.string(),
    seniorityLevel: joi.string(),
    jobDescription: joi.string().min(10).max(200),
    technicalSkills: joi.array().items(joi.string().required()),
    softSkills: joi.array().items(joi.string().required()),
}).required()

//deleteJob
export const deleteJob = joi.object({
    id: joi.string().custom(validObjectId)
}).required()

////Get all Jobs with their company’s information
export const getAllJobs = joi.object({

}).required()

//companyJobs
export const companyJobs = joi.object({
    name : joi.string().required()
}).required()


//getFilteredJobs
export const getFilteredJobs = joi.object({
    jobTitle: joi.string().min(3).max(20),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi.string().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    technicalSkills: joi.array().items(joi.string().required())
}).required();

