import joi from 'joi';
import { validObjectId } from '../../middlewares/validation.js';

export const applyToJob = joi.object({
    userTechnicalSkills : joi.array().items(joi.string().required()).required(),
    userSoftSkills : joi.array().items(joi.string().required()).required(),
    id: joi.string().custom(validObjectId),
}).required()

//getJobApplications

export const getJobApplications = joi.object({
    id : joi.string().custom(validObjectId).required()
}).required()

//deleteJobApplication