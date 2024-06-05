import { Router } from "express";
const router = Router()
import * as applicationController from "./application.controller.js"
import * as applicationSchema from "./application.schema.js"
import { validation } from "../../middlewares/validation.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";

//Apply to a job
router.post("/:id" , isAuthenticated, isAuthorized("user") , fileUpload(fileValidation.file).single("cv") , validation(applicationSchema.applyToJob) , applicationController.applyToJob)

//Get all applications for specific Jobs
router.get('/:id' , isAuthenticated, isAuthorized("HR") , validation(applicationSchema.getJobApplications) , applicationController.getJobApplications) 


export default router