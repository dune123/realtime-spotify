import { clerkClient } from "@clerk/express";
import jwt from "jsonwebtoken";


export const protectRoute = async (req, res, next) => {
	const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
	
    try {
        const token = authHeader.split(" ")[1];
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        req.auth = payload; // Manually attach user data
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const requireAdmin = async (req, res, next) => {

	try {
		if (!req.auth || !req.auth.userId) {
			console.log("⛔ No user found in req.auth");
			return res.status(403).json({ message: "Unauthorized - No user found" });
		}
		const userIdStr=req.auth.userId.toString()
		console.log(userIdStr)
		const currentUser = await clerkClient.users.getUser(userIdStr);
		
		console.log(currentUser.primaryEmailAddress?.emailAddress)
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
		console.log("👑 Is Admin:", isAdmin);

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - You must be an admin" });
		}

		next();
	} catch (error) {
		console.error("❌ Error in requireAdmin:", error);
		next(error);
	}
};
