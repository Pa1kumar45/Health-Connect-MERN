import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  startTime:{
    type:String,
    requried:true
  },
  endTime:{
    type:String,
    requried:true
  },
  status: {
    type: String,
    enum: ['pending','scheduled', 'completed', 'cancelled','rescheduled'],
    default: 'pending'
  },
  mode:{
   type:String ,
   enum:['video','chat'],
   default:['chat']
  },
  reason:{
    type:String,
    required:false
  },
  comment:{
    type:String,
    required:false
  },
  notes:{
    type:String,
    required:false
  },
  rating:{
    type:Number,
    required:false
  },
  review:{
    type:String,
    required:false
  },
}, {
  timestamps: true
});

// Create index for efficient querying
appointmentSchema.index({ doctorId: 1, dateTime: 1 });
appointmentSchema.index({ patientId: 1, dateTime: 1 });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment; 