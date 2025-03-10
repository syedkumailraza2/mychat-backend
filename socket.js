import { saveMessage } from "./controller/chat.controller.js";
const handleSocket = (IO)=>{

IO.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;  // ✅ Extract user ID from handshake

    if (!userId) {
      console.log("User ID not provided. Disconnecting socket.");
      socket.disconnect();
      return;
    }
  
    console.log(`User ${userId} Connected`);  // ✅ Now this will log a valid userId
    socket.user = userId;  // ✅ Assign it to socket.user
    socket.join(userId);


  socket.on("joinChatRoom", ({ userId, receiverId }) => {
    const roomId = [userId, receiverId].sort().join("_");
    socket.join(roomId);
    socket.join(userId); 
    console.log(`User ${userId} joined room: ${roomId}`);
    setTimeout(() => {
        IO.to(roomId).emit("roomJoined", roomId);
      }, 500);
  });

  // Handle sending a message
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    console.log(`Message received: ${message} from ${senderId} to ${receiverId}`);
    
    const roomId = [senderId, receiverId].sort().join("_");
  
    // Save message to DB
    const chat = await saveMessage(roomId, senderId, receiverId, message);
  
    // Emit message to users in the room
    console.log(`Emitting message to room: ${roomId}`);
    IO.to(roomId).emit("receiveMessage", chat); // ✅ Ensure it's emitting correctly
  });
  
  socket.on("makeCall", (data) => {
    let calleeId = data.calleeId;
    let sdpOffer = data.sdpOffer;

    console.log(`Outgoing Call: Caller -> ${socket.user}, Callee -> ${calleeId}`);

    socket.to(calleeId).emit("newCall", {
      callerId: socket.user,
      sdpOffer: sdpOffer,
    });
  });

  socket.on("answerCall", (data) => {
    let callerId = data.callerId;
    let sdpAnswer = data.sdpAnswer;

    socket.to(callerId).emit("callAnswered", {
      callee: socket.user,
      sdpAnswer: sdpAnswer,
    });
  });

  
  socket.on("IceCandidate", (data) => {
    let calleeId = data.calleeId;
    let iceCandidate = data.iceCandidate;

    socket.to(calleeId).emit("IceCandidate", {
      sender: socket.user,
      iceCandidate: iceCandidate,
    });
  });
})

}

export default handleSocket