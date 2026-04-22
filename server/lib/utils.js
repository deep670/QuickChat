import jwt from "jsonwebtoken";

//TO GENERATE TOKEN FOR USER
export const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return token;
}