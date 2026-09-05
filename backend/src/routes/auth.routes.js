const express = require("express");
const {
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require("../controllers/auth.controller");
const {
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  validateBody,
} = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/login", validateBody(loginSchema), login);
router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);
router.post("/refresh-token", validateBody(refreshTokenSchema), refreshToken);
router.post("/logout", authenticate, logout);
router.post("/change-password", authenticate, validateBody(changePasswordSchema), changePassword);

module.exports = router;
