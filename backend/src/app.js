import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({
    limit: "10000kb"
}))
app.use(express.urlencoded({extended: true,limit: "10000kb" })); 
app.use(express.static("public"))
app.use(cookieParser());

import router from "./router/uploader.router";

app.use("/",router)

export default app;