import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('job_opening')
export class JobOpening {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  department: string;

  @Column()
  location: string;

  @Column()
  employmentType: string; // 'Full-time' | 'Part-time' | 'Contract' | 'Internship'

  @Column()
  experienceRequired: string;

  @Column({ type: 'varchar', nullable: true })
  skillsRequired: string; // Comma-separated: "JavaScript,TypeScript,React"

  @Column({ type: 'text', nullable: true })
  responsibilities: string; // Comma-separated responsibilities

  @Column({ type: 'text', nullable: true })
  qualifications: string; // Comma-separated qualifications

  @Column({ nullable: true })
  salaryRange: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}