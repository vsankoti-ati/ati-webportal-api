import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('leave_application')
export class LeaveApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeId: number;

  @Column()
  fromDate: Date;

  @Column()
  toDate: Date;

  @CreateDateColumn()
  appliedDate: Date;

  @Column()
  status: string; // 'PENDING', 'APPROVED', 'REJECTED'

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}