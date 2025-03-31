import express from 'express';
import { body } from 'express-validator';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorAppointments,
  getPatientAppointments
  // updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getAppointments);
router.get('/doctor/', getDoctorAppointments);
router.get('/patient/', getPatientAppointments);
router.get('/:id', getAppointment);

router.post('/', createAppointment);

router.put('/:id', updateAppointment);

router.delete('/:id', deleteAppointment);

// router.put('/:id/status', updateAppointmentStatus);

export default router;