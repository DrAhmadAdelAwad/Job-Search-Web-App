import { asyncHandler } from "../../utils/errorHandling.js";
import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/job.model.js"

//addCompany
export const addCompany = asyncHandler(async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, email } = req.body
    const checkCompanyName = await companyModel.findOne({ companyName })
    if (checkCompanyName) {
        return next(new Error("Company Already Exists", { cause: 400 }))
    }
    const checkCompanyEmail = await companyModel.findOne({ email })
    if (checkCompanyEmail) {
        return next(new Error("Email Already Exists", { cause: 400 }))
    }
    const company = await companyModel.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        email,
        companyHR: req.user._id
    })
    return res.status(201).json({ message: "Done", company })
})


//updateCompany
export const updateCompany = asyncHandler(async (req, res, next) => {
    const company = await companyModel.findOne({ _id: req.params.id, companyHR: req.user._id })
    if (!company) {
        return next(new Error("Company Not Found or You are not the Owner", { cause: 404 }))
    }
    company.companyName = req.body.companyName ? req.body.companyName : company.companyName
    company.description = req.body.description ? req.body.description : company.description
    company.industry = req.body.industry ? req.body.industry : company.industry
    company.address = req.body.address ? req.body.address : company.address
    company.numberOfEmployees = req.body.numberOfEmployees ? req.body.numberOfEmployees : company.numberOfEmployees
    company.email = req.body.email ? req.body.email : company.email
    await company.save()
    return res.status(200).json({ message: "Done", company })
})


//deleteCompany
export const deleteCompany = asyncHandler(async (req, res, next) => {
    const company = await companyModel.findOne({ _id: req.params.id, companyHR: req.user._id })
    if (!company) {
        return next(new Error("Company Not Found or You are not the Owner", { cause: 404 }))
    }
    await company.deleteOne()
    return res.status(200).json({ message: "Done" })
})


//getCompany
export const getCompany = asyncHandler(async (req, res, next) => {
    const company = await companyModel.findById(req.params.id)
    if (!company) {
        return next(new Error("Company Not Found", { cause: 404 }))
    }
    const jobs = await jobModel.find({addedBy : company.companyHR})
    if (!jobs) {
        return next(new Error("Jobs Not Found", { cause: 404 }))
    }

    return res.status(200).json({ message: "Done" , jobs })
})


//searchCompany
export const searchCompany = asyncHandler(async (req, res, next) => {
    const { keyword } = req.query
    const company = await companyModel.find({ companyName: { $regex: keyword, $options: "i" } })
    if (company.length < 1) {
        return next(new Error("NO Search Match Found", { status: 404 }))
    }
    return res.status(200).json({ message: "Done", company })
})

//getJobApplications TODO


