import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import notificationService from '../services/notification.service.js';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register new buyer
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      businessName,
      primaryContactName,
      phone,
      gstin,
      businessAddress,
      businessType,
      yearsInBusiness,
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        businessName,
        primaryContactName,
        phone,
        gstin,
        businessAddress,
        businessType,
        yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : null,
        role: 'BUYER',
        status: 'PENDING', // Admin approval required
      },
    });

    // Notify admins about new user registration
    await notificationService.notifyAdminsNewUserRegistration(user);

    res.status(201).json({
      message: 'Registration successful. Awaiting admin approval.',
      user: {
        id: user.id,
        email: user.email,
        businessName: user.businessName,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if approved
    if (user.status !== 'APPROVED') {
      return res.status(403).json({
        error: 'Account pending admin approval',
        status: user.status,
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        businessName: user.businessName,
        primaryContactName: user.primaryContactName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        businessName: true,
        primaryContactName: true,
        phone: true,
        businessType: true,
        status: true,
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
