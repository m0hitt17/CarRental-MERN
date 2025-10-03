import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const protect = async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.json({ success: false, message: "Not authorized" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded || !decoded.userId) {
            return res.json({ success: false, message: "Not authorized" })
        }
        req.user = await User.findById(decoded.userId).select("-password")
        next();
    } catch (error) {
        return res.json({ success: false, message: "Not authorized" })
    }
}