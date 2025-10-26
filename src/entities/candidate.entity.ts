import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Address } from './address.entity';
import { JobOpening } from './job-opening.entity';

@Entity('candidate')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  addressId: number;

  @Column()
  jobOpeningId: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @ManyToOne(() => JobOpening)
  @JoinColumn({ name: 'job_opening_id' })
  jobOpening: JobOpening;
}