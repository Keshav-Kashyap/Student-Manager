const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name must be at most 50 characters']
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true,
    maxlength: [20, 'Class must be at most 20 characters']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'DOB is required'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    minlength: [3, 'Address must be at least 3 characters'],
    maxlength: [200, 'Address must be at most 200 characters']
  },
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
    trim: true,
    minlength: [3, 'Father name must be at least 3 characters'],
    maxlength: [50, 'Father name must be at most 50 characters']
  },
  motherName: {
    type: String,
    required: [true, "Mother's name is required"],
    trim: true,
    minlength: [3, 'Mother name must be at least 3 characters'],
    maxlength: [50, 'Mother name must be at most 50 characters']
  },
  photoPath: {
    type: String,
    default: null
  },
  printStatus: {
  type: String,
  enum: ['not_sent', 'sent_to_print', 'printed', 'delivered'],
  default: 'not_sent',
},

 printedAt: {
    type: Date,
    default: null
  },
  updatedAfterPrint: {
    type: Boolean,
    default: false
  },


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


studentSchema.pre('save', function (next) {
  // Only reset if a printed student's info was updated (but not when status is being updated to 'printed')
  if (
    this.isModified() &&
    this.printStatus === 'printed' &&
    !this.isModified('printStatus') &&
    !this.isModified('printedAt')
  ) {
    this.printStatus = 'not_sent';
    this.printedAt = null;
    this.updatedAfterPrint = true;
  }
  next();
});


module.exports = mongoose.model('Student', studentSchema);
