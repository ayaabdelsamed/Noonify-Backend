// eslint-disable-next-line import/no-extraneous-dependencies
import xss from "xss";
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoSanitize from "mongo-sanitize";

// sanitize a single value (string/array/object)
function sanitizeValue(value) {
  if (typeof value === "string") {
    // escape HTML tags (keeps inner text and escapes tags)
    return xss(value).trim();
  }
  if (Array.isArray(value)) {
    return value.map((v) => sanitizeValue(v));
  }
  if (value && typeof value === "object") {
    const cleaned = {};
    Object.keys(value).forEach((k) => {
      cleaned[k] = sanitizeValue(value[k]);
    });
    return cleaned;
  }
  return value;
}

const sanitizeMiddleware = (req, res, next) => {
  try {
    // BODY: safe to replace whole body
    if (req.body && typeof req.body === "object") {
      const cleanedBody = sanitizeValue(req.body);
      // remove dangerous mongo operators from keys/values
      req.body = mongoSanitize(cleanedBody);
    }

    // QUERY: mutate in place (don't reassign req.query)
    if (req.query && typeof req.query === "object") {
      const cleanedQuery = sanitizeValue(req.query);
      Object.keys(cleanedQuery).forEach((key) => {
        req.query[key] = cleanedQuery[key];
      });
      mongoSanitize(req.query);
    }

    // PARAMS: mutate in place
    if (req.params && typeof req.params === "object") {
      const cleanedParams = sanitizeValue(req.params);
      Object.keys(cleanedParams).forEach((key) => {
        req.params[key] = cleanedParams[key];
      });
      mongoSanitize(req.params);
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default sanitizeMiddleware;
