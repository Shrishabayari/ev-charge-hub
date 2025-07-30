# Electric Vehicle Recharge Bunk

A comprehensive MERN stack web application for managing Electric Vehicle charging stations with real-time slot booking, location tracking, and administrative controls.

## 🚗 Project Overview

The Electric Vehicle Recharge Bunk is a full-stack web application built using the MERN stack. It provides separate interfaces for administrators and users, enabling efficient management of EV charging bunks and seamless user experience for finding and booking charging slots in real-time.

## 🛠️ Technologies Used

### Frontend
- **React.js (v19.1.0)**: Component-based user interface
- **React Router DOM (v7.5.1)**: Client-side routing
- **Tailwind CSS (v3.4.17)**: Utility-first CSS framework
- **Axios (v1.9.0)**: HTTP client for API requests
- **Lucide React (v0.511.0)**: Beautiful & consistent icons
- **React Toastify (v11.0.5)**: Toast notifications
- **Date-fns (v4.1.0)**: Modern JavaScript date utility library

### Backend
- **Node.js**: Server-side JavaScript runtime (ES Module support)
- **Express.js (v5.1.0)**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose (v8.13.2)**: MongoDB object modeling
- **Express Async Handler (v1.2.0)**: Async error handling middleware
- **Express Validator (v7.2.1)**: Input validation and sanitization

### Security & Authentication
- **JWT (v9.0.2)**: JSON Web Tokens for authentication
- **bcrypt (v5.1.1)** & **bcryptjs (v3.0.2)**: Password hashing
- **CORS (v2.8.5)**: Cross-Origin Resource Sharing

### Additional Technologies
- **Google APIs (v148.0.0)**: Google Maps and other Google services
- **Nodemailer (v6.10.1)**: Email functionality
- **WebSocket (v8.18.1)**: Real-time communication
- **dotenv (v16.5.0)**: Environment variables management

## 📋 Features

### 👨‍💼 Admin Module
- **Authentication**
  - Register new admin account
  - Secure login system
- **Bunk Management**
  - Add new EV charging bunks
  - Edit/Update existing bunk details
  - Delete bunks from the system
  - View all bunks with comprehensive details
- **Location Management**
  - Add bunk locations with coordinates
  - Edit location details and addresses
  - Google Maps integration for precise positioning
- **User Management**
  - View all registered users
  - Update user account status (active/inactive)
  - Delete user accounts
- **Booking Management**
  - View all bookings across all bunks
  - Edit booking status (confirmed/cancelled/completed)
  - Real-time booking monitoring
- **Profile Management**
  - View own admin profile
  - Update name and contact information
  - Change password securely

### 👤 User Module
- **Authentication**
  - User registration
  - Secure login system
- **Slot Booking**
  - Book available charging slots
  - Real-time slot availability checking
  - Booking confirmation system
- **Booking Management**
  - View personal booking history
  - Track current bookings status
  - Cancel bookings if needed
- **Location Services**
  - Find nearest EV charging bunks
  - View all bunk locations on interactive map
  - Detailed bunk information and amenities
- **Slot Availability**
  - Real-time slot vacancy information
  - Check available time slots
  - View charging station specifications
- **Profile Management**
  - View personal profile information
  - Update name and contact details
  - Change password securely

## 🏗️ Project Structure

```
ev-recharge-bunk/
├── client/                     # React frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminBookings.js
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── AdminLogin.js
│   │   │   │   ├── AdminProfile.js
│   │   │   │   ├── AdminRegister.js
│   │   │   │   ├── BunkForm.js
│   │   │   │   ├── BunkList.js
│   │   │   │   ├── BunkManagement.js
│   │   │   │   ├── UserManagement.js
│   │   │   │   └── ViewBookings.js
│   │   │   ├── user/
│   │   │   │   ├── BookingHistory.js
│   │   │   │   ├── BookSlot.js
│   │   │   │   ├── FindBunks.js
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── NearbyBunks.js
│   │   │   │   ├── SlotBooking.js
│   │   │   │   ├── UserDashboard.js
│   │   │   │   ├── UserLogin.js
│   │   │   │   ├── UserProfile.js
│   │   │   │   └── UserRegister.js
│   │   │   └── common/
│   │   │       ├── Header.js
│   │   │       ├── Footer.js
│   │   │       └── LoadingSpinner.js
│   │   ├── contexts/
│   │   │   ├── AdminContext.js
│   │   │   ├── AuthContext.js
│   │   │   └── UserContext.js
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── authService.js
│   │   │   ├── bookingService.js
│   │   │   ├── bunkService.js
│   │   │   └── userService.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   ├── admin.css
│   │   │   ├── global.css
│   │   │   └── user.css
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   └── tailwind.config.js
├── server/                     # Node.js backend
│   ├── config/
│   │   ├── database.js
│   │   └── emailConfig.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── bunkController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Bunk.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── bunks.js
│   │   └── users.js
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── generateToken.js
│   │   └── validators.js
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher) - Required for React 19
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Google Maps API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ev-recharge-bunk.git
   cd ev-recharge-bunk
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster0.lsnugmy.mongodb.net/ev_charge_hub?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   
   # Google Services Configuration
   GOOGLE_API_KEY=your-google-api-key
   GOOGLE_OAUTH_REFRESH_TOKEN=your-oauth-refresh-token
   
   # WebSocket Configuration
   WS_PORT=8080
   ```

   Create `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   REACT_APP_WS_URL=ws://localhost:8080
   
   # Production API URL (fallback)
   # REACT_APP_API_URL=https://ev-charge-hub-server1.onrender.com
   ```

5. **Database Setup**
   ```bash
   # MongoDB Atlas Connection (Recommended for production)
   # Your MongoDB URI should look like:
   # mongodb+srv://username:password@cluster0.lsnugmy.mongodb.net/ev_charge_hub?retryWrites=true&w=majority&appName=Cluster0
   
   # For local development, you can use:
   # mongodb://localhost:27017/ev_charge_hub
   
   # The application will automatically create the required collections
   ```

6. **API Configuration**
   The client uses intelligent API endpoint detection with fallbacks:
   ```javascript
   // Priority order for API base URL:
   // 1. Environment variable (REACT_APP_API_URL)
   // 2. Production server (https://ev-charge-hub-server1.onrender.com)
   // 3. Local development server (http://localhost:5000)
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   # Server will run on http://localhost:5000
   # WebSocket server will run on ws://localhost:8080
   ```

2. **Start the frontend application**
   ```bash
   cd client
   npm start
   # Client will run on http://localhost:3000
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`
   - Production API: `https://ev-charge-hub-server1.onrender.com`

## 🔐 Default Login Credentials

### Admin Access
- **Email**: `testev@gmail.com`
- **Password**: `Test@123`
- **Role**: Administrator

### User Access
- **Email**: `testevuser@gmail.com`
- **Password**: `Test@123`
- **Role**: Regular User

> **Note**: These are default credentials for testing purposes. In production, ensure to change these credentials and implement proper user registration flows.

## 📊 Database Schema

### Admin Model
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  status: String (enum: ['active', 'inactive', 'suspended', 'banned'], default: 'active'),
  isActive: Boolean (default: true),
  role: String (enum: ['user', 'admin'], default: 'user'),
  lastLogin: Date (nullable),
  deletedAt: Date (nullable, for soft deletion),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### EvBunk Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  address: String (required),
  phone: String (required),
  slotsAvailable: Number (required),
  latitude: Number (required),
  longitude: Number (required),
  operatingHours: String (required, format: "09:00-18:00"),
  connectorTypes: [String] (required, array of connector types)
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  bunkId: ObjectId (ref: 'EvBunk', required),
  startTime: Date (required),
  endTime: Date (required),
  status: String (enum: ['active', 'completed', 'cancelled'], default: 'active'),
  createdAt: Date (default: Date.now)
}
```

### Key Model Features

#### User Management
- **Soft Deletion**: Users have `deletedAt` field for soft deletion instead of permanent removal
- **Status Management**: Multiple status levels (`active`, `inactive`, `suspended`, `banned`)
- **Role-based Access**: Separate `role` field for user/admin distinction
- **Activity Tracking**: `lastLogin` and `isActive` fields for monitoring user engagement

#### EV Bunk Management
- **Simplified Location**: Direct `latitude` and `longitude` fields instead of GeoJSON
- **Contact Information**: Direct `phone` field for easy access
- **Availability Tracking**: `slotsAvailable` for real-time slot management
- **Flexible Hours**: String-based `operatingHours` (e.g., "09:00-18:00")
- **Connector Support**: Array of `connectorTypes` for different charging standards

#### Booking System
- **Reference Integrity**: Uses `EvBunk` model reference (matches your actual model name)
- **Simple Status Flow**: Three-state system (`active`, `completed`, `cancelled`)
- **Time-based Queries**: Optimized indexes for efficient time-range searches
- **User History**: Efficient user booking retrieval with compound indexes

#### Database Performance
- **Strategic Indexing**: Compound indexes on frequently queried fields
- **Efficient Lookups**: User-booking and bunk-availability queries optimized
- **Status Filtering**: Dedicated index on booking status for admin dashboards

## 📦 Package Scripts

### Server Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Client Scripts
```bash
npm start          # Start React development server
npm run build      # Build React app for production
npm test           # Run React tests
npm run eject      # Eject from Create React App (irreversible)
```

## 🔧 Key Dependencies Explained

### Server Dependencies
- **express-async-handler**: Simplifies async/await error handling in Express routes
- **express-validator**: Comprehensive input validation middleware
- **googleapis**: Official Google APIs Node.js client for Maps integration
- **nodemailer**: Send emails for notifications and confirmations
- **ws**: WebSocket library for real-time slot availability updates
- **bcrypt & bcryptjs**: Dual password hashing libraries for enhanced security

### Client Dependencies
- **@testing-library/***: Comprehensive testing utilities for React components
- **date-fns**: Lightweight date manipulation library (alternative to moment.js)
- **lucide-react**: Modern icon library with consistent design
- **react-toastify**: Beautiful toast notifications for user feedback
- **react-router-dom v7**: Latest routing library with enhanced features

## 🔧 API Endpoints

### Authentication Routes
#### User Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration  
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Admin Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Admin registration
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile

### Bunk Routes
#### Public/User Access
- `GET /api/bunks` - Get all bunks
- `GET /api/bunks/:id` - Get specific bunk details
- `GET /api/bunks/available` - Get available bunks
- `GET /api/bunks/nearby` - Find nearby bunks (with lat, lng, radius params)
- `GET /api/bunks/search` - Search bunks by query
- `GET /api/bunks/connector/:type` - Get bunks by connector type

#### Admin Bunk Management
- `POST /api/admin/ev-bunks` - Create new bunk (Admin only)
- `GET /api/admin/ev-bunks` - Get admin's bunks
- `PUT /api/admin/ev-bunks/:id` - Update bunk (Admin only)
- `DELETE /api/admin/ev-bunks/:id` - Delete bunk (Admin only)

### Booking Routes
#### User Booking Operations
- `POST /api/bookings/create` - Create new booking
- `GET /api/bookings/user` - Get user's bookings
- `PUT /api/bookings/cancel/:id` - Cancel booking
- `PUT /api/bookings/reschedule/:id` - Reschedule booking
- `POST /api/bookings/check-availability` - Check slot availability
- `GET /api/bookings/available-slots/:bunkId/:date` - Get available slots

#### Admin Booking Management
- `GET /api/admin/bookings` - Get all bookings (with filters)
- `GET /api/admin/bookings/:id` - Get specific booking
- `PATCH /api/admin/bookings/:id` - Update booking
- `PATCH /api/admin/bookings/:id/status` - Update booking status
- `GET /api/admin/bookings/stats` - Get booking statistics

### User Management Routes (Admin only)
- `GET /api/admin/users` - Get all users (with filters and search)
- `GET /api/admin/users/search` - Search users by query
- `GET /api/admin/users/:id` - Get specific user details
- `GET /api/admin/users/:id/bookings` - Get user's booking history
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user

### Analytics & Dashboard
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/bookings/analytics` - Get booking analytics by period

### Client API Configuration
The application uses a sophisticated API client (`client/src/api.js`) with the following features:

#### Smart URL Resolution
```javascript
// Automatic API base URL detection with fallback chain:
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                    'https://ev-charge-hub-server1.onrender.com' || 
                    'http://localhost:5000';
```

#### Token-based Authentication
- **Admin routes** (`/api/admin/*`): Uses `token` from localStorage
- **User routes**: Uses `userToken` from localStorage
- Automatic token injection via request interceptors

#### Advanced Error Handling
- **401 Unauthorized**: Auto-redirect to appropriate login page
- **403 Forbidden**: Access denied notifications
- **404 Not Found**: Endpoint detection and logging
- **500 Server Error**: Graceful error handling with user feedback

## ⚡ Real-time Features

### WebSocket Integration
- **Real-time Slot Updates**: Live slot availability using WebSocket connections
- **Booking Notifications**: Instant notifications for booking confirmations
- **Admin Alerts**: Real-time alerts for new bookings and user activities

### Email Notifications
- **Booking Confirmations**: Automated email confirmations using Nodemailer
- **Status Updates**: Email notifications for booking status changes
- **Admin Notifications**: Email alerts for new registrations and bookings

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests (with comprehensive testing library)
cd client
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Build and test production build
npm run build
```

## 📱 Usage Guide

### For Administrators

1. **Login**: Use admin credentials to access the admin dashboard
2. **Manage Bunks**: Add, edit, update, or delete EV charging bunks
3. **Location Management**: Set up precise locations with Google Maps integration
4. **User Management**: Monitor users, update status, or remove accounts
5. **Booking Oversight**: View all bookings and update their status
6. **Profile Management**: Update personal information and password

### For Users

1. **Registration/Login**: Create account or sign in with user credentials
2. **Find Bunks**: Search for nearest charging stations using location services
3. **Book Slots**: Reserve available charging slots for specific time periods
4. **Manage Bookings**: View booking history and current reservations
5. **Profile Updates**: Modify personal information and change password

## 📈 Optimization

- **Database**: MongoDB indexing with Mongoose for faster queries
- **Frontend**: React 19 features with automatic batching and concurrent features
- **API**: Response caching and pagination with express-async-handler
- **Real-time**: WebSocket connections for live updates
- **Images**: Optimized loading with lazy loading
- **Build**: Tailwind CSS purging for smaller bundle sizes
- **Email**: Efficient email delivery with Nodemailer
- **Testing**: Comprehensive testing with React Testing Library

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Made with ❤️ for sustainable transportation using the MERN Stack**