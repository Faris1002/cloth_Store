import { sendError } from '../utils/response.js';

/**
 * Higher-order middleware to validate req.body, req.query, or req.params with Zod schema
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const firstMessage = error.errors[0]?.message || 'Validation failed';
        return sendError(res, 'VALIDATION_ERROR', firstMessage, 400);
      }
      return sendError(res, 'VALIDATION_ERROR', error.message || 'Invalid request data', 400);
    }
  };
};
