import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';
//import { Role } from './role.entity';



@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  department: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ type: 'datetime' })
  hireDate: Date;

  @Column({ unique: true })
  employeeId: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  addressLine2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyPhone: string;

  @Column({ type: 'varchar', nullable: true })
  skills: string; // Stored as JSON string

  @Column({ nullable: true })
  comment: string;

  @ManyToMany(() => Role, (role) => role.employees)
  @JoinTable({
    name: "employee_roles",
    joinColumn: {
      name: "employeeId",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "roleId",
      referencedColumnName: "id"
    }
  })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}