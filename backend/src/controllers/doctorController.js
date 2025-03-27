import { Doctor } from '../models/Doctor.js';
import { validationResult } from 'express-validator';

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .select('-password')
      .select('name email specialization experience qualification about contactNumber avatar schedule');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

// Get single doctor
export const getDoctor = async (req, res) => {
  // console.log("hit for getDoctor",req.params.id)
  
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-password')
      .select('name email specialization experience qualification about contactNumber avatar schedule');
    // console.log("got the doctor details",doctor)
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor' });
  }
};

// Update doctor profile
export const updateDoctor = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const id= req.user._id;
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Only allow doctors to update their own profile
    // if (doctor._id.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not authorized to update this profile' });
    // }

    // const allowedUpdates = [
    //   'name',
    //   'specialization',
    //   'experience',
    //   'availability',
    //   'contactNumber',
    //   'profileImage'
    // ];

    const updates = req.body;
    // Object.keys(updates).forEach(key => {
    //   if (allowedUpdates.includes(key)) {
    //     doctor[key] = updates[key];
    //   }
    // });

    Object.keys(updates).forEach(key=>{
      doctor[key] = updates[key];
    })

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor profile' });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Only allow doctors to delete their own profile
    if (doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this profile' });
    }

    await doctor.deleteOne();
    res.json({ message: 'Doctor profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor profile' });
  }
};

// Update doctor's own profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doctor = await Doctor.findById(req.user._id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const allowedUpdates = [
      'name',
      'specialization',
      'experience',
      'availability',
      'contactNumber',
      'profileImage'
    ];

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        doctor[key] = updates[key];
      }
    });

    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Add a review for a doctor
export const addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if patient has already reviewed this doctor
    const existingReview = doctor.reviews.find(
      review => review.patientId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this doctor' });
    }

    const review = {
      patientId: req.user._id,
      rating: Number(rating),
      comment,
      date: new Date()
    };

    doctor.reviews.push(review);

    // Update overall rating
    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
    doctor.rating = totalRating / doctor.reviews.length;

    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review' });
  }
};