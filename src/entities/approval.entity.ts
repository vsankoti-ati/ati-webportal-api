import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { Timesheet } from './timesheet.entity';

@Entity()
export class Approval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timesheetId: number;

  @Column()
  approverEmployeeId: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending'
  })
  approvalStatus: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'datetime', nullable: true })
  approvedDate: Date;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Timesheet, timesheet => timesheet.approvals)
  @JoinColumn({ name: 'timesheet_id' })
  timesheet: Timesheet;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'approver_employee_id' })
  approver: Employee;
}