import jwt from 'jsonwebtoken';
import { Doctor } from '../../src/models/Doctor.js';
import { Patient } from '../../src/models/Patient.js';

const verifyToken = async (token) => {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      throw new Error('Token has expired');
    }

    const id = decoded.id;
    

    return { userId:id, role: decoded.role };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token){
     return res.status(401).json({success:false,message:'missing token'})
    }
    const { user, role } = await verifyToken(token);
    
    if(!user||!role){
     return  res.status(401).json({success:false,message:" Invalid"})
    }

    req.token = token;
    req.user = user;
    req.userRole = role;
    next();
  } catch (error) {
    return res.status(400).json({ success:false,message:error });
  }
};

export const doctorOnly = (req, res, next) => {
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