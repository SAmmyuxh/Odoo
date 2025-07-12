import express from 'express';
import Swap from '../models/Swap.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a new swap request
router.post('/', auth, async (req, res) => {
  try {
    const {
      providerId,
      skillOffered,
      skillRequested,
      message,
      scheduledDate,
      duration,
      meetingType,
      meetingDetails
    } = req.body;

    // Check if provider exists
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }

    // Check if user is trying to swap with themselves
    if (req.userId === providerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create swap with yourself'
      });
    }

    // Check if provider has the requested skill
    const hasSkill = provider.skillsOffered.some(
      skill => skill.skill.toLowerCase() === skillRequested.skill.toLowerCase()
    );

    if (!hasSkill) {
      return res.status(400).json({
        success: false,
        message: 'Provider does not offer this skill'
      });
    }

    // Check if there's already a pending swap between these users for the same skills
    const existingSwap = await Swap.findOne({
      requester: req.userId,
      provider: providerId,
      'skillOffered.skill': skillOffered.skill,
      'skillRequested.skill': skillRequested.skill,
      status: 'pending'
    });

    if (existingSwap) {
      return res.status(400).json({
        success: false,
        message: 'A pending swap request already exists for these skills'
      });
    }

    const swap = new Swap({
      requester: req.userId,
      provider: providerId,
      skillOffered,
      skillRequested,
      message,
      scheduledDate,
      duration,
      meetingType,
      meetingDetails
    });

    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      swap: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating swap request',
      error: error.message
    });
  }
});

// Get all swaps for current user
router.get('/', auth, async (req, res) => {
  try {
    const { status, type = 'all', page = 1, limit = 10 } = req.query;

    let query = {};

    // Filter by type (sent/received/all)
    if (type === 'sent') {
      query.requester = req.userId;
    } else if (type === 'received') {
      query.provider = req.userId;
    } else {
      query = {
        $or: [
          { requester: req.userId },
          { provider: req.userId }
        ]
      };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const swaps = await Swap.find(query)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Swap.countDocuments(query);

    res.json({
      success: true,
      swaps,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swaps',
      error: error.message
    });
  }
});

// Get swap by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is involved in this swap
    if (swap.requester._id.toString() !== req.userId && 
        swap.provider._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      swap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap',
      error: error.message
    });
  }
});

// Accept swap request
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is the provider
    if (swap.provider.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the provider can accept this swap'
      });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Swap is not pending'
      });
    }

    swap.status = 'accepted';
    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    res.json({
      success: true,
      message: 'Swap accepted successfully',
      swap: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting swap',
      error: error.message
    });
  }
});

// Reject swap request
router.patch('/:id/reject', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is the provider
    if (swap.provider.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the provider can reject this swap'
      });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Swap is not pending'
      });
    }

    swap.status = 'rejected';
    swap.rejectedAt = new Date();
    swap.rejectionReason = reason;
    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    res.json({
      success: true,
      message: 'Swap rejected successfully',
      swap: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting swap',
      error: error.message
    });
  }
});

// Complete swap
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is involved in this swap
    if (swap.requester.toString() !== req.userId && 
        swap.provider.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Swap must be accepted first'
      });
    }

    swap.status = 'completed';
    swap.completedAt = new Date();
    await swap.save();

    // Update user completed swap counts
    await User.findByIdAndUpdate(swap.requester, { $inc: { completedSwaps: 1 } });
    await User.findByIdAndUpdate(swap.provider, { $inc: { completedSwaps: 1 } });

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    res.json({
      success: true,
      message: 'Swap completed successfully',
      swap: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing swap',
      error: error.message
    });
  }
});

// Cancel swap
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is involved in this swap
    if (swap.requester.toString() !== req.userId && 
        swap.provider.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (swap.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed swap'
      });
    }

    swap.status = 'cancelled';
    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    res.json({
      success: true,
      message: 'Swap cancelled successfully',
      swap: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling swap',
      error: error.message
    });
  }
});

// Delete swap request (only for pending requests by requester)
router.delete('/:id', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is the requester
    if (swap.requester.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the requester can delete this swap'
      });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending swap requests'
      });
    }

    await Swap.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Swap request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting swap request',
      error: error.message
    });
  }
});

// Add feedback/rating to swap
router.post('/:id/feedback', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed swaps'
      });
    }

    // Check if user is involved in this swap
    if (swap.requester.toString() !== req.userId && 
        swap.provider.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Determine if user is requester or provider
    const isRequester = swap.requester.toString() === req.userId;
    const feedbackField = isRequester ? 'requesterFeedback' : 'providerFeedback';

    // Check if user has already provided feedback
    if (swap.feedback[feedbackField].rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already provided feedback for this swap'
      });
    }

    // Add feedback
    swap.feedback[feedbackField] = {
      rating,
      comment,
      submittedAt: new Date()
    };

    await swap.save();

    // Update the other user's rating
    const otherUserId = isRequester ? swap.provider : swap.requester;
    const otherUser = await User.findById(otherUserId);
    await otherUser.updateRating(rating);

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      swap: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
});

// Update swap details (meeting info, etc.)
router.patch('/:id', auth, async (req, res) => {
  try {
    const {
      scheduledDate,
      duration,
      meetingType,
      meetingDetails
    } = req.body;

    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is involved in this swap
    if (swap.requester.toString() !== req.userId && 
        swap.provider.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only update accepted swaps'
      });
    }

    // Update fields
    if (scheduledDate) swap.scheduledDate = scheduledDate;
    if (duration) swap.duration = duration;
    if (meetingType) swap.meetingType = meetingType;
    if (meetingDetails) swap.meetingDetails = meetingDetails;

    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto rating')
      .populate('provider', 'name profilePhoto rating');

    res.json({
      success: true,
      message: 'Swap updated successfully',
      swap: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating swap',
      error: error.message
    });
  }
});

export default router;