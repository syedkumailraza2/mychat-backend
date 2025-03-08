import User from "../models/user.model.js";

const createUser = async (req,res)=>{
    try {
        const { name,email,password } = req.body
        const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
        name,
        email,
        password
    }) 
    await newUser.save()
    
    console.log('user added successfully',newUser);
    res.status(200).json({ message: "User registered successfully", user: newUser });
    

    } catch (error) {
        console.log('Error while creating new User',error);
        res.status(500).json({ message: "Interal Server error", error });
    }
    
    
}

export default createUser