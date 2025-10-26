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
  
  await app.listen(3001);
}
bootstrap();