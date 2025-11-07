import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { TimeEntry } from './time-entry.entity';
import { Approval } from './approval.entity';

@Entity()
export class Timesheet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft'
  })
  status: 'draft' | 'submitted' | 'approved' | 'rejected';

  @Column({ type: 'datetime', nullable: true })
  submissionDate: Date;

  @Column({ type: 'datetime', nullable: true })
  approvalDate: Date;

  @Column({ nullable: true })
  approvedByEmployeeId: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'approved_by_employee_id' })
  approvedBy: Employee;

  @OneToMany(() => TimeEntry, timeEntry => timeEntry.timesheet)
  timeEntries: TimeEntry[];

  @OneToMany(() => Approval, approval => approval.timesheet)
  approvals: Approval[];
}