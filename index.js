import express, { json } from 'express'
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http"
import connectDB from './config/db.js';
import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.routes.js';
import handleSocket from './socket.js';

const app = express()
const server = http.createServer(app)
const io = new Server(server)

handleSocket(io)

dotenv.config();
const port = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(json())

connectDB()

app.get('/', (req,res)=>{
    res.send('Hello World')
})

app.use('/user', userRouter)
app.use('/chat',chatRouter)

server.listen(port, ()=>{
    console.log(`server running on http://localhost:${port}`);
    
})
