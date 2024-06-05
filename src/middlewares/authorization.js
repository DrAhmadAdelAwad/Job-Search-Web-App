export const isAuthorized = (...roles)=>{
    return async(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next (new Error("Not Authorized" , {status:403}))
        }
        return next()
    }
}