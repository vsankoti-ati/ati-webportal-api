import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TimeEntry } from './time-entry.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active'
  })
  status: 'active' | 'completed' | 'on_hold' | 'cancelled';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => TimeEntry, timeEntry => timeEntry.project)
  timeEntries: TimeEntry[];
}