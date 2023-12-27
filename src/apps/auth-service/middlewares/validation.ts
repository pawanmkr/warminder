import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export class InputValidation {
  static validateSchema(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      next();
    };
  }

  static userRegistrationSchema = Joi.object({
    user_type: Joi.string().valid("teacher", "student", "admin").required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string()
      .min(4)
      .pattern(/^[a-z0-9.?_?]+$/)
      .trim()
      .required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
  });

  static userLoginSchema = Joi.object({
    username: Joi.string()
      .min(4)
      .pattern(/^[a-z0-9.?_?]+$/)
      .trim()
      .optional(),
    email: Joi.string().email().trim().optional(),
    password: Joi.string().min(6).required(),
  });

  static emailSchema = Joi.object({
    email: Joi.string().email().trim().required(),
  });

  static passwordConfirmSchema = Joi.object({
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().min(6).required(),
    reset_token: Joi.string().required(),
  });

  static userArchiveSchema = Joi.object({
    archived_by: Joi.required(),
  });

  static userUpdateSchema = Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    username: Joi.string()
      .min(4)
      .pattern(/^[a-z0-9.?_?]+$/)
      .trim()
      .optional(),
    email: Joi.string().email().trim().optional(),
    password: Joi.string().min(6).optional(),
    updated_by: Joi.required(),
  });

  static validateUserRegistration = InputValidation.validateSchema(
    InputValidation.userRegistrationSchema,
  );
  static validateUserLogin = InputValidation.validateSchema(
    InputValidation.userLoginSchema,
  );
  static validateEmail = InputValidation.validateSchema(
    InputValidation.emailSchema,
  );
  static validatePassword = InputValidation.validateSchema(
    InputValidation.passwordConfirmSchema,
  );
  static validateArchivedBy = InputValidation.validateSchema(
    InputValidation.userArchiveSchema,
  );
  static validateUserUpdate = InputValidation.validateSchema(
    InputValidation.userUpdateSchema,
  );
}
