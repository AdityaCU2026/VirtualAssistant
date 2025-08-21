import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

const app = express();
app.use(cors({
    origin: "https://virtualassistant-frontend-aoj5.onrender.com",
    credentials: true,
}));
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)

app.get("/",(req,res)=>{
    res.send("hi");
})



app.listen(port, () => {
   connectDb();
  console.log(`Server is running on port ${port}`);
});
