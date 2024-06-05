import mongoose, { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        min: 3,
        max: 12
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        min: 3,
        max: 12
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    DOB: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "HR"],
        default: "user"
    },
    status: {
        type: String,
        required: true,
        enum: ["online", "offline"],
        default: "offline"
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    OTP: Number
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

userSchema.virtual("userName").get(function () {
    return this.firstName + " " + this.lastName
})

userSchema.pre("save",
    function () {
        if (this.isModified("password")) {
            this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT_ROUND))
        }
    }
)


userSchema.virtual("companies", {
    ref: "Company",
    localField: "_id",
    foreignField: "companyHR"
})

const userModel = mongoose.models.User || model("User", userSchema)

export default userModel;