import companyModel from "../../../DB/models/company.model.js";
import jobModel from "../../../DB/models/job.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";


//addJob
export const addJob = asyncHandler(async (req, res, next) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body
    const job = await jobModel.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: req.user._id
    })

    return res.status(201).json({ message: "Done", job })
})

//updateJob
export const updateJob = asyncHandler(async (req, res, next) => {
    const job = await jobModel.findOne({ _id: req.params.id, addedBy: req.user._id })
    if (!job) {
        return next(new Error("Job Not Found or Invalid HR", { cause: 404 }))
    }
    job.jobTitle = req.body.jobTitle ? req.body.jobTitle : job.jobTitle
    job.jobLocation = req.body.jobLocation ? req.body.jobLocation : job.jobLocation
    job.workingTime = req.body.workingTime ? req.body.workingTime : job.workingTime
    job.seniorityLevel = req.body.seniorityLevel ? req.body.seniorityLevel : job.seniorityLevel
    job.jobDescription = req.body.jobDescription ? req.body.jobDescription : job.jobDescription
    job.technicalSkills = req.body.technicalSkills ? req.body.technicalSkills : job.technicalSkills
    job.softSkills = req.body.softSkills ? req.body.softSkills : job.softSkills
    await job.save()
    return res.status(200).json({ message: "Done", job })
})

//deleteJob
export const deleteJob = asyncHandler(async (req, res, next) => {
    const job = await jobModel.findOne({ _id: req.params.id, addedBy: req.user._id })
    if (!job) {
        return next(new Error("Job Not Found or Invalid HR", { cause: 404 }))
    }
    await job.deleteOne()
    return res.status(200).json({ message: "Done", job })
})

//Get all Jobs with their company’s information
export const getAllJobs = asyncHandler(async(req,res,next)=>{
    const jobs = await jobModel.find().populate([{path : "addedBy" , populate : "companies"}])
    if(jobs.lenght <1) return next(new Error("Jobs Not Found", { cause: 404 }))
    return res.status(200).json({message:"Done",jobs})
})


//Get all Jobs for a specific company.
export const companyJobs = asyncHandler(async(req,res,next)=>{
    const company = await companyModel.findOne({companyName : req.query.name})
    if(!company){
        return next(new Error("Company Not Found",{cause:404}))
    }
    const jobs = await jobModel.find({addedBy:company.companyHR})
    return res.status(200).json({message:"Done",jobs})
})

//getFilteredJobs
export const getFilteredJobs = asyncHandler(async(req,res,next)=>{
    const jobs = await jobModel.find({...req.query})
    if(jobs.lenght <1) return next(new Error("Jobs Not Found", { cause: 404 }))
        return res.status(200).json({message:"Done",jobs})
})
