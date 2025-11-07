import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { DevAuthGuard } from './auth/dev-auth.guard';

// Controllers
import { AddressController } from './controllers/address.controller';
import { ApprovalController } from './controllers/approval.controller';
import { AuthController } from './controllers/auth.controller';
import { CandidateController } from './controllers/candidate.controller';
import { ClientController } from './controllers/client.controller';
import { CompanyUpdateController } from './controllers/company-update.controller';
import { DocumentController } from './controllers/document.controller';
import { EmployeeController } from './controllers/employee.controller';
import { HolidayController } from './controllers/holiday.controller';
import { JobOpeningController } from './controllers/job-opening.controller';
import { JobReferralController } from './controllers/job-referral.controller';
import { LeaveController } from './controllers/leave.controller';
import { LeaveApplicationController } from './controllers/leave-application.controller';
import { ProjectController } from './controllers/project.controller';
import { TimeEntryController } from './controllers/time-entry.controller';
import { TimesheetController } from './controllers/timesheet.controller';

// Services
import { AddressService } from './services/address.service';
import { ApprovalService } from './services/approval.service';
import { AuthService } from './services/auth.service';
import { CandidateService } from './services/candidate.service';
import { ClientService } from './services/client.service';
import { CompanyUpdateService } from './services/company-update.service';
import { DocumentService } from './services/document.service';
import { EmployeeService } from './services/employee.service';
import { HolidayService } from './services/holiday.service';
import { JobOpeningService } from './services/job-opening.service';
import { JobReferralService } from './services/job-referral.service';
import { LeaveService } from './services/leave.service';
import { LeaveApplicationService } from './services/leave-application.service';
import { OneDriveService } from './services/onedrive.service';
import { ProjectService } from './services/project.service';
import { TimeEntryService } from './services/time-entry.service';
import { TimesheetService } from './services/timesheet.service';
import { databaseProviders } from './providers/database.providers';
import { entityProviders } from './entities/entitiy.provider';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/roles.guard';
import { RequestUserService } from './services/request-user.service';
import { AuthMiddleware } from './middleware/auth-middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    AuthModule,
    JwtModule
  ],
  controllers: [
    AddressController,
    ApprovalController,
    AuthController,
    CandidateController,
    ClientController,
    CompanyUpdateController,
    //DocumentController,
    EmployeeController,
    HolidayController,
    JobOpeningController,
    JobReferralController,
    LeaveController,
    LeaveApplicationController,
    ProjectController,
    TimeEntryController,
    TimesheetController,
  ],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: DevAuthGuard,
    // },
    RequestUserService,
    RolesGuard,
    AddressService,
    ApprovalService,
    AuthService,
    CandidateService,
    ClientService,
    CompanyUpdateService,
    //DocumentService,
    EmployeeService,
    HolidayService,
    JobOpeningService,
    JobReferralService,
    LeaveService,
    LeaveApplicationService,
    //OneDriveService,
    ProjectService,
    TimeEntryService,
    TimesheetService,
    ...databaseProviders,
    ...entityProviders
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    // Configure middleware here if needed
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}