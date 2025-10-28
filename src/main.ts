import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('ATI Web Portal API')
    .setDescription('The API documentation for Adaptive Technology Insights Web Portal')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('employees', 'Employee management endpoints')
    .addTag('leaves', 'Leave management endpoints')
    .addTag('jobs', 'Job openings and referrals endpoints')
    .addTag('holidays', 'Holiday calendar endpoints')
    .addTag('timesheets', 'Timesheet management endpoints')
    .addTag('documents', 'Document management endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  // Enable CORS
  app.enableCors();
  
  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  const port = process.env.PORT || 3000;
  // Bind to 0.0.0.0 so the app is reachable from Docker host/other containers
  const host = '0.0.0.0';
  await app.listen(port, host);
  console.log(`🚀 Application is running on: http://${host}:${port}`);
  console.log(`📚 API Documentation: http://${host}:${port}/api-docs`);
}
bootstrap();