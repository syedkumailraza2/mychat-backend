import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  roomId: { type: String, required: true }, // Unique room for the chat session
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat