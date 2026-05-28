import jwt from "jsonwebtoken";
import JWT_SECRET from "../config.js";

const UserMiddleware = (req,res,next) => {
    const token = req.headers.authorization;

    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.userId = decoded.userId;
        next();

    } catch(e){
        res.status(403).json({
            msg : "Invalid Credentials (invalid token)"
        })
    }
}

export default UserMiddleware;