import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  location: {
    type: String,
    trim: true
  },
  profilePhoto: {
    type: String,
    default: null
  },
  skillsOffered: [{
    skill: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    // ADD THESE ADMIN FIELDS
    isApproved: {
      type: Boolean,
      default: false
    },
    isRejected: {
      type: Boolean,
      default: false
    },
    rejectionReason: {
      type: String,
      trim: true
    },
    reviewedAt: {
      type: Date
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  skillsWanted: [{
    skill: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner'
    }
  }],
  availability: {
    weekdays: {
      type: Boolean,
      default: false
    },
    weekends: {
      type: Boolean,
      default: false
    },
    mornings: {
      type: Boolean,
      default: false
    },
    afternoons: {
      type: Boolean,
      default: false
    },
    evenings: {
      type: Boolean,
      default: false
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  // ADD THESE ADMIN FIELDS
  banReason: {
    type: String,
    trim: true
  },
  banExpiry: {
    type: Date
  },
  bannedAt: {
    type: Date
  },
  bannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  completedSwaps: {
    type: Number,
    default: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update rating method
userSchema.methods.updateRating = function(newRating) {
  this.rating.average = ((this.rating.average * this.rating.count) + newRating) / (this.rating.count + 1);
  this.rating.count += 1;
  return this.save();
};

// Get public profile method
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.email;
  return userObject;
};

// ADD THIS METHOD for checking if user is banned
userSchema.methods.isBannedCheck = function() {
  if (!this.isBanned) return false;
  
  // Check if ban has expired
  if (this.banExpiry && new Date() > this.banExpiry) {
    this.isBanned = false;
    this.banReason = null;
    this.banExpiry = null;
    this.bannedAt = null;
    this.bannedBy = null;
    this.save();
    return false;
  }
  
  return true;
};

// Index for search functionality
userSchema.index({ 
  name: 'text',
  'skillsOffered.skill': 'text',
  'skillsWanted.skill': 'text',
  location: 'text'
});

const User = mongoose.model('User', userSchema);

export default User;
