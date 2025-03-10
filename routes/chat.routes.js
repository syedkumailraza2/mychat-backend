import express from "express"
import { getChatHistory } from "../controller/chat.controller.js"

const chatRouter = express.Router()

chatRouter.get('/:roomId',getChatHistory)

export default chatRouter