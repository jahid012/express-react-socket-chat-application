import express  from "express";
import {Server} from "socket.io";
import { createServer } from "http";
import cors  from "cors";
import jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 3000;
const app = express();
const secretKey = "123456";

app.use(cors())



const server = new createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET","POST"],
        credentials: true,
    }
});

const user = false;

io.use((socket, next)=>{
    cookieParser()(socket.request, socket.request.res,(err)=>{
        if (err) {
            return next(err);
        }

        const token = socket.request.cookies.token;

        if(!token) return next(new Error("Authentication Error"))

        const docoded = jwt.verify(token,secretKey);

        next();
    });

    if (user)  next();
});

io.on("connection",(socket)=>{
    console.log("User Connected",socket.id);

    socket.on("message",({room,message})=>{
        console.log({room,message});

        io.to(room).emit("receive_message",message);
    })

    socket.on('disconnect',()=>{
        console.log("User Disconnected", socket.id)
    })

    socket.on('join_room',(room)=>{
        socket.join(room);
    })
})

server.listen(port,()=>{
    console.log(`Server is running on ${port} port`)
})



app.get("/", (req,res)=>{
    res.send("Hello World!");
})

app.get("/login", (req,res)=>{
    const token = jwt.sign({_id:"2434" },secretKey);

    res
    .cookie("token",token, {httpOnly:false,secure:true,sameSite:true})
    .json({message:"login Success"});
})
