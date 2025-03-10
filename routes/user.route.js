import express from "express";
import {createUser, getAllUsers, login} from "../controller/user.controller.js";

const userRouter = express.Router()

userRouter.post('/signup', createUser)
userRouter.post('/login', login)
userRouter.get('/',getAllUsers)

export default userRouter