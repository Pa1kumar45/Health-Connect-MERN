# MedConnect - Healthcare Appointment & Communication System

## Project Overview

MedConnect is a comprehensive healthcare platform designed to streamline doctor-patient interactions through a modern web application. The system facilitates appointment scheduling, real-time communication, video consultations, and medical record management in a secure and user-friendly environment.

## Key Features

### User Management
- **Role-based Authentication**: Separate workflows for doctors and patients
- **Secure User Profiles**: Complete profile management with medical history for patients
- **Doctor Specialization**: Searchable doctor profiles with specialization details

### Appointment System
- **Appointment Scheduling**: Patients can book appointments with available doctors
- **Appointment Management**: Accept, reject, or reschedule appointments
- **Appointment Status Tracking**: Track appointments (pending, scheduled, completed, cancelled)
- **Appointment Filtering**: View past and upcoming appointments

### Real-time Communication
- **Live Chat**: Real-time messaging between doctors and patients
- **Video Consultations**: High-quality WebRTC-based video calls
- **Message History**: Persistent chat history for continued care

### Medical Records
- **Patient Medical History**: Maintain comprehensive patient health records
- **Appointment Notes**: Doctors can add notes and recommendations

## Technologies Used

### Backend
- **Node.js & Express**: Server-side application framework
- **MongoDB & Mongoose**: NoSQL database and ODM
- **Socket.io**: Real-time bidirectional event-based communication
- **JSON Web Tokens (JWT)**: Secure authentication mechanism
- **Bcrypt**: Password hashing for security
- **WebRTC**: Video calling capabilities
- **Cloudinary**: Cloud storage for media files

### Frontend
- **React 18**: UI component library
- **TypeScript**: Static type checking
- **Vite**: Next generation frontend tooling
- **TailwindCSS**: Utility-first CSS framework
- **Socket.io-client**: Real-time client communication
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Lucide-React**: Icon library

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

### Backend Setup
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd web_tech_project/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medconnect
   JWT_SECRET=your_secure_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. Start the backend server
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register new user (doctor or patient)
- `POST /api/auth/login`: User login
- `GET /api/auth/logout`: User logout
- `GET /api/auth/me`: Get current user

### Doctors
- `GET /api/doctors`: List all doctors
- `GET /api/doctors/:id`: Get specific doctor
- `PUT /api/doctors/profile`: Update doctor profile

### Patients
- `GET /api/patients`: List all patients
- `GET /api/patients/:id`: Get specific patient
- `PUT /api/patients/profile`: Update patient profile
- `PUT /api/patients/medical-history`: Update medical history

### Appointments
- `GET /api/appointments`: Get all appointments
- `GET /api/appointments/:id`: Get specific appointment
- `GET /api/appointments/doctor`: Get doctor appointments
- `GET /api/appointments/patient`: Get patient appointments
- `POST /api/appointments`: Create new appointment
- `PUT /api/appointments/:id`: Update appointment
- `DELETE /api/appointments/:id`: Delete appointment

### Messages
- Real-time messaging handled via Socket.io

## Contributors
- [Your Name]
- [Team Member Names]

## License
This project is licensed under the MIT License - see the LICENSE file for details.