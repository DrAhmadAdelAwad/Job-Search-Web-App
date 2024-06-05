import { Router } from "express";
const router = Router()
import * as jobController from "./job.controller.js"
import * as jobSchema from "./job.schema.js"
import { validation } from '../../middlewares/validation.js'
import { isAuthenticated } from './../../middlewares/authentication.js';
import { isAuthorized } from './../../middlewares/authorization.js';


//addJob
router.post("/", isAuthenticated, isAuthorized("HR"), validation(jobSchema.addJob), jobController.addJob)

//updateJob
router.put("/update/:id", isAuthenticated, isAuthorized("HR"), validation(jobSchema.updateJob), jobController.updateJob)

//deleteJob
router.delete("/delete/:id", isAuthenticated, isAuthorized("HR"), validation(jobSchema.deleteJob), jobController.deleteJob)

//Get all Jobs with their company’s information
router.get("/" , isAuthenticated, isAuthorized("HR" , "user"), validation(jobSchema.getAllJobs) , jobController.getAllJobs)

//Get all Jobs for a specific company.
router.get("/companyJobs", isAuthenticated, isAuthorized("HR", "user"), validation(jobSchema.companyJobs), jobController.companyJobs)

//getFilteredJobs
router.get("/getFilteredJobs" , isAuthenticated, isAuthorized("HR", "user"), validation(jobSchema.getFilteredJobs) , jobController.getFilteredJobs)

export default router