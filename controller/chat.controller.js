import Chat from "../models/chat.model.js";
const saveMessage = async (roomId, senderId, receiverId, message) => {
    try {
        
      const chat = new Chat({ roomId, senderId, receiverId, message });
      await chat.save();
      return chat;
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

const getChatHistory = async (req, res) => {
    try {
      const { roomId } = req.params;
  
      const messages = await Chat.find({ roomId }).sort({ timestamp: 1 });
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching chat history", error });
    }
  };

export {saveMessage, getChatHistory}