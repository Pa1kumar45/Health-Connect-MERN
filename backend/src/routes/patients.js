import express from 'express';
import { body } from 'express-validator';
import {
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  updateMedicalHistory
} from '../controllers/patientController.js';
import { protect, patientOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPatients);
router.get('/:id', getPatient);

// Protected patient routes
// router.put('/profile', protect, patientOnly, [
//   body('name').optional().trim().notEmpty(),
//   body('dateOfBirth').optional().isISO8601().toDate(),
//   body('gender').optional().isIn(['male', 'female', 'other']),
//   body('contactNumber').optional().trim().notEmpty()
// ], updatePatient);
router.put('/profile', protect, patientOnly, updatePatient);

router.delete('/:id', protect, patientOnly, deletePatient);

router.put('/medical-history', protect, patientOnly, [
  // body('conditions').optional().isArray(),
  // body('allergies').optional().isArray(),
  // body('medications').optional().isArray()
], updateMedicalHistory);

export default router;