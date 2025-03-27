import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
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
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  contactNumber: {
    type: String
  },
  avatar: {
    type: String
  },
  schedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    slots: [{
      slotNumber: Number,
      startTime: String,  
      endTime: String,     
      isAvailable: { type: Boolean, default: true }
    }]
  }]
}, {
  timestamps: true
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor; 