# Health-Connect-MERN
with working video call , chat features
## Project Overview
**HealthConnect** is a comprehensive healthcare platform designed to streamline doctor-patient interactions through a modern web application. The system facilitates:
- Appointment scheduling  
- Real-time communication  
- Video consultations  
- Medical record management  

All within a secure and user-friendly environment.

---

## Key Features

### User Management
- **Role-based Authentication:** Separate workflows for doctors and patients  
- **Secure User Profiles:** Complete profile management with medical history for patients  
- **Doctor Specialization:** Searchable doctor profiles with specialization details  

### Appointment System
- **Appointment Scheduling:** Patients can book appointments with available doctors  
- **Appointment Management:** Accept, reject, or reschedule appointments  
- **Appointment Status Tracking:** Track statuses (pending, scheduled, completed, cancelled)  
- **Appointment Filtering:** View past and upcoming appointments  

### Real-time Communication
- **Live Chat:** Real-time messaging between doctors and patients  
- **Video Consultations:** High-quality WebRTC-based video calls  
- **Message History:** Persistent chat history for continuity of care  

### Medical Records
- **Patient Medical History:** Maintain comprehensive patient health records  
- **Appointment Notes:** Doctors can add notes and recommendations  

---

## Technologies Used

### Backend
- **Node.js & Express** – Server-side framework  
- **MongoDB & Mongoose** – NoSQL database with ODM  
- **Socket.io** – Real-time communication  
- **JWT (JSON Web Tokens)** – Secure authentication  
- **Bcrypt** – Password hashing  
- **WebRTC** – Video calling functionality  
- **Cloudinary** – Media file cloud storage  

### Frontend
- **React 18** – UI library  
- **TypeScript** – Static typing  
- **Vite** – Fast frontend build tool  
- **TailwindCSS** – Utility-first CSS framework  
- **Socket.io-client** – Real-time communication client  
- **React Router** – SPA routing  
- **Axios** – API requests  
- **Lucide-React** – Icon library  

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

---

# Backend Setup

1. Clone the repository
`git clone <repository-url>` 
`cd web_tech_project/backend`

2. Install Dependencies
`npm install`

3. Create a .env file with the following variables:
 
`"PORT=5000`
`MONGODB_URI=mongodb://localhost:27017/medconnect`
`JWT_SECRET=your_secure_jwt_secret`
`CLOUDINARY_CLOUD_NAME=your_cloudinary_name`
`CLOUDINARY_API_KEY=your_cloudinary_key`
`CLOUDINARY_API_SECRET=your_cloudinary_secret`

4. Start the backend server
`npm start`


# Frontend Setup

1. Navigate to the frontend directory  
   `cd .../frontend`  

2. Install dependencies  
   `npm install`  

3. Start the development server  
   `npm run dev`  

4. Access the application at http://localhost:5173  

# API Endpoints

## Authentication
- `POST /api/auth/register`: Register new user (doctor or patient)  
- `POST /api/auth/login`: User login  
- `GET /api/auth/logout`: User logout  
- `GET /api/auth/me`: Get current user  

## Doctors
- `GET /api/doctors`: List all doctors  
- `GET /api/doctors/:id`: Get specific doctor  
- `PUT /api/doctors/profile`: Update doctor profile  

## Patients
- `GET /api/patients`: List all patients  
- `GET /api/patients/:id`: Get specific patient  
- `PUT /api/patients/profile`: Update patient profile  
- `PUT /api/patients/medical-history`: Update medical history  

## Appointments
- `GET /api/appointments`: Get all appointments  
- `GET /api/appointments/:id`: Get specific appointment  
- `GET /api/appointments/doctor`: Get doctor appointments  
- `GET /api/appointments/patient`: Get patient appointments  
- `POST /api/appointments`: Create new appointment  
- `PUT /api/appointments/:id`: Update appointment  
- `DELETE /api/appointments/:id`: Delete appointment  

## Messages
- Real-time messaging handled via Socket.io
