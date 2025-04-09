import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;

		// check if user already exists
		let user = await User.findOne({ clerkId: id });

		// if not, create the user
		if (!user) {
			user = await User.create({
				clerkId: id,
				fullname: `${firstName || ""} ${lastName || ""}`.trim(),
				imageUrl,
			});
		}

		// Generate JWT Token
		const token = jwt.sign(
			{ userId: user.clerkId },
			process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		res.status(200).json({ success: true, token });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};
