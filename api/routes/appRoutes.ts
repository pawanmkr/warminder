import { Router, Response } from 'express';
import { InputValidation } from '../utils/bodyValidation.js';

const router = Router();
export default router;

// health check
router
  .get('/health', (res: Response) => {
    res.status(200).send('OK');
  });

// Routes for auth-service '/auth'
router
  .post('/auth/register', InputValidation.validateUserRegistration, UserController.registerNewUser)
  .post('/auth/login', InputValidation.validateUserLogin, UserController.login)

  .post('/auth/token/refresh', verifyAndRefreshToken)

  .post('/auth/password/reset/request', InputValidation.validateEmail, generatePasswordResetToken)
  .post('/auth/password/reset/confirm', InputValidation.validatePassword, confirmPasswordReset)

  .post('/auth/email/verify/request', InputValidation.validateEmail, sendEmailVerificationLink)
  .get('/auth/email/verify/confirm', confirmEmailVerification)

  /* PROTECTED ROUTES */
  .get('/auth/user/profile', authorization, getUserProfile)
  .put('/auth/user/profile', InputValidation.validateUserUpdate, authorization, updateUserProfile)
  .put('/auth/user/profile/archive', InputValidation.validateArchivedBy, authorization, archiveUserProfile)
  .delete('/auth/user/profile', authorization, deleteUserProfile);

