import express from "express";
import {createUser, getAllUsers} from "../controller/user.controller.js";

const userRouter = express.Router()

userRouter.post('/signup', createUser)
userRouter.get('/',getAllUsers)

export default userRouter