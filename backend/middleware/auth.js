import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuth = async (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        const user = await User.findById(decoded.id).select("-password");
        if (!user){
            return  res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

export const isAdmin = (req,res,next) => {
    if (req.user.role != "admin"){
        return res.status(403).json({ message: "Admin access required" });  
    }
    next();
}