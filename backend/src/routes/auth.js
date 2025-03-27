import express from 'express';
// import { body } from 'express-validator';
// import { register, login, getCurrentUser } from '../controllers/authController.js';
import { register,getCurrentUser, login } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// const passwordValidation = body('password')
//   .isLength({ min: 6 })
//   .withMessage('Password must be at least 6 characters long')
//   .matches(/\d/)
//   .withMessage('Password must contain at least one number')
//   .matches(/[a-zA-Z]/)
//   .withMessage('Password must contain at least one letter');

// const emailValidation = body('email')
//   .isEmail()
//   .withMessage('Please provide a valid email address')
//   .normalizeEmail();

// const roleValidation = body('role')
//   .isIn(['doctor', 'patient'])
//   .withMessage('Role must be either doctor or patient');

// // Doctor-specific validations
// const doctorValidations = [
//   body('specialization')
//     .if(body('role').equals('doctor'))
//     .notEmpty()
//     .withMessage('Specialization is required for doctors')
//     .isString()
//     .withMessage('Specialization must be a string'),
  
//   body('qualification')
//     .if(body('role').equals('doctor'))
//     .notEmpty()
//     .withMessage('Qualification is required for doctors')
//     .isString()
//     .withMessage('Qualification must be a string'),
  
//   body('experience')
//     .if(body('role').equals('doctor'))
//     .notEmpty()
//     .withMessage('Experience is required for doctors')
//     .isInt({ min: 0 })
//     .withMessage('Experience must be a non-negative number')
// ];

//advanced version 

// router.post('/register', [
//   body('name')
//     .trim()
//     .notEmpty()
//     .withMessage('Name is required')
//     .isLength({ min: 2 })
//     .withMessage('Name must be at least 2 characters long')
//     .matches(/^[a-zA-Z\s]+$/)
//     .withMessage('Name can only contain letters and spaces'),
//   emailValidation,
//   passwordValidation,
//   roleValidation,
//   ...doctorValidations
// ], register);



//normal version 
router.post('/register',register);
router.post('/login',login);

// router.post('/login', [
//   emailValidation,
//   body('password')
//     .notEmpty()
//     .withMessage('Password is required'),
//   roleValidation
// ], login);

router.get('/me', protect, getCurrentUser);

export default router;