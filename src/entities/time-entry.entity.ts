import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';
import { Timesheet } from './timesheet.entity';

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timesheetId: number;

  @Column()
  projectId: number;

  @Column({ type: 'date' })
  entryDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  hoursWorked: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Timesheet, timesheet => timesheet.timeEntries)
  @JoinColumn({ name: 'timesheet_id' })
  timesheet: Timesheet;

  @ManyToOne(() => Project, project => project.timeEntries)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}