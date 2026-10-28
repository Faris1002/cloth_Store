import { supabaseAdmin } from '../config/supabase.js';
import { sendError } from '../utils/response.js';
import { verifyToken } from '../utils/security.js';

/**
 * Authentication middleware that verifies custom JWT or Supabase Bearer token server-side.
 * Seamlessly authenticates both custom users table tokens and Supabase Auth tokens.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication token missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication token missing', 401);
    }

    // 1. Verify custom token from public.users credentials table first
    const customPayload = verifyToken(token);
    if (customPayload && customPayload.id) {
      req.user = {
        id: customPayload.id,
        email: customPayload.email,
        full_name: customPayload.full_name,
        role: customPayload.role || 'customer',
        user_metadata: { full_name: customPayload.full_name },
      };
      req.token = token;
      return next();
    }

    // 2. Fallback: Verify Supabase Auth token
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && user) {
        req.user = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          role: user.role || 'customer',
          user_metadata: user.user_metadata,
        };
        req.token = token;
        return next();
      }
    } catch {
      // Supabase verification failed
    }

    return sendError(res, 'UNAUTHORIZED', 'Invalid or expired session token', 401);
  } catch (err) {
    console.error('Auth verification error:', err);
    return sendError(res, 'UNAUTHORIZED', 'Authentication failed', 401);
  }
};

/**
 * Optional authentication middleware: attaches user if valid token exists, proceeds regardless
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        // Try custom token
        const customPayload = verifyToken(token);
        if (customPayload && customPayload.id) {
          req.user = {
            id: customPayload.id,
            email: customPayload.email,
            full_name: customPayload.full_name,
            role: customPayload.role || 'customer',
            user_metadata: { full_name: customPayload.full_name },
          };
          req.token = token;
          return next();
        }

        // Try Supabase token
        try {
          const { data: { user } } = await supabaseAdmin.auth.getUser(token);
          if (user) {
            req.user = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              role: user.role || 'customer',
              user_metadata: user.user_metadata,
            };
            req.token = token;
          }
        } catch {
          // Ignore
        }
      }
    }
  } catch {
    // Ignore and proceed unauthenticated
  }
  next();
};
