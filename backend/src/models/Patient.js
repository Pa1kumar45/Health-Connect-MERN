import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const EmergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true }
});
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    enum: ['male', 'female', ''],
    required: false
  },
  allergies:{
  type:String,
  requried:false
  },
  // medicalHistory: {
  //   conditions: [String],
  //   allergies: [String],
  //   medications: [String]
  // },
  contactNumber: {
    type: String,
    required: false
  },
  emergencyContact: {
    type: [EmergencyContactSchema],
    required: false, 
    default: [] 
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',''],
    required: false
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  avatar:{
    type:String,
    requried:false
  }
}, {
  timestamps: true
});



// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Patient = mongoose.model('Patient', patientSchema);
export default Patient; 