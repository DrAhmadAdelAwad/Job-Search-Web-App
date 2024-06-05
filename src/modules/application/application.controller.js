import applicationModel from "../../../DB/models/application.model.js.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import jobModel from "../../../DB/models/job.model.js"

export const applyToJob = asyncHandler(async (req, res, next) => {
    const { userTechnicalSkills, userSoftSkills } = req.body;
    const job = await jobModel.findOne({ _id: req.params.id });
    if (!job) {
        return next(new Error("Job Not Found", { cause: 404 }))
    }
    if (!req.file) {
        return next(new Error("Please Upload Your CV", { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "CV" })
    const application = await applicationModel.create({
        jobId: job._id,
        userId: req.user._id,
        userTechnicalSkills,
        userSoftSkills,
        cv: { url: secure_url, id: public_id }
    })
    return res.status(200).json({ message: "Done", application })
})


//Get all applications for specific Jobs
export const getJobApplications = asyncHandler(async (req, res, next) => {
    const job = await jobModel.findOne({ _id: req.params.id, addedBy: req.user._id })
    if (!job) return next(new Error("No such job", { cause: 404 }))
    const applications = await applicationModel.find({ jobId: job._id }).populate([{ path: "userId" }])
    return res.status(200).json({ message: "Done", applications })
})