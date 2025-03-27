import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import { validationResult } from 'express-validator';
import {Doctor} from '../models/Doctor.js'
import {Patient} from '../models/Patient.js'
// import { Doctor } from '../../models/Doctor.js';
// import { Patient } from '../../models/Patient.js';

const generateToken = (userId, role) => {
  try {
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
    throw new Error('Failed to generate authentication token');
  }
};

const formatUserResponse = (user, role) => ({
  name: user.name,
  email: user.email,
  role,
  avatar: user.avatar || '',
  ...(role === 'doctor' ? {
    specialization: user.specialization,
    experience: user.experience,
    qualification: user.qualification,
    about: user.about || '',
    contactNumber: user.contactNumber || '',
    schedule: user.schedule || []  // Added schedule array
  } : {
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || '',
    contactNumber: user.contactNumber || '',
    emergencyContact: user.emergencyContact || [],
    bloodGroup: user.bloodGroup || '',
    allergies: user.allergies || ''
    // profileCompleted: user.profileCompleted || false  
  })
});


// Register user
export const register = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ 
    //     success: false,
    //     message: 'Validation error', 
    //     errors: errors.array() 
    //   });
    // }

    const { name, email, password, role, ...additionalData } = req.body;
    console.log('req.body');
    // console.log(req.body);

    // Check if user already exists
    const existingDoctor = await Doctor.findOne({ email });
    const existingPatient = await Patient.findOne({ email });
    
    if (existingDoctor || existingPatient) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Validate required fields based on role
    if (role === 'doctor') {
      if (!additionalData.specialization) {
        return res.status(400).json({ 
          success: false,
          message: 'Specialization is required for doctors' 
        });
      }
      if (!additionalData.qualification) {
        return res.status(400).json({ 
          success: false,
          message: 'Qualification is required for doctors' 
        });
      }
      if (typeof additionalData.experience !== 'number') {
        return res.status(400).json({ 
          success: false,
          message: 'Experience must be a number' 
        });
      }
    }

    // Create new user based on role
    let user;
    try {
      const UserModel = role === 'doctor' ? Doctor : Patient;
      user = new UserModel({
        name,
        email,
        password,
        ...additionalData
      });

      await user.save();
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return res.status(500).json({ 
        success: false,
        message: 'Error creating user account',
        error: saveError.message 
      });
    }

    // Generate JWT token
    console.log('createed user')
    console.log(user._id)
    const token = generateToken(user._id, role);
    // console.log(`token genereated ${token}`)
     
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: formatUserResponse(user, role)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error in registration process',
      error: error.message 
    });
  }
};

// Login user
export const login = async (req, res) => {
  // console.log('login hit');
  try {
    // console.log('login hit');
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ 
    //     success: false,
    //     message: 'Validation error',
    //     errors: errors.array() 
    //   });
    // }

    const { email, password, role } = req.body;

    // Find user based on role
    const UserModel = role === 'doctor' ? Doctor : Patient;
    const user = await UserModel.findOne({ email });
    // console.log('user', user);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password 1' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password 2' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, role);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: formatUserResponse(user, role)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error in login process',
      error: error.message 
    });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    console.log("hit get current User");
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    // console.log("get current user sent",formatUserResponse(user,req.userRole));
    res.json({
      success: true,
      data: {
        user: formatUserResponse(user, req.userRole)
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user data',
      error: error.message 
    });
  }
};