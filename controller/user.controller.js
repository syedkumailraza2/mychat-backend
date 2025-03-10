import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const createUser = async (req,res)=>{
    try {
        const { socketId,name,email,password } = req.body
        const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password:hashedPassword,
        socketId: socketId
    }) 
    await newUser.save()
    
    console.log('user added successfully',newUser);
    res.status(200).json({ message: "User registered successfully", user: newUser });
    

    } catch (error) {
        console.log('Error while creating new User',error);
        res.status(500).json({ message: "Interal Server error", error });
    }
    
    
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token valid for 7 days
        );

        res.json({ 
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, socketId: user.socketId } 
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json(users); // Send users as JSON response
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




export {createUser, getAllUsers, login}