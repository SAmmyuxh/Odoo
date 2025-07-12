import express from 'express';
import User from '../models/User.js';
import Swap from '../models/Swap.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin authentication middleware (checks if user is admin)
// This should be applied to all admin routes
router.use(auth, adminAuth);

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const totalSwaps = await Swap.countDocuments();
    const pendingSwaps = await Swap.countDocuments({ status: 'pending' });
    const completedSwaps = await Swap.countDocuments({ status: 'completed' });
    const cancelledSwaps = await Swap.countDocuments({ status: 'cancelled' });
    const rejectedSwaps = await Swap.countDocuments({ status: 'rejected' });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    const recentSwaps = await Swap.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: bannedUsers,
          recent: recentUsers
        },
        swaps: {
          total: totalSwaps,
          pending: pendingSwaps,
          completed: completedSwaps,
          cancelled: cancelledSwaps,
          rejected: rejectedSwaps,
          recent: recentSwaps
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
});

// Get all users with pagination and filtering
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Filter by status
    if (status === 'active') query.isActive = true;
    else if (status === 'banned') query.isBanned = true;
    else if (status === 'inactive') query.isActive = false;

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
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
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get user details by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's swap history
    const swapHistory = await Swap.find({
      $or: [
        { requester: req.params.id },
        { provider: req.params.id }
      ]
    })
    .populate('requester', 'name profilePhoto')
    .populate('provider', 'name profilePhoto')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        swapHistory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
});

// Ban/Unban user
router.patch('/users/:id/ban', async (req, res) => {
  try {
    const { reason, duration } = req.body; // duration in days, null for permanent
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    const banExpiry = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;

    user.isBanned = true;
    user.banReason = reason;
    user.banExpiry = banExpiry;
    user.bannedAt = new Date();
    user.bannedBy = req.userId;

    await user.save();

    res.json({
      success: true,
      message: 'User banned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned,
        banReason: user.banReason,
        banExpiry: user.banExpiry
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error banning user',
      error: error.message
    });
  }
});

// Unban user
router.patch('/users/:id/unban', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBanned = false;
    user.banReason = null;
    user.banExpiry = null;
    user.bannedAt = null;
    user.bannedBy = null;

    await user.save();

    res.json({
      success: true,
      message: 'User unbanned successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unbanning user',
      error: error.message
    });
  }
});

// Get all swaps with filtering
router.get('/swaps', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      query.$or = [
        { requester: { $in: userIds } },
        { provider: { $in: userIds } },
        { 'skillOffered.skill': { $regex: search, $options: 'i' } },
        { 'skillRequested.skill': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const swaps = await Swap.find(query)
      .populate('requester', 'name email profilePhoto')
      .populate('provider', 'name email profilePhoto')
      .sort(sortOptions)
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

// Force cancel a swap
router.patch('/swaps/:id/force-cancel', async (req, res) => {
  try {
    const { reason } = req.body;

    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed swap'
      });
    }

    swap.status = 'cancelled';
    swap.adminCancelled = true;
    swap.adminCancelReason = reason;
    swap.adminCancelledBy = req.userId;
    swap.adminCancelledAt = new Date();

    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name email profilePhoto')
      .populate('provider', 'name email profilePhoto');

    res.json({
      success: true,
      message: 'Swap cancelled by admin',
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

// Review and approve/reject user skills
router.patch('/users/:id/skills/review', async (req, res) => {
  try {
    const { skillIndex, action, reason } = req.body; // action: 'approve' or 'reject'

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (skillIndex >= user.skillsOffered.length || skillIndex < 0) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    const skill = user.skillsOffered[skillIndex];

    if (action === 'approve') {
      skill.isApproved = true;
      skill.reviewedAt = new Date();
      skill.reviewedBy = req.userId;
    } else if (action === 'reject') {
      skill.isApproved = false;
      skill.isRejected = true;
      skill.rejectionReason = reason;
      skill.reviewedAt = new Date();
      skill.reviewedBy = req.userId;
    }

    await user.save();

    res.json({
      success: true,
      message: `Skill ${action}ed successfully`,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reviewing skill',
      error: error.message
    });
  }
});

// Get pending skills for review
router.get('/skills/pending', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({
      'skillsOffered': {
        $elemMatch: {
          isApproved: { $ne: true },
          isRejected: { $ne: true }
        }
      }
    })
    .select('name email profilePhoto skillsOffered')
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Filter to only show pending skills
    const pendingSkills = users.map(user => {
      const pending = user.skillsOffered.filter(skill => 
        !skill.isApproved && !skill.isRejected
      );
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        pendingSkills: pending
      };
    }).filter(user => user.pendingSkills.length > 0);

    const total = await User.countDocuments({
      'skillsOffered': {
        $elemMatch: {
          isApproved: { $ne: true },
          isRejected: { $ne: true }
        }
      }
    });

    res.json({
      success: true,
      pendingSkills,
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
      message: 'Error fetching pending skills',
      error: error.message
    });
  }
});

// Send platform-wide message/announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, message, type = 'info', targetUsers = 'all' } = req.body;

    // Create announcement record (you might want to create an Announcement model)
    const announcement = {
      title,
      message,
      type, // 'info', 'warning', 'maintenance', 'feature'
      targetUsers,
      createdBy: req.userId,
      createdAt: new Date()
    };

    // Here you would typically:
    // 1. Save to database
    // 2. Send push notifications
    // 3. Send emails
    // 4. Add to user's notification inbox

    // For now, just return success
    res.json({
      success: true,
      message: 'Announcement sent successfully',
      announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending announcement',
      error: error.message
    });
  }
});

// Generate and download reports
router.get('/reports/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate, format = 'json' } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let reportData = {};

    switch (type) {
      case 'users':
        reportData = await User.find(query)
          .select('name email createdAt isActive isBanned completedSwaps rating')
          .sort({ createdAt: -1 });
        break;

      case 'swaps':
        reportData = await Swap.find(query)
          .populate('requester', 'name email')
          .populate('provider', 'name email')
          .sort({ createdAt: -1 });
        break;

      case 'feedback':
        reportData = await Swap.find({
          ...query,
          $or: [
            { 'feedback.requesterFeedback.rating': { $exists: true } },
            { 'feedback.providerFeedback.rating': { $exists: true } }
          ]
        })
        .populate('requester', 'name email')
        .populate('provider', 'name email')
        .select('requester provider feedback createdAt completedAt');
        break;

      case 'activity':
        const users = await User.countDocuments(query);
        const swaps = await Swap.countDocuments(query);
        const completedSwaps = await Swap.countDocuments({
          ...query,
          status: 'completed'
        });
        
        reportData = {
          period: { startDate, endDate },
          summary: {
            newUsers: users,
            totalSwaps: swaps,
            completedSwaps,
            completionRate: swaps > 0 ? (completedSwaps / swaps * 100).toFixed(2) : 0
          }
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${new Date().toISOString().split('T')[0]}.json`);

    res.json({
      success: true,
      reportType: type,
      generatedAt: new Date(),
      data: reportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
});

// Get platform activity logs
router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, type } = req.query;

    // This would typically come from a logging system
    // For now, return mock data or implement based on your logging strategy
    
    res.json({
      success: true,
      message: 'Activity logs would be implemented based on your logging system',
      logs: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching logs',
      error: error.message
    });
  }
});

export default router;