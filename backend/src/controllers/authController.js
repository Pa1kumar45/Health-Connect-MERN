import { Doctor } from '../models/Doctor.js'
import { Patient } from '../models/Patient.js'
import { generateToken } from '../lib/utils.js';


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

    // every thing should be sent from frontend and it is expected as no check here
    const { name, email, password, role, ...additionalData } = req.body;
    console.log('req.body');

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'all fields are requried'
      });
    }

    // Validate required fields based on role
    if (role === 'doctor') {
      if (!additionalData.specialization || !additionalData.qualification || typeof additionalData.experience !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Missing some of the Additional filelds for Doctor '
        });
      }

    }


    // Check if user already exists
    const existingDoctor = await Doctor.findOne({ email });
    const existingPatient = await Patient.findOne({ email });

    if (existingDoctor || existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // ensure data is validated in frontend

    // Create new user based on role
    let user;
    const UserModel = role === 'doctor' ? Doctor : Patient;
    user = new UserModel({
      name,
      email,
      password,
      ...additionalData
    });

    await user.save();

    // Generate JWT token
    console.log('createed user')
    console.log(user._id)
    generateToken(user._id, role, res);
    // console.log(`token genereated ${token}`)
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('register endpoint', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration process',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {

  try {
    // console.log('login hit');

    const { email, password, role } = req.body;

    // Find user based on role
    const UserModel = role === 'doctor' ? Doctor : Patient;
    const user = await UserModel.findOne({ email });
    // console.log('user', user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid creds'
      });
    }



    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    generateToken(user._id, role,res);



    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user:user
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
    const id = req.userId;
    const role=req.userRole;
    let user;
    if(role="doctor"){
     user = await Patient.findById(id);
    }
    else{
     user = await Doctor.findById(id);
  
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // console.log("get current user sent",formatUserResponse(user,req.userRole));
    res.json({
      success: true,
      data: user
      
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


export const logout = async (req,res)=>{
  try {

    res.cookie("token","",{maxAge:0});

    res.status(200).json({success:true,message:'logged out succesfully'})
    
  } catch (err) {
    console.log("error in logout",err);
  }
}