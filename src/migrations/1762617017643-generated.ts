import { MigrationInterface, QueryRunner } from "typeorm";

export class Generated1762617017643 implements MigrationInterface {
    name = 'Generated1762617017643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_3c2bc72f03fd5abbbc5ac169498" DEFAULT NEWSEQUENTIALID(), "first_name" nvarchar(255) NOT NULL, "last_name" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "phone" nvarchar(255) NOT NULL, "department" nvarchar(255) NOT NULL, "position" nvarchar(255) NOT NULL, "manager" nvarchar(255), "hire_date" datetime NOT NULL, "employee_id" nvarchar(255) NOT NULL, "address" nvarchar(255) NOT NULL, "address_line2" nvarchar(255), "city" nvarchar(255) NOT NULL, "state" nvarchar(255) NOT NULL, "zip_code" nvarchar(255) NOT NULL, "emergency_contact" nvarchar(255), "emergency_phone" nvarchar(255), "skills" varchar(255), "comment" nvarchar(255), "created_at" datetime2 NOT NULL CONSTRAINT "DF_d099ddf195a851074706bdec5d6" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_3afe30761d4d448d02d49a1f2f3" DEFAULT getdate(), CONSTRAINT "UQ_817d1d427138772d47eca048855" UNIQUE ("email"), CONSTRAINT "UQ_f9d306b968b54923539b3936b03" UNIQUE ("employee_id"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" text, "start_date" date NOT NULL, "end_date" date NOT NULL, "status" varchar(20) NOT NULL CONSTRAINT "DF_57856cedbec1fbed761154d162b" DEFAULT 'active', "created_at" datetime NOT NULL CONSTRAINT "DF_526b7ef1de81482727def287dc9" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_a50ae964a310384ba88488edd92" DEFAULT getdate(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "time_entries" ("id" int NOT NULL IDENTITY(1,1), "timesheet_id" int NOT NULL, "project_id" int NOT NULL, "entry_date" date NOT NULL, "start_time" time NOT NULL, "end_time" time NOT NULL, "hours_worked" decimal(4,2) NOT NULL, "notes" text, "created_at" datetime NOT NULL CONSTRAINT "DF_0c787eeb1af4e5c3a4d65c2d194" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_2cbd146e7e95758e7df98be192a" DEFAULT getdate(), CONSTRAINT "PK_b8bc5f10269ba2fe88708904aa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "approval" ("id" int NOT NULL IDENTITY(1,1), "timesheet_id" int NOT NULL, "approver_employee_id" uniqueidentifier NOT NULL, "approval_status" varchar(20) NOT NULL CONSTRAINT "DF_cbaba1b676a0e469229e198dab9" DEFAULT 'pending', "approved_date" datetime, "comments" text, "created_at" datetime NOT NULL CONSTRAINT "DF_afeb12eb1a31dbaa87d4f9499b5" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_c8f2ed2d581d3b49ed329663673" DEFAULT getdate(), CONSTRAINT "PK_97bfd1cd9dff3c1302229da6b5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "timesheet" ("id" int NOT NULL IDENTITY(1,1), "employee_id" uniqueidentifier NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "status" varchar(20) NOT NULL CONSTRAINT "DF_23fdffa8369387d871010906849" DEFAULT 'draft', "submission_date" datetime, "approval_date" datetime, "approved_by_employee_id" uniqueidentifier, "created_at" datetime NOT NULL CONSTRAINT "DF_5eeec55e725fb5320f797475fcd" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_093ad0db783ca484142a14edb9f" DEFAULT getdate(), CONSTRAINT "PK_53c30fa094ae81f166955fb1036" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leave" ("id" int NOT NULL IDENTITY(1,1), "employee_id" uniqueidentifier NOT NULL, "leave_type" nvarchar(255) NOT NULL, "leave_balance" decimal(5,1) NOT NULL, CONSTRAINT "PK_501f6ea368365d2a40b1660e16b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leave_application" ("id" int NOT NULL IDENTITY(1,1), "employee_id" uniqueidentifier NOT NULL, "from_date" datetime NOT NULL, "to_date" datetime NOT NULL, "applied_date" datetime2 NOT NULL CONSTRAINT "DF_9bba945b01380b0dd690c5924e2" DEFAULT getdate(), "status" nvarchar(255) NOT NULL, "comment" nvarchar(255), CONSTRAINT "PK_4e1f1a94e4ef6e79f28861f732e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_opening" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "description" text NOT NULL, "department" nvarchar(255) NOT NULL, "location" nvarchar(255) NOT NULL, "employment_type" nvarchar(255) NOT NULL, "experience_required" nvarchar(255) NOT NULL, "skills_required" varchar(255), "responsibilities" text, "qualifications" text, "salary_range" nvarchar(255), "is_active" bit NOT NULL CONSTRAINT "DF_ee008c598e337d739c1973979ce" DEFAULT 1, "created_at" datetime2 NOT NULL CONSTRAINT "DF_e41c37c122ed185f18923312ed5" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_7df2517c1de2688ba1cb8eceaaa" DEFAULT getdate(), CONSTRAINT "PK_2fa80b3147363501d81b9f6bbf3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client" ("id" int NOT NULL IDENTITY(1,1), "client_name" nvarchar(255) NOT NULL, "description" text, "address" text, "comments" text, "created_at" datetime NOT NULL CONSTRAINT "DF_9841844ab2a315a156e3ebd1aa2" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_60c73ce2df2afd0c95772e50f97" DEFAULT getdate(), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "holiday" ("id" int NOT NULL IDENTITY(1,1), "year" int NOT NULL, "client_id" int NOT NULL, "date_of_holiday" date NOT NULL, "holiday_reason" nvarchar(255) NOT NULL, "holiday_type" nvarchar(255) NOT NULL, "created_at" datetime NOT NULL CONSTRAINT "DF_87c733679fb21d9c157cacc7f48" DEFAULT getdate(), "updated_at" datetime NOT NULL CONSTRAINT "DF_a3d1f8dde76bb110344026617c5" DEFAULT getdate(), CONSTRAINT "PK_3e7492c25f80418a7aad0aec053" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" int NOT NULL IDENTITY(1,1), "type" nvarchar(255) NOT NULL, "email_id" nvarchar(255) NOT NULL, "address_line1" nvarchar(255) NOT NULL, "address_line2" nvarchar(255), "city" nvarchar(255) NOT NULL, "state" nvarchar(255) NOT NULL, "zipcode" nvarchar(255) NOT NULL, "phone_number" nvarchar(255) NOT NULL, "comments" nvarchar(255), "created_at" datetime2 NOT NULL CONSTRAINT "DF_84d0766a999bea5caff89e22078" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_27c9d6de6ba907f6e355ea7053e" DEFAULT getdate(), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candidate" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "address_id" int NOT NULL, "job_opening_id" int NOT NULL, "status" nvarchar(255) NOT NULL, "comment" nvarchar(255), "created_at" datetime2 NOT NULL CONSTRAINT "DF_3450070c4ea9d3816a7d5cdc3f6" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_629d63f227e9b0b6cf202a29300" DEFAULT getdate(), CONSTRAINT "PK_b0ddec158a9a60fbc785281581b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_referral" ("id" int NOT NULL IDENTITY(1,1), "job_opening_id" int, "referred_by" uniqueidentifier NOT NULL, "candidate_id" int NOT NULL, "referral_status" nvarchar(255) NOT NULL, "comment" nvarchar(255), "created_at" datetime2 NOT NULL CONSTRAINT "DF_e68ddec3ccdfd2d8fb4ba537bb4" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_2bf966f06589cc8e0cbb04d4848" DEFAULT getdate(), CONSTRAINT "PK_c41f4f902681755f7bbc4c3bae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "document" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, "uploaded_by" uniqueidentifier NOT NULL, "upload_dt" datetime NOT NULL CONSTRAINT "DF_c2b85d45b706c084c0691ff29fe" DEFAULT getdate(), "status" nvarchar(255) NOT NULL, "comments" nvarchar(255), "file_path" nvarchar(255) NOT NULL, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_update" ("id" int NOT NULL IDENTITY(1,1), "title" nvarchar(255) NOT NULL, "description" text NOT NULL, "type" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_d1d783efaf5c482a495581f616c" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_ef0bffd69889245aa539f94e0ea" DEFAULT getdate(), "event_date" datetime, "is_active" bit NOT NULL CONSTRAINT "DF_1e0293fd8c8498145744f39785a" DEFAULT 1, CONSTRAINT "PK_18a817d1c4d37bda2bcdef16157" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_roles" ("employeeId" uniqueidentifier NOT NULL, "roleId" int NOT NULL, CONSTRAINT "PK_19d2e1711f437b9e9636071ac8d" PRIMARY KEY ("employeeId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1666087b7380cf1747d20a8dcb" ON "employee_roles" ("employeeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_908685dc00cabcaf93d538914c" ON "employee_roles" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "time_entries" ADD CONSTRAINT "FK_be0bc3d86f3b112aa21c3229d91" FOREIGN KEY ("timesheet_id") REFERENCES "timesheet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_entries" ADD CONSTRAINT "FK_6fe2f6f6ff6ee8f772cda32025b" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_12a1b7fadbc36d335621ae6d955" FOREIGN KEY ("timesheet_id") REFERENCES "timesheet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_0015cb9d8b6f7a5242ee77089d7" FOREIGN KEY ("approver_employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet" ADD CONSTRAINT "FK_69860d3f6fd0df4fc8ee2dcd282" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timesheet" ADD CONSTRAINT "FK_35b74b6fbfe266fb0a672564a45" FOREIGN KEY ("approved_by_employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave" ADD CONSTRAINT "FK_2c89e369788f660a12afa44efad" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave_application" ADD CONSTRAINT "FK_5e7e777784ddbfab0d41fdc6cf1" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "holiday" ADD CONSTRAINT "FK_f80ae65a330a1bb731a5b4513eb" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_55d42eb6a33d968fedb611a2a73" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candidate" ADD CONSTRAINT "FK_cb44d99c465c54e577a2097cee4" FOREIGN KEY ("job_opening_id") REFERENCES "job_opening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_referral" ADD CONSTRAINT "FK_bbf0bdabc496600f178492102f1" FOREIGN KEY ("job_opening_id") REFERENCES "job_opening"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_referral" ADD CONSTRAINT "FK_585cd654f543642aea07758d5f8" FOREIGN KEY ("referred_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_referral" ADD CONSTRAINT "FK_e76b9a5f6cb4f3c750856243ed4" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "document" ADD CONSTRAINT "FK_38cb2f8a3427f83b22c067315f0" FOREIGN KEY ("uploaded_by") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_roles" ADD CONSTRAINT "FK_1666087b7380cf1747d20a8dcb0" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_roles" ADD CONSTRAINT "FK_908685dc00cabcaf93d538914c0" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_roles" DROP CONSTRAINT "FK_908685dc00cabcaf93d538914c0"`);
        await queryRunner.query(`ALTER TABLE "employee_roles" DROP CONSTRAINT "FK_1666087b7380cf1747d20a8dcb0"`);
        await queryRunner.query(`ALTER TABLE "document" DROP CONSTRAINT "FK_38cb2f8a3427f83b22c067315f0"`);
        await queryRunner.query(`ALTER TABLE "job_referral" DROP CONSTRAINT "FK_e76b9a5f6cb4f3c750856243ed4"`);
        await queryRunner.query(`ALTER TABLE "job_referral" DROP CONSTRAINT "FK_585cd654f543642aea07758d5f8"`);
        await queryRunner.query(`ALTER TABLE "job_referral" DROP CONSTRAINT "FK_bbf0bdabc496600f178492102f1"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_cb44d99c465c54e577a2097cee4"`);
        await queryRunner.query(`ALTER TABLE "candidate" DROP CONSTRAINT "FK_55d42eb6a33d968fedb611a2a73"`);
        await queryRunner.query(`ALTER TABLE "holiday" DROP CONSTRAINT "FK_f80ae65a330a1bb731a5b4513eb"`);
        await queryRunner.query(`ALTER TABLE "leave_application" DROP CONSTRAINT "FK_5e7e777784ddbfab0d41fdc6cf1"`);
        await queryRunner.query(`ALTER TABLE "leave" DROP CONSTRAINT "FK_2c89e369788f660a12afa44efad"`);
        await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_35b74b6fbfe266fb0a672564a45"`);
        await queryRunner.query(`ALTER TABLE "timesheet" DROP CONSTRAINT "FK_69860d3f6fd0df4fc8ee2dcd282"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_0015cb9d8b6f7a5242ee77089d7"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_12a1b7fadbc36d335621ae6d955"`);
        await queryRunner.query(`ALTER TABLE "time_entries" DROP CONSTRAINT "FK_6fe2f6f6ff6ee8f772cda32025b"`);
        await queryRunner.query(`ALTER TABLE "time_entries" DROP CONSTRAINT "FK_be0bc3d86f3b112aa21c3229d91"`);
        await queryRunner.query(`DROP INDEX "IDX_908685dc00cabcaf93d538914c" ON "employee_roles"`);
        await queryRunner.query(`DROP INDEX "IDX_1666087b7380cf1747d20a8dcb" ON "employee_roles"`);
        await queryRunner.query(`DROP TABLE "employee_roles"`);
        await queryRunner.query(`DROP TABLE "company_update"`);
        await queryRunner.query(`DROP TABLE "document"`);
        await queryRunner.query(`DROP TABLE "job_referral"`);
        await queryRunner.query(`DROP TABLE "candidate"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "holiday"`);
        await queryRunner.query(`DROP TABLE "client"`);
        await queryRunner.query(`DROP TABLE "job_opening"`);
        await queryRunner.query(`DROP TABLE "leave_application"`);
        await queryRunner.query(`DROP TABLE "leave"`);
        await queryRunner.query(`DROP TABLE "timesheet"`);
        await queryRunner.query(`DROP TABLE "approval"`);
        await queryRunner.query(`DROP TABLE "time_entries"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
