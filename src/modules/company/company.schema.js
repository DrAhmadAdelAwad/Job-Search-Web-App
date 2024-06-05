import joi from "joi";
import { validObjectId } from "../../middlewares/validation.js";

//addCompany
export const addCompany = joi.object({
    companyName: joi.string().required().min(2).max(20),
    description: joi.string().required().min(10).max(200),
    industry: joi.string().required().min(3).max(30),
    address: joi.string().required().min(5).max(100),
    numberOfEmployees: joi.number().positive().integer().required().min(11).max(20),
    email: joi.string().email().required(),
}).required();

//updateCompany
export const updateCompany = joi.object({
    companyName: joi.string().min(2).max(20),
    description: joi.string().min(10).max(200),
    industry: joi.string().min(3).max(30),
    address: joi.string().min(5).max(100),
    numberOfEmployees: joi.number().positive().integer().min(11).max(20),
    email: joi.string().email(),
    id: joi.string().custom(validObjectId).required()
}).required()


//deleteCompany
export const deleteCompany = joi.object({
    id: joi.string().custom(validObjectId).required()
}).required()

//getCompany
export const getCompany = joi.object({
    id: joi.string().custom(validObjectId).required()
}).required()

//searchCompany
export const searchCompany = joi.object({
    keyword: joi.string().required()
}).required()

//getJobApplications TODO

