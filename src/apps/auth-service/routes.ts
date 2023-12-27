import { Router } from 'express';
import verifyJwtToken from './middlewares/tokenVerification.js';
import { InputValidation } from './middlewares/validation.js';
import {
  registerNewUser,
  login,
  generatePasswordResetToken,
  verifyAndRefreshToken,
  confirmPasswordReset,
  sendEmailVerificationLink,
  confirmEmailVerification,
  getUserProfile,
  updateUserProfile,
  //deleteUserProfile,
  //archiveUserProfile,
} from './controllers/index.js';

export const authRouter = Router();

authRouter
  .post('/register', InputValidation.validateUserRegistration, registerNewUser)
  .post('/login', InputValidation.validateUserLogin, login)

  .post('/token/refresh', verifyAndRefreshToken)

  .post(
    '/password/reset/request',
    InputValidation.validateEmail,
    generatePasswordResetToken,
  )
  .post(
    '/password/reset/confirm',
    InputValidation.validatePassword,
    confirmPasswordReset,
  )

  .post(
    '/email/verify/request',
    InputValidation.validateEmail,
    sendEmailVerificationLink,
  )
  .get('/email/verify/confirm', confirmEmailVerification)

  // PROTECTED ROUTES
  .get('/user/profile', verifyJwtToken, getUserProfile)
  .put(
    '/user/profile',
    InputValidation.validateUserUpdate,
    verifyJwtToken,
    updateUserProfile,
  )
  .put(
    '/user/profile/archive',
    InputValidation.validateArchivedBy,
    verifyJwtToken,
    //archiveUserProfile,
  );
//.delete("/user/profile", verifyJwtToken, deleteUserProfile);
