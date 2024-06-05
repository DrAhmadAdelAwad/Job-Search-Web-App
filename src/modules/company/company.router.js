import { Router } from "express";
const router = Router()
import * as companyController from './company.controller.js'
import * as companySchema from './company.schema.js'
import { validation } from "../../middlewares/validation.js";
import { isAuthenticated } from "../../middlewares/authentication.js";
import { isAuthorized } from "../../middlewares/authorization.js";


//addCompany
router.post('/', isAuthenticated, isAuthorized("HR"), validation(companySchema.addCompany), companyController.addCompany)

//updateCompany
router.put("/update/:id", isAuthenticated, isAuthorized("HR"), validation(companySchema.updateCompany), companyController.updateCompany)

//deleteCompany
router.delete("/delete/:id", isAuthenticated, isAuthorized("HR"), validation(companySchema.deleteCompany), companyController.deleteCompany)

//getCompany
router.get("/get/:id", isAuthenticated, isAuthorized("HR"), validation(companySchema.getCompany), companyController.getCompany)

//searchCompany
router.get('/search', isAuthenticated, isAuthorized("HR", "user"), validation(companySchema.searchCompany), companyController.searchCompany)

//getJobApplications TODO


export default router