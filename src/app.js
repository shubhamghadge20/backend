import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";

const app =  express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credential: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

export  {app}


//use are used to set middlerware