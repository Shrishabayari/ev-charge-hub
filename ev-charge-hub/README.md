# Electric Vehicle Recharge Bunk

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ev-recharge-bunk.svg)](https://github.com/yourusername/ev-recharge-bunk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ev-recharge-bunk.svg)](https://github.com/yourusername/ev-recharge-bunk/network)
[![GitHub license](https://img.shields.io/github/license/yourusername/ev-recharge-bunk.svg)](https://github.com/yourusername/ev-recharge-bunk/blob/main/LICENSE)

A comprehensive MERN stack web application for managing Electric Vehicle charging stations with real-time slot booking, location tracking, and administrative controls.

## 🚗 Project Overview

The Electric Vehicle Recharge Bunk is a medium-complexity full-stack web application built using the MERN stack. It provides separate interfaces for administrators and users, enabling efficient management of EV charging bunks and seamless user experience for finding and booking charging slots in real-time.

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
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── BunkManagement.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── BookingManagement.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── User/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── BookSlot.jsx
│   │   │   │   ├── FindBunks.jsx
│   │   │   │   ├── MyBookings.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── Shared/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Footer.jsx
│   │   │       └── MapComponent.jsx
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── contexts/
│   │   └── styles/
│   ├── package.json
│   └── tailwind.config.js
├── server/                     # Node.js backend
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bunkController.js
│   │   ├── bookingController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Bunk.js
│   │   ├── Booking.js
│   │   └── Location.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bunks.js
│   │   ├── bookings.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── validation.js
│   ├── config/
│   │   └── database.js
│   ├── utils/
│   ├── server.js
│   └── package.json
├── docs/
├── tests/
├── README.md
└── .gitignore
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
   MONGODB_URI=mongodb://localhost:27017/ev-recharge-bunk
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   NODE_ENV=development
   
   # Email Configuration (for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # WebSocket Configuration
   WS_PORT=8080
   ```

   Create `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   REACT_APP_WS_URL=ws://localhost:8080
   ```

5. **Database Setup**
   ```bash
   # Make sure MongoDB is running locally or configure MongoDB Atlas connection
   # The application will automatically create the required collections
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
   - Backend API: `http://localhost:5000/api`

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

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (enum: ['admin', 'user']),
  status: String (enum: ['active', 'inactive']),
  createdAt: Date,
  updatedAt: Date
}
```

### Bunk Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  location: {
    type: String (default: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  contact: {
    phone: String,
    email: String
  },
  totalSlots: Number,
  availableSlots: Number,
  chargingTypes: [String],
  amenities: [String],
  pricePerHour: Number,
  operatingHours: {
    open: String,
    close: String
  },
  isActive: Boolean,
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  bunkId: ObjectId (ref: 'Bunk'),
  slotNumber: Number,
  bookingDate: Date,
  startTime: Date,
  endTime: Date,
  duration: Number, // in hours
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'paid', 'refunded']),
  createdAt: Date,
  updatedAt: Date
}
```

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
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Bunk Routes
- `GET /api/bunks` - Get all bunks
- `GET /api/bunks/:id` - Get specific bunk
- `POST /api/bunks` - Create new bunk (Admin only)
- `PUT /api/bunks/:id` - Update bunk (Admin only)
- `DELETE /api/bunks/:id` - Delete bunk (Admin only)
- `GET /api/bunks/nearby` - Find nearby bunks

### Booking Routes
- `GET /api/bookings` - Get all bookings (Admin) / user bookings (User)
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### User Management Routes (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user

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

## 🚀 Deployment

### Using Heroku (Backend)

1. **Install Heroku CLI and login**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create ev-recharge-bunk-api
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set GOOGLE_MAPS_API_KEY=your-api-key
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_USER=your-email@gmail.com
   heroku config:set SMTP_PASS=your-app-password
   ```

4. **Configure package.json for Heroku**
   ```bash
   # Ensure your server/package.json has:
   # "start": "node server.js"
   # "type": "module"
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Using Netlify (Frontend)

1. **Build the React app**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

## 🔒 Security Features

- **JWT-based authentication** with secure token management
- **bcrypt & bcryptjs** dual-layer password hashing
- **Express Validator** comprehensive input validation
- **CORS configuration** for secure cross-origin requests
- **Environment variables** for sensitive data protection
- **Rate limiting** on API endpoints
- **MongoDB injection** prevention with Mongoose
- **Async error handling** with express-async-handler

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- Create an issue on GitHub
- Email: support@evrechargebunk.com
- Documentation: [Wiki](https://github.com/yourusername/ev-recharge-bunk/wiki)

## 🙏 Acknowledgments

- MongoDB team for the excellent database solution
- React team for the amazing frontend framework
- Google Maps team for location services
- Open source community for various libraries and tools

## 📊 Project Status

- **Status**: Active Development
- **Version**: 1.0.0
- **Stack**: MERN (MongoDB, Express.js, React.js, Node.js)
- **Last Updated**: [Current Date]
- **Maintained**: Yes

---

**Made with ❤️ for sustainable transportation using the MERN Stack**