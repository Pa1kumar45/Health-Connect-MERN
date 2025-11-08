import jwt from 'jsonwebtoken';
import { Doctor } from '../../src/models/Doctor.js';
import { Patient } from '../../src/models/Patient.js';

const verifyToken = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired (jwt.verify already does this, but adding extra check)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.log("Token expired");
      throw new Error('Token has expired');
    }
    
    // Verify required fields exist
    if (!decoded.id) {
      throw new Error('Invalid token payload - missing user ID');
    }
    
    return { userId: decoded.id, role: decoded.role };
  } catch (error) {
    console.log("Token verification error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    
    // Re-throw the error so it's caught by the protect middleware
    throw error;
  }
};

export const protect = async (req, res, next) => {
  try {
    // Check for token in Authorization header first (preferred), then cookies
    let token = null;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Please login.' 
      });
    }
    
    // Verify token
    const { userId, role } = await verifyToken(token);
    
    if (!userId) {
      console.log('Token verification failed - no userId');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token payload' 
      });
    }
    
    // Find user in database
    let user;
    if (role === 'patient') {
      user = await Patient.findById(userId).select('-password');
    } else if (role === 'doctor') {
      user = await Doctor.findById(userId).select('-password');
    } else {
      console.log('Invalid role in token:', role);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid user role' 
      });
    }
    
    if (!user) {
      console.log('User not found in database:', userId);
      return res.status(401).json({ 
        success: false, 
        message: 'User not found. Please login again.' 
      });
    }

    // Attach user info to request
    req.token = token;
    req.user = user;
    req.userRole = role;
    
    next();
  } catch (error) {
    console.log("Authentication error:", error.message || error);
    return res.status(401).json({ 
      success: false, 
      message: error.message || 'Authentication failed' 
    });
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