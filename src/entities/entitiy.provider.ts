import { getRepositoryToken } from "@nestjs/typeorm";
import { Address } from "./address.entity";
import { DataSource } from "typeorm";
import { Approval } from "./approval.entity";
import { Candidate } from "./candidate.entity";
import { Document } from "./document.entity";
import { CompanyUpdate } from "./company-update.entity";
import { Employee } from "./employee.entity";
import { JobOpening } from "./job-opening.entity";
import { JobReferral } from "./job-referral.entity";
import { LeaveApplication } from "./leave-application.entity";
import { Leave } from "./leave.entity";
import { Project } from "./project.entity";
import { TimeEntry } from "./time-entry.entity";
import { Time } from "mssql";
import { Timesheet } from "./timesheet.entity";
import { Client } from "./client.entity";
import { Holiday } from "./holiday.entity";


export const entityProviders = [
    {
        provide: getRepositoryToken(Address),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Address),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(Approval),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Approval),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(Candidate),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Candidate),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(CompanyUpdate),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CompanyUpdate),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(Document),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Document),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(Employee),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Employee),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(JobOpening),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(JobOpening),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(JobReferral),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(JobReferral),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(LeaveApplication),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LeaveApplication),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(Leave),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Leave),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(Project),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Project),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: getRepositoryToken(TimeEntry),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TimeEntry),
        inject: ['DATA_SOURCE'],
    },
     {
        provide: getRepositoryToken(Timesheet),
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Timesheet),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'CLIENT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Client),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'HOLIDAY_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Holiday),
        inject: ['DATA_SOURCE'],
    },
];