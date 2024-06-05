import mongoose, { Schema, model, Types } from "mongoose";

const applicationSchema = new Schema({
    jobId : {type : Types.ObjectId, ref: "Job", required : true},
    userId : {type : Types.ObjectId, ref: "User", required : true},
    userTechnicalSkills : [String],
    userSoftSkills : [String],
    cv : {
        id : {type : String, required : true},
        url : {type : String, required : true}
    },
}, { timestamps: true })


const applicationModel = mongoose.models.Application || model("Application", applicationSchema)

export default applicationModel