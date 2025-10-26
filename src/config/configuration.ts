export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  DB: {
    SYNCHRONIZE: true,
    MIGRATIONS_RUN: false,
    DROP_SCHEMA: false, // ⚠️ Changed to false to preserve data between restarts
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    username: process.env.DB_USERNAME || 'sa',
    password: process.env.DB_PASSWORD || 'infy@123',
    database: process.env.DB_DATABASE || 'ati_webportal',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-here',
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  },
  
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    password: process.env.SMTP_PASSWORD || 'your-app-password',
  },
});