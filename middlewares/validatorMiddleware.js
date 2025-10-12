
import { matchedData, validationResult } from "express-validator";

// @desc finds the validation errors in this request and wraps them in an object with handy functions
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  req.validData = matchedData(req);
  next();
};
export default validatorMiddleware;
