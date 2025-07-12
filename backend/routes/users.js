
import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js';
import Swap from '../models/Swap.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all users (for browsing)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      skill, 
      location, 
      page = 1, 
      limit = 10, 
      search,
      availability 
    } = req.query;

    const query = { isPublic: true, isActive: true, isBanned: false };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'skillsOffered.skill': { $regex: search, $options: 'i' } },
        { 'skillsWanted.skill': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by skill
    if (skill) {
      query.$or = [
        { 'skillsOffered.skill': { $regex: skill, $options: 'i' } },
        { 'skillsWanted.skill': { $regex: skill, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by availability
    if (availability) {
      const availabilityArray = availability.split(',');
      const availabilityQuery = {};
      availabilityArray.forEach(av => {
        availabilityQuery[`availability.${av}`] = true;
      });
      Object.assign(query, availabilityQuery);
    }

    // Exclude current user from results
    if (req.userId) {
      query._id = { $ne: req.userId };
    }

    const users = await User.find(query)
      .select('-password -email')
      .sort({ lastActive: -1 })
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

// Get user by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if profile is public or if it's the user's own profile
    if (!user.isPublic && (!req.userId || req.userId !== user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Profile is private'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('profilePhoto'), async (req, res) => {
  try {
    const {
      name,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic
    } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (skillsOffered) updateData.skillsOffered = JSON.parse(skillsOffered);
    if (skillsWanted) updateData.skillsWanted = JSON.parse(skillsWanted);
    if (availability) updateData.availability = JSON.parse(availability);
    if (isPublic !== undefined) updateData.isPublic = isPublic === 'true';

    if (req.file) {
      updateData.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Get user's swaps
router.get('/me/swaps', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {
      $or: [
        { requester: req.userId },
        { provider: req.userId }
      ]
    };

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

// Get user statistics
router.get('/me/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const swapStats = await Swap.aggregate([
      {
        $match: {
          $or: [
            { requester: user._id },
            { provider: user._id }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalSwaps: user.completedSwaps,
      rating: user.rating,
      skillsOffered: user.skillsOffered.length,
      skillsWanted: user.skillsWanted.length,
      joinedAt: user.joinedAt,
      swapsByStatus: swapStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Search users by skills
router.get('/search/skills', optionalAuth, async (req, res) => {
  try {
    const { q, type = 'offered' } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skillField = type === 'offered' ? 'skillsOffered' : 'skillsWanted';
    
    const users = await User.find({
      isPublic: true,
      isActive: true,
      isBanned: false,
      [`${skillField}.skill`]: { $regex: q, $options: 'i' },
      _id: { $ne: req.userId || null }
    })
    .select('name location profilePhoto skillsOffered skillsWanted rating')
    .limit(20);

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message
    });
  }
});

// Get popular skills
router.get('/popular/skills', async (req, res) => {
  try {
    const offeredSkills = await User.aggregate([
      { $match: { isPublic: true, isActive: true, isBanned: false } },
      { $unwind: '$skillsOffered' },
      { $group: { _id: '$skillsOffered.skill', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const wantedSkills = await User.aggregate([
      { $match: { isPublic: true, isActive: true, isBanned: false } },
      { $unwind: '$skillsWanted' },
      { $group: { _id: '$skillsWanted.skill', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      popularSkills: {
        offered: offeredSkills.map(skill => ({
          skill: skill._id,
          count: skill.count
        })),
        wanted: wantedSkills.map(skill => ({
          skill: skill._id,
          count: skill.count
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular skills',
      error: error.message
    });
  }
});

export default router;