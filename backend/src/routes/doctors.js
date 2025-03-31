import express from 'express';
import { body } from 'express-validator';
import {
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  updateDoctorProfile,
  addReview
} from '../controllers/doctorController.js';
import { protect, doctorOnly, patientOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getDoctors);
router.get('/:id', getDoctor);

router.put('/:id', protect, doctorOnly, updateDoctor);
router.delete('/:id', protect, doctorOnly, deleteDoctor);
router.put('/profile', protect, doctorOnly, updateDoctorProfile);

// Protected patient routes
router.post('/:id/reviews', protect, patientOnly, [
  body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required')
], addReview);

export default router;