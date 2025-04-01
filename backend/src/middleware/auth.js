import jwt from 'jsonwebtoken';
import { Doctor } from '../../src/models/Doctor.js';
import { Patient } from '../../src/models/Patient.js';

const verifyToken = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded);
    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      console.log("token expired");
      throw new Error('Token has expired');
    }
    else{
      console.log("in range")
    }

    const id = decoded.id;
    
    console.log("id",id,"role",decoded.role)
    return { userId:id, role: decoded.role };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.log("other eror")
      // throw new Error('Invalid token');
    }
    console.log("error")
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token",token)
    if(!token){
     return res.status(401).json({success:false,message:'missing token'})
    }
    const { userId, role } = await verifyToken(token);
    let user;
    if(role=='patient'){
      user =await Patient.findById(userId);
    }
    else{
      user =await Doctor.findById(userId);

    }
    
    if(!user||!role){
      console.log("errorinvalid");
     return  res.status(401).json({success:false,message:" Invalid"})
    }

    req.token = token;
    req.user = user;
    req.userRole = role;
    console.log("details from protect",user.name,role,user._id);
    next();
  } catch (error) {
    console.log("eroror",error)
    return res.status(400).json({ success:false,message:error });
  }
};

export const doctorOnly = (req, res, next) => {
  console.log("inside the doctor only ",req.userRole);
  if (req.userRole !== 'doctor') {
    return res.status(403).json({ 
      message: 'Access denied. This endpoint is only available to doctors.' 
    });
  }
  next();
};

export const patientOnly = (req, res, next) => {
  if (req.userRole !== 'patient') {
    return res.status(403).json({ 
      message: 'Access denied. This endpoint is only available to patients.' 
    });
  }
  next();
};