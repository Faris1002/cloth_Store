import { sendError } from '../utils/response.js';

/**
 * Centralized express error handler
 */
export const errorHandler = (err, req, res, _next) => {
  console.error('Unhandled Application Error:', err);

  // Payload too large
  if (err.type === 'entity.too.large') {
    return sendError(res, 'PAYLOAD_TOO_LARGE', 'Request payload exceeds size limit', 413);
  }

  // JSON parse error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'BAD_REQUEST', 'Malformed JSON payload', 400);
  }

  // CORS error
  if (err.message && err.message.includes('CORS')) {
    return sendError(res, 'CORS_ERROR', 'Cross-origin request blocked by security policy', 403);
  }

  // Default safe server error response (does not leak stack trace or internal details)
  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd ? 'Internal server error' : err.message || 'Internal server error';

  return sendError(res, 'INTERNAL_SERVER_ERROR', message, err.statusCode || 500);
};

/**
 * 404 Route Not Found middleware
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`, 404);
};
