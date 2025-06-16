// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  collegeName: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
   phone: {  // ✅ New field added here
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`,
    },
  },
  emergencyContact: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // basic 10-digit validation
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`,
    },
  },


 profileImage: {
    type: String,
    default: '',
  },

},



{
  timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);
