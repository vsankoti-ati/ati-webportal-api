import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity('holiday')
export class Holiday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'date_of_holiday', type: 'date' })
  dateOfHoliday: Date;

  @Column({ name: 'holiday_reason' })
  holidayReason: string;

  @Column({ name: 'holiday_type' })
  holidayType: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Client, client => client.holidays)
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
