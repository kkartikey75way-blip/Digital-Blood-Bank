# 🩸 Digital Blood Bank

A full-stack Digital Blood Bank Management System built using the MERN stack with TypeScript.  
The platform connects Admins, Donors, Hospitals, and Patients to manage blood stock, handle requests, and enable location-based donor discovery.

---

## 🚀 Project Overview

Digital Blood Bank is a scalable web application designed to:

- Manage blood inventory efficiently
- Handle blood request workflows
- Enable role-based dashboards
- Provide location-based donor search using Google Maps
- Improve transparency and system security

---

## 🏗️ Tech Stack

### Frontend
- React + TypeScript
- React Router
- Axios (with interceptors)
- Tailwind CSS
- Google Maps API
- Recharts (Analytics)
- Toast Notifications

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Role-Based Access Control
- GeoSpatial Queries (2dsphere index)

---

## 🔐 Authentication & Authorization

- JWT-based secure authentication
- Access & Refresh token system
- Role-based route protection
- Password hashing using bcrypt
- Secure API middleware

---

## 👥 User Roles

### 🛡️ Admin
- Manage blood stock
- Approve / Reject blood requests
- View analytics dashboard
- Monitor activity logs
- Manage users

### 🩸 Donor
- Update profile
- Toggle availability
- View nearby blood requests
- Track donation history

### 🏥 Hospital
- Create blood requests
- Track request status
- Search nearby donors
- View available blood stock

### 👤 Patient
- Create blood request
- Track request progress

---

## 🗺️ Location-Based Donor Search

- Google Maps integration
- Detect user location via browser
- Store location in MongoDB as GeoJSON:

  {
    "type": "Point",
    "coordinates": [longitude, latitude]
  }

- 2dsphere index for geospatial queries
- Search donors within configurable radius
- Filter by blood group and availability

---

## 🩸 Blood Stock Management

- Separate BloodStock collection
- Add / Deduct units
- Auto-deduct stock on approval
- Prevent approval if insufficient stock
- Low stock alert system

---

## 📋 Blood Request Workflow

Request lifecycle:

1. Created
2. Pending
3. Approved / Rejected
4. Completed

Features:
- Status tracking
- Admin approval system
- Automatic stock deduction
- Notification on status change

---

## 📊 Analytics & Reporting

Admin dashboard provides:

- Total donors
- Total requests
- Pending approvals
- Blood group distribution
- Monthly trends
- Low stock alerts

---

## 🔎 Search & Pagination

- Server-side pagination
- Filter by blood group, city, status
- Sorting support

---

## 🔔 Notifications

- Email notifications for request updates
- Notification history storage
- Optional SMS integration ready

---

## 📝 Activity Logging

Tracks:
- Stock updates
- Request approvals
- Role changes
- Account status updates

---

## 🛡️ Security Enhancements

- Rate limiting
- Input sanitization
- Centralized error handling
- Secure CORS configuration
- Protected sensitive API fields

---

## 📁 Project Structure

Digital-Blood-Bank/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   └── context/

---

## ⚙️ Environment Variables (Backend)

Create a `.env` file:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
JWT_REFRESH_SECRET=your_refresh_secret  
GOOGLE_MAPS_API_KEY=your_google_maps_key  
EMAIL_USER=your_email  
EMAIL_PASS=your_email_password  

---

## ▶️ Installation & Setup

### Clone Repository

git clone https://github.com/kkartikey75way-blip/Digital-Blood-Bank.git  
cd Digital-Blood-Bank  

### Backend Setup

cd backend  
npm install  
npm run dev  

### Frontend Setup

cd frontend  
npm install  
npm run dev  

---

## 🌍 Deployment Ready

- Environment-based configuration
- Optimized production builds
- Docker-ready structure
- Cloud deployment compatible (Render / Vercel / Railway)

---

## 👨‍💻 Author

Kartikeya Srivastava  
Full Stack Developer | MERN | TypeScript  


