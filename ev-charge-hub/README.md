# Electric Vehicle Recharge Bunk

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ev-recharge-bunk.svg)](https://github.com/yourusername/ev-recharge-bunk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ev-recharge-bunk.svg)](https://github.com/yourusername/ev-recharge-bunk/network)
[![GitHub license](https://img.shields.io/github/license/yourusername/ev-recharge-bunk.svg)](https://github.com/yourusername/ev-recharge-bunk/blob/main/LICENSE)

A comprehensive web application for managing Electric Vehicle charging stations with real-time slot availability, location tracking, and administrative controls.

## 🚗 Project Overview

The Electric Vehicle Recharge Bunk is a medium-complexity web application designed to facilitate the management and usage of EV charging stations. The platform provides separate interfaces for administrators and users, enabling efficient management of charging bunks and seamless user experience for finding and booking charging slots.

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Firestore Database, Authentication)
- **Maps Integration**: Google Maps API
- **Hosting**: Firebase Hosting
- **Version Control**: Git & GitHub

## 📋 Features

### 👨‍💼 Admin Module
- **Authentication**: Secure login and registration system
- **Bunk Management**: Create and manage EV charging bunk locations
- **Slot Management**: Real-time management of charging slots
- **Location Details**: Add comprehensive bunk information including:
  - Address details
  - Contact information
  - Google Maps integration
  - Slot capacity and availability

### 👤 User Module
- **Authentication**: User registration and login
- **Location Search**: Find nearby EV charging bunks
- **Bunk Details**: View comprehensive information about charging stations
- **Real-time Availability**: Check slot vacancy in real-time
- **Map Integration**: Interactive Google Maps for location visualization
- **Contact Information**: Access bunk contact details and addresses

## 🏗️ Project Structure

```
ev-recharge-bunk/
├── src/
│   ├── admin/
│   │   ├── admin-dashboard.html
│   │   ├── manage-bunks.html
│   │   ├── manage-slots.html
│   │   ├── css/
│   │   └── js/
│   ├── user/
│   │   ├── user-dashboard.html
│   │   ├── search-bunks.html
│   │   ├── bunk-details.html
│   │   ├── css/
│   │   └── js/
│   ├── auth/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── css/
│   │   └── js/
│   ├── shared/
│   │   ├── css/
│   │   ├── js/
│   │   └── components/
│   └── assets/
│       ├── images/
│       └── icons/
├── firebase/
│   ├── firestore.rules
│   └── firebase.json
├── docs/
├── tests/
├── README.md
├── package.json
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase CLI
- Google Maps API Key
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ev-recharge-bunk.git
   cd ev-recharge-bunk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   ```bash
   # Install Firebase CLI globally
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase project
   firebase init
   ```

4. **Environment Configuration**
   Create a `config/firebase-config.js` file:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Google Maps API Setup**
   Add your Google Maps API key to `config/maps-config.js`:
   ```javascript
   const GOOGLE_MAPS_API_KEY = "your-google-maps-api-key";
   ```

### Running the Application

1. **Development Server**
   ```bash
   # Start local development server
   firebase serve --only hosting
   ```

2. **Access the application**
   - Open your browser and navigate to `http://localhost:5000`
   - Admin Panel: `http://localhost:5000/admin`
   - User Panel: `http://localhost:5000/user`

## 📊 Database Schema

### Collections

#### 1. Users Collection
```javascript
{
  uid: "string",
  email: "string",
  name: "string",
  phone: "string",
  role: "admin" | "user",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### 2. Bunks Collection
```javascript
{
  bunkId: "string",
  name: "string",
  address: {
    street: "string",
    city: "string",
    state: "string",
    zipCode: "string",
    country: "string"
  },
  coordinates: {
    latitude: "number",
    longitude: "number"
  },
  contact: {
    phone: "string",
    email: "string"
  },
  totalSlots: "number",
  availableSlots: "number",
  createdBy: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### 3. Slots Collection
```javascript
{
  slotId: "string",
  bunkId: "string",
  slotNumber: "number",
  isOccupied: "boolean",
  chargingType: "string",
  powerCapacity: "string",
  currentUserId: "string" | null,
  startTime: "timestamp" | null,
  estimatedEndTime: "timestamp" | null
}
```

## 🔧 Development Workflow

### Code Standards
- Use ES6+ JavaScript features
- Follow semantic HTML5 structure
- Implement responsive CSS design
- Use meaningful variable and function names
- Add comprehensive comments for complex logic
- Follow modular programming practices

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all
```

## 📱 Usage Guide

### For Administrators

1. **Login**: Access admin panel with administrator credentials
2. **Create Bunk**: Add new EV charging locations with complete details
3. **Manage Slots**: Monitor and update slot availability in real-time
4. **View Analytics**: Track usage statistics and bunk performance

### For Users

1. **Register/Login**: Create account or sign in to existing account
2. **Search Bunks**: Find nearby charging stations using location services
3. **View Details**: Check bunk information, availability, and contact details
4. **Navigate**: Use integrated Google Maps for directions

## 🧪 Testing

The application includes comprehensive testing at multiple levels:

- **Unit Tests**: Individual component functionality
- **Integration Tests**: Firebase integration and API calls
- **UI Tests**: User interface interactions
- **Security Tests**: Authentication and authorization

## 🚀 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

3. **Custom Domain** (Optional)
   ```bash
   firebase hosting:channel:deploy preview
   ```

## 🔒 Security Features

- Firebase Authentication for secure user management
- Firestore Security Rules for data protection
- Input validation and sanitization
- HTTPS enforcement
- API key protection

## 📈 Optimization

- **Performance**: Lazy loading, code splitting, image optimization
- **SEO**: Meta tags, structured data, sitemap
- **Accessibility**: WCAG 2.1 compliance, keyboard navigation
- **Mobile**: Responsive design, PWA features

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
- Email: support@evrechargybunk.com
- Documentation: [Wiki](https://github.com/yourusername/ev-recharge-bunk/wiki)

## 🙏 Acknowledgments

- Firebase team for the excellent backend services
- Google Maps team for location services
- Open source community for various libraries and tools

## 📊 Project Status

- **Status**: Active Development
- **Version**: 1.0.0
- **Last Updated**: [Current Date]
- **Maintained**: Yes

---

**Made with ❤️ for sustainable transportation**