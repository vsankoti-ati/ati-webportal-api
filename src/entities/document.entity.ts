import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity('document')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ name: 'uploaded_by' })
  uploadedBy: number;

  @Column({ name: 'upload_dt', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  uploadDt: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  comments: string;

  @Column()
  file_path: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'uploaded_by' })
  employee: Employee;
}