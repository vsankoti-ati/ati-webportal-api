export default () => {
  // Debug: Log environment variables to verify .env is loaded
  console.log('🔍 Environment Variables Check:');
  console.log('   DB_HOST:', process.env.DB_HOST);
  console.log('   DB_PORT:', process.env.DB_PORT);
  console.log('   DB_DATABASE:', process.env.DB_DATABASE);
  console.log('   NODE_ENV:', process.env.NODE_ENV);
  
  return {
    port: parseInt(process.env.PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    DB: {
      SYNCHRONIZE: true,
      MIGRATIONS_RUN: false,
      DROP_SCHEMA: false, // ⚠️ Changed to false to preserve data between restarts
    },
  
  database: {
    host: process.env.AZURE_SQL_SERVER || 'localhost',
    port: parseInt(process.env.AZURE_SQL_PORT, 10) || 1433,
    username: process.env.AZURE_SQL_USERNAME || 'sa',
    password: process.env.AZURE_SQL_PASSWORD || 'infy@123',
    database: process.env.AZURE_SQL_DATABASE || 'ati_portal',
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
};
};