import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // New fields for admin management
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'banned'],
      default: 'active',
    },
    isActive: { // Boolean representation of overall account activity
      type: Boolean,
      default: true,
    },
    role: { // User role for authorization (e.g., 'user', 'admin')
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    deletedAt: { // For soft deletion
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);


// Create the User model using the schema
const User = mongoose.model('User', userSchema);

// Export the User model
export default User;
