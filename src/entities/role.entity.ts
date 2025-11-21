// // src/entity/Role.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Employee } from "./employee.entity";

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Employee, (employee) => employee.roles)
    employees: Employee[];
}