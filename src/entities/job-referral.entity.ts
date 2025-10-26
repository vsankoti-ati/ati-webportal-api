import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { JobOpening } from './job-opening.entity';
import { Employee } from './employee.entity';
import { Candidate } from './candidate.entity';

@Entity('job_referral')
export class JobReferral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  jobOpeningId: number;

  @Column()
  referredBy: number;

  @Column()
  candidateId: number;

  @Column()
  referralStatus: string;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => JobOpening, { nullable: true })
  @JoinColumn({ name: 'job_opening_id' })
  jobOpening: JobOpening;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'referred_by' })
  referrer: Employee;

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;
}