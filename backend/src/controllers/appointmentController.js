import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { doctorId: req.user._id },
        { patientId: req.user._id }
      ]
    })
    .populate('doctorId', 'name specialization')
    .populate('patientId', 'name');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

export const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId', 'name specialization')
      .populate('patientId', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId._id.toString() !== req.user._id.toString() &&
        appointment.patientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment' });
  }
};

export const createAppointment = async (req, res) => {
  try {
    console.log('createAppointment:', req.body);
    // console.log(req.body);
    const { doctorId, date,startTime,endTime,status, mode, reason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    console.log("found appointment doctor",doctor._id);
    if (!doctor) {
      console.log('Doctor not found');
      return res.status(404).json({ message: 'Doctor not found' });
    }
    if(req.userRole !== 'patient'){
      console.log('Only patients can create appointments');
      return res.status(403).json({ message: 'Only patients can create appointments' });
    }

    const appointment = new Appointment({
      doctorId,
      patientId: req.user._id,
      date,
      startTime,
      endTime,
      mode,
      reason,
      status
    });

    const savedAppointment = await appointment.save();
     console.log('savedAppointment:', savedAppointment);
    const populatedAppointment = await appointment.populate([
      { path: 'doctorId', select: 'name specialization' },
      { path: 'patientId', select: 'name' }
    ]);
    console.log('populatedAppointment', populatedAppointment);
    res.status(200).json({data:populatedAppointment});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    console.log('updateAppointment:hit');
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString() &&
        appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      appointment[key] = updates[key];
    });

    const updatedAppointment = await appointment.save();
    console.log('updatedAppointment:', updatedAppointment);
    const populatedAppointment = await appointment.populate([
      { path: 'doctorId', select: 'name specialization' },
      { path: 'patientId', select: 'name' }
    ]);

    res.json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment' });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString() &&
        appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment' });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    console.log('getDoctorAppointments');
    const doctorId = req.user._id;
    
    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    console.log(doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // If requesting appointments for another doctor, verify authorization
    // if (doctorId !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Not authorized to view these appointments' });
    // }
    
    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'name')
      .sort({ date: 1,startTime:1 });
    console.log("appointments",appointments);
    res.json(appointments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching doctor appointments' });
  }
};
  export const getPatientAppointments =async(req,res)=>{
    try {
      console.log('getPatientAppointments');
      const userId = req.user._id;
      
      // Check if the patient exists
      if(req.userRole !== 'patient'){
        console.log('Only patients can get appointments');
        return res.status(403).json({ message: 'Only patients can create appointments' });
      }
      const appointments = await Appointment.find({ patientId })
        .populate('doctorId', 'name specialization')
        .sort({ date: 1,startTime:1 });
      console.log("appointments",appointments);
      res.json(appointments); 
    }
    catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error fetching patient appointments' });
    }

  }
