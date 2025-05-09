import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
// import path from 'path';
dotenv.config({});


const app = express();
app.set("trust proxy",1);
const PORT = process.env.PORT || 7000;

// const _dirname = path.resolve();

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

// const corsOption = {
//     origin :'https://chitchat-1nsv.onrender.com',
//     credentials:true
// }
// app.use(cors(corsOption));

app.use(cors({
    origin:"https://chitchat-1nsv.onrender.com",
    credentials:true
}))
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message",messageRoute);

// app.use(express.static(path.join(_dirname, "/frontend/dist")));
// app.get('*',(_,res) =>{
//     res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
// })
//localhost
app.get('/', (req,res)=>{
    res.send("this is amrit sharma");
});

app.listen(PORT,"0.0.0.0",()=>{
    connectDB();
    console.log(`Server is running at port: ${PORT}`);
})