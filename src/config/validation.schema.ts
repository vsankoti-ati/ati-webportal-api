import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Server
  PORT: Joi.number().default(3001),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),

  // SMTP
  // SMTP_HOST: Joi.string().required(),
  // SMTP_PORT: Joi.number().default(587),
  // SMTP_USER: Joi.string().required(),
  // SMTP_PASSWORD: Joi.string().required(),
});