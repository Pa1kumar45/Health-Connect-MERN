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

---

## 🚀 Deployment

Ready to deploy your application? We've got you covered with comprehensive guides:

### Quick Deployment (30 minutes)

📖 **[QUICK_START.md](./QUICK_START.md)** - Fast-track deployment guide

- MongoDB Atlas setup
- Backend deployment (Render)
- Frontend deployment (Vercel)
- Step-by-step with screenshots

### Detailed Deployment Guide

📚 **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment documentation

- Multiple platform options (Render, Railway, Vercel, Netlify)
- Docker deployment
- Environment configuration
- Troubleshooting guide
- Production best practices

### Docker Deployment

🐳 **Quick Docker Start**:

```bash
# Copy and configure environment variables
cp .env.docker.example .env

# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# Access application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

### Additional Resources

- 📖 [MONGOOSE_REFERENCE.md](./MONGOOSE_REFERENCE.md) - Database operations reference
- 🎯 [INTERVIEW_SCENARIOS.md](./INTERVIEW_SCENARIOS.md) - Technical challenges & solutions

---

## 📁 Project Structure

```
Health-Connect/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   └── lib/             # Utilities (socket, cloudinary)
│   ├── .env.example         # Environment template
│   ├── Dockerfile           # Backend container config
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts
│   │   ├── services/        # API services
│   │   └── utils/           # Helper functions
│   ├── .env.example         # Environment template
│   ├── Dockerfile           # Frontend container config
│   ├── nginx.conf           # Nginx configuration
│   └── package.json
├── docker-compose.yml       # Docker orchestration
├── DEPLOYMENT.md            # Deployment guide
├── QUICK_START.md           # Quick deployment
└── README.md               # This file
```

---

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- Bcrypt password hashing (14 rounds for doctors, 12 for patients)
- CORS configuration for cross-origin requests
- Secure cookie settings (httpOnly, sameSite, secure)
- Input validation with express-validator
- MongoDB injection prevention via Mongoose

---

## 🧪 Testing Your Deployment

After deployment, verify these features:

1. ✅ User registration (both doctor and patient)
2. ✅ User login and authentication
3. ✅ Profile updates with image uploads
4. ✅ Appointment creation and management
5. ✅ Real-time chat messaging
6. ✅ Video call functionality
7. ✅ Responsive design on mobile devices

---

## 🐛 Common Issues & Solutions

### CORS Errors

- Ensure `FRONTEND_URL` in backend matches deployed frontend URL exactly
- No trailing slashes in URLs
- Include `https://` protocol

### WebSocket Connection Failed

- Check backend logs for socket errors
- Verify backend supports WebSocket (Render/Railway recommended)
- Test with Socket.io admin UI

### Database Connection Issues

- Verify MongoDB Atlas IP whitelist (0.0.0.0/0 for testing)
- Check connection string format
- Ensure database user has proper permissions

### Image Upload Failures

- Verify Cloudinary credentials
- Check file size limits
- Monitor Cloudinary dashboard for errors

For more troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

---

## 📊 Environment Variables Reference

### Backend (.env)

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/health-connect
JWT_SECRET=your-32-char-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Authors

Developed with ❤️ for better healthcare accessibility

---

## 🙏 Acknowledgments

- Socket.io for real-time communication
- WebRTC for video calling
- MongoDB Atlas for database hosting
- Cloudinary for media management
- All open-source contributors
