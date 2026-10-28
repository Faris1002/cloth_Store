import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

const router = Router();

// Apply auth rate limiter
router.use(authRateLimiter);

// POST /api/auth/register - Register new user directly into public.users table
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login - Authenticate with email & password against public.users table
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me - Return current authenticated user profile
router.get('/me', requireAuth, getMe);

// POST /api/auth/logout - Logout current session
router.post('/logout', optionalAuth, logout);

export default router;
