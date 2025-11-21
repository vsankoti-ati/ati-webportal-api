import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dtos/employee.dto';
import { UUID } from 'crypto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Convert skills array to JSON string for storage
    const employeeData: Partial<Employee> = {
      ...createEmployeeDto,
      skills: createEmployeeDto.skills ? JSON.stringify(createEmployeeDto.skills) : null,
    };
    
    const employee = this.employeeRepository.create(employeeData);
    const saved: Employee = await this.employeeRepository.save(employee);
    
    // Parse skills back to array for response
    return this.parseEmployeeSkills(saved);
  }

  async findAll(): Promise<Employee[]> {
    const employees = await this.employeeRepository.find({
      relations: ['roles'],
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });
    
    // Parse skills for all employees
    return employees.map(emp => this.parseEmployeeSkills(emp));
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['roles']
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return this.parseEmployeeSkills(employee);
  }

  public async findByEmail(email: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ 
      where: { email },
      relations: ['roles']
    });
    if (!employee) {
      throw new NotFoundException(`Employee with email ${email} not found`);
    }
    return this.parseEmployeeSkills(employee);
  }

  async update(id: UUID, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    
    // Convert skills array to JSON string if provided
    const updateData: any = { ...updateEmployeeDto };
    if (updateEmployeeDto.skills !== undefined) {
      updateData.skills = updateEmployeeDto.skills ? JSON.stringify(updateEmployeeDto.skills) : null;
    } else {
      updateData.skills = '';
    }
    
    Object.assign(employee, updateData);
    const saved = await this.employeeRepository.save(employee);
    
    return this.parseEmployeeSkills(saved);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
  }

  /**
   * Helper method to parse skills from JSON string to array
   */
  private parseEmployeeSkills(employee: Employee): Employee {
    if (employee.skills && typeof employee.skills === 'string') {
      try {
        (employee as any).skills = JSON.parse(employee.skills);
      } catch (e) {
        (employee as any).skills = [];
      }
    } else if (!employee.skills) {
      (employee as any).skills = [];
    }
    return employee;
  }
}