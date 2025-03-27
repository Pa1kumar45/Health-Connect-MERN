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

    const user = await (decoded.role === 'doctor' 
      ? Doctor.findById(decoded.id).select('-password')
      : Patient.findById(decoded.id).select('-password'));

    if (!user) {
      throw new Error('User not found');
    }

    return { user, role: decoded.role };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const { user, role } = await verifyToken(token);
    console.log("token verified", user )
    req.token = token;
    req.user = user;
    req.userRole = role;
    next();
  } catch (error) {
    let statusCode = 401;
    let message = 'Please authenticate';

    switch (error.message) {
      case 'No token provided':
        message = 'Authentication token is required';
        break;
      case 'Invalid token':
        message = 'Invalid authentication token';
        break;
      case 'Token has expired':
        message = 'Authentication token has expired';
        break;
      case 'User not found':
        statusCode = 404;
        message = 'User account not found';
        break;
    }

    res.status(statusCode).json({ message });
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