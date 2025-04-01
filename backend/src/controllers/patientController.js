import { Patient } from '../models/Patient.js';

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.status(200).json({success:true,patients});
  } catch (error) {
    res.status(500).json({success:false, message: 'Error fetching patients' });
  }
};

// Get single patient
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (!patient) {
      return res.status(404).json({success:false, message: 'Patient not found' });
    }
    res.json({success:true,patient});
  } catch (error) {
    res.status(500).json({success:false, message: 'Error fetching patient' });
  }
};

// Update patient profile
export const updatePatient = async (req, res) => {
  try {
    const updates = req.body;

    const id= req.user._id;
    const patient
    = await Patient.findById(id);
    if (!patient) {
      console.log("patient not fount")
      return res.status(404).json({success:false, message: 'Patient not found' });
    }
    Object.keys(updates).forEach(key => {
      patient[key] = updates[key];
    });

    await patient.save();
    res.status(200).json({success:true,data:{...patient.toObject(),role:req.userRole}});
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json( {success:false,message: 'Patient not found' });
    }

    // Only allow patients to delete their own profile
    if (patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({success:false, message: 'Not authorized to delete this profile' });
    }

    await patient.deleteOne();
    res.json({success:true, message: 'Patient profile deleted successfully' });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error deleting patient profile' });
  }
};

// Update medical history
export const updateMedicalHistory = async (req, res) => {
  try {
    const { conditions, allergies, medications } = req.body;
    const patient = await Patient.findById(req.user._id);

    if (!patient) {
      return res.status(404).json({success:false, message: 'Patient not found' });
    }

    patient.medicalHistory = {
      conditions: conditions || patient.medicalHistory.conditions,
      allergies: allergies || patient.medicalHistory.allergies,
      medications: medications || patient.medicalHistory.medications
    };

    await patient.save();
    res.json({success:true,patient});
  } catch (error) {
    res.status(500).json({success:false, message: 'Error updating medical history' });
  }
};