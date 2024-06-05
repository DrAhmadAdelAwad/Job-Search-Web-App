import joi from 'joi';

//signUp
export const signUp = joi.object({
    firstName: joi.string().required().min(3).max(12),
    lastName: joi.string().required().min(3).max(12),
    email: joi.string().email().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    recoveryEmail: joi.string().email().required(),
    DOB: joi.string().required(),
    mobileNumber: joi.string().required()
}).required()

//logIn
export const logIn = joi.object({
    userData: joi.string().required(),
    password: joi.string().required(),
}).required()


//update_account
export const update_account = joi.object({
    firstName: joi.string().min(3).max(12),
    lastName: joi.string().min(3).max(12),
    email: joi.string().email(),
    recoveryEmail: joi.string().email(),
    DOB: joi.string(),
    mobileNumber: joi.string()
}).required()


//updatePassword
export const updatePassword = joi.object({
    oldPassword: joi.string().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required()
}).required()


//generateOTP
export const generateOTP = joi.object({
    email: joi.string().email().required()
}).required()


//resetPassword
export const resetPassword = joi.object({
    email: joi.string().email().required(),
    OTP: joi.number().required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required()
}).required()


//getAccountsRelatedTorecoveryEmail
export const getAccountsRelatedTorecoveryEmail = joi.object({
    recoveryEmail: joi.string().email().required()
}).required()