import connectDB from "../DB/connection.js"
import { globalErrorHandling } from "./utils/errorHandling.js"
import authRouter from "./modules/auth/auth.router.js"
import companyRouter from "./modules/company/company.router.js"
import jobRouter from "./modules/job/job.router.js"
import applicationRouter from "./modules/application/application.router.js"
import cors from "cors"

const initApp = (app, express) => {
    connectDB()
    app.use(cors())
    app.use(express.json())

    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome to Job Search Web Application Developed By Dr Ahmad Adel" })
    })

    app.use("/auth", authRouter)
    app.use("/company", companyRouter)
    app.use("/job", jobRouter)
    app.use("/application", applicationRouter)

    app.use("*", (req, res, next) => {
        return res.status(404).json({ message: "IN-VALID ROUTING" })
    })

    app.use(globalErrorHandling)
}



export default initApp;