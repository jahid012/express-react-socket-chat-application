import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app, server} from './lib/socket.js';
import path from "path";


dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json({
  limit: '50mb'
}));

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
}))

app.use("/api/auth", authRoutes);

app.use("/api/auth/messages", messageRoutes);

if(process.env.NODE_ENV ==="production"){
  app.use(express.static(path.join(__dirname,"../client/dist")));

  app.get(/(.*)/,(req, res)=>{
    res.sendFile(path.join(__dirname,"../client","dist","index.html"))
  })
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
