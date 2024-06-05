import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import jwt from "jsonwebtoken"
import sendEmail from './../../utils/email.js';
import { signUpTemp, resetPassTemp } from './../../utils/htmlTemplates.js';
import bcrypt from 'bcryptjs'
import Randomstring from "randomstring";


//signUp
export const signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, cPassword, recoveryEmail, DOB, mobileNumber } = req.body
    if (password != cPassword) {
        return next(new Error("Password doesn't match", { cause: 400 }))
    }
    const checkEmail = await userModel.findOne({ email })
    if (checkEmail) {
        return next(new Error("Email already exists", { cause: 409 }))
    }
    if (email == recoveryEmail) {
        return next(new Error("Email and Recovery Email cannot be same", { cause: 400 }))
    }
    const checkMobileNumber = await userModel.findOne({ mobileNumber })
    if (checkMobileNumber) {
        return next(new Error("Mobile Number already exists", { cause: 409 }))
    }
    const user = await userModel.create({ firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber })
    const token = jwt.sign({ id: user._id, email: user.email },
        process.env.TOKEN_SIGNATURE,
        { expiresIn: 60 * 60 * 60 }
    )
    const confirmationLink = `${req.protocol}://${req.headers.host}/auth/activate_account/${token}`
    const confirmationLinkEmail = sendEmail({
        to: email,
        subject: "Activate_Account",
        html: signUpTemp(confirmationLink)
    })

    return res.status(201).json({ message: "Done", user })
})


//activate_account
export const activate_account = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE)
    if (!decoded?.id) {
        return next(new Error("Invalid Token Payload", { cause: 400 }))
    }
    const user = await userModel.findById(decoded.id)
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    user.isConfirmed = true
    await user.save()
    return res.status(200).json({ message: "Done", user })
})


//logIn
export const logIn = asyncHandler(async (req, res, next) => {
    const { userData, password } = req.body
    const user = await userModel.findOne({
        $or: [
            { email: userData },
            { mobileNumber: userData }
        ]
    })
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
        return next(new Error("Invalid Password", { cause: 400 }))
    }
    user.status = "online"
    await user.save()
    const token = jwt.sign({ id: user._id, email: user.email },
        process.env.TOKEN_SIGNATURE,
        { expiresIn: 60 * 60 * 60 }
    )
    return res.status(200).json({ message: "Done", user, token })
})

//update_account
export const update_account = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    user.firstName = req.body.firstName ? req.body.firstName : user.firstName
    user.lastName = req.body.lastName ? req.body.lastName : user.lastName
    if (req.body.email) {
        const checkEmail = await userModel.findOne({ email: req.body.email })
        if (checkEmail) {
            return next(new Error("Email already exists", { cause: 409 }))
        }
        user.email = req.body.email
    }
    user.recoveryEmail = req.body.recoveryEmail ? req.body.recoveryEmail : user.recoveryEmail
    user.DOB = req.body.DOB ? req.body.DOB : user.DOB
    if (req.body.mobileNumber) {
        const checkMobileNumber = await userModel.findOne({ mobileNumber: req.body.mobileNumber })
        if (checkMobileNumber) {
            return next(new Error("Mobile Number already exists", { cause: 409 }))
        }
        user.mobileNumber = req.body.mobileNumber
    }
    await user.save()
    return res.status(200).json({ message: "Done", user })
})


//delete_account
export const delete_account = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    await user.deleteOne()
    return res.status(200).json({ message: "Done" })
})


//getPrivateUserData
export const getPrivateUserData = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", user })
})

//getProfile
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id)
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", user })
})


//updatePassword
export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, password, cPassword } = req.body
    if (password != cPassword) {
        return next(new Error("Password doesn't match", { cause: 400 }))
    }
    const user = await userModel.findById(req.user._id)
    const checkOldPassword = bcrypt.compareSync(oldPassword, user.password)
    if (!checkOldPassword) {
        return next(new Error("Invalid Old Password", { cause: 400 }))
    }
    user.password = password
    user.save()
    return res.status(200).json({ message: "Done" })
})


//generateOTP
export const generateOTP = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    const OTP = Randomstring.generate({
        length: 5,
        charset: 'numeric'
    })
    user.OTP = OTP
    await user.save()
    const OTPEmail = await sendEmail({
        to: user.email,
        subject: "OTP",
        html: resetPassTemp(OTP)
    })
    return res.status(200).json({ message: "Done", msg: "check your Email" })
})


//resetPassword
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, OTP, password, cPassword } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }
    if (OTP != user.OTP) {
        return next(new Error("Invalid OTP", { cause: 400 }))
    }
    if (password != cPassword) {
        return next(new Error("Password doesn't match", { cause: 400 }))
    }
    user.password = password
    user.status = "offline"
    user.OTP = null
    await user.save()
    return res.status(200).json({ message: "Done", user })
})


//getAccountsRelatedTorecoveryEmail
export const getAccountsRelatedTorecoveryEmail = asyncHandler(async (req, res, next) => {
    const users = await userModel.find({ recoveryEmail: req.body.recoveryEmail })
    if (!users.length) {
        return next(new Error("NO USER WITH THIS ROCOVERY EMAIL FOUND", { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", users })
})