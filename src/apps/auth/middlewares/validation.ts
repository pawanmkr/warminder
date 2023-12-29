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
    name: Joi.string().required(),
    email: Joi.string().email().trim().required(),
    country_code: Joi.number(),
    phone: Joi.string().length(10),
    password: Joi.string().min(6).required(),
  });

  static userLoginSchema = Joi.object({
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

  static userUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().trim().optional(),
    country_code: Joi.number().optional(),
    phone: Joi.string().optional().length(10),
    password: Joi.string().min(6).optional(),
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

  static validateUserUpdate = InputValidation.validateSchema(
    InputValidation.userUpdateSchema,
  );
}
