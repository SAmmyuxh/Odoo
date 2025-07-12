
import mongoose from 'mongoose';

const swapSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillOffered: {
    skill: {
      type: String,
      required: true
    },
    description: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  },
  skillRequested: {
    skill: {
      type: String,
      required: true
    },
    description: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    trim: true
  },
  scheduledDate: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  meetingType: {
    type: String,
    enum: ['online', 'in-person', 'hybrid'],
    default: 'online'
  },
  meetingDetails: {
    type: String,
    trim: true
  },
  feedback: {
    requesterFeedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    },
    providerFeedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      submittedAt: Date
    }
  },
  completedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ provider: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });

// Static method to get swap statistics
swapSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
};

// Method to check if user can rate this swap
swapSchema.methods.canRate = function(userId) {
  return this.status === 'completed' && 
         (this.requester.toString() === userId.toString() || 
          this.provider.toString() === userId.toString());
};

// Method to check if user has already rated
swapSchema.methods.hasRated = function(userId) {
  if (this.requester.toString() === userId.toString()) {
    return !!this.feedback.requesterFeedback.rating;
  }
  if (this.provider.toString() === userId.toString()) {
    return !!this.feedback.providerFeedback.rating;
  }
  return false;
};

const Swap = mongoose.model('Swap', swapSchema);

export default Swap;
