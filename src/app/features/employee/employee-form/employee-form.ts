import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService, EmployeeRequest } from '../../../service/employee/employee-service';
import { DepartmentService, DepartmentResponse } from '../../../service/department/department-service';
import { RoleService, RoleResponse } from '../../../service/role/role-service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm implements OnInit {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  loading = false;
  error = '';

  departments = signal<DepartmentResponse[]>([]);
  roles = signal<RoleResponse[]>([]);

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern('^[+]?[0-9]{10,15}$')]],
      salary: [null, [Validators.required, Validators.min(0.01)]],
      hireDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      departmentId: ['', [Validators.required]],
      roleId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadMetadata();
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployeeData(this.employeeId);
    }
  }

  loadMetadata() {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: () => console.error('Failed to load departments')
    });
    this.roleService.getAllRoles().subscribe({
      next: (data) => this.roles.set(data),
      error: () => console.error('Failed to load roles')
    });
  }

  loadEmployeeData(id: string) {
    this.loading = true;
    this.employeeService.getEmployeeByID(id).subscribe({
      next: (emp) => {
        this.employeeForm.patchValue({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          phone: emp.phone,
          salary: emp.salary,
          hireDate: emp.hireDate,
          status: emp.status,
          departmentId: emp.departmentId,
          roleId: emp.roleId
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employee data.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.error = 'Please fill all required fields correctly.';
      console.log('Form invalid:', this.employeeForm.errors);
      // Mark all fields as touched to show validation errors
      Object.values(this.employeeForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';
    const formValue = this.employeeForm.value;
    
    const request: EmployeeRequest = {
      ...formValue,
      fullName: `${formValue.firstName} ${formValue.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Submitting request:', request);

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, request).subscribe({
        next: (res) => {
          console.log('Update successful:', res);
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.error = err.error?.message || 'Failed to update employee. Please check for duplicate email or invalid data.';
          this.loading = false;
        }
      });
    } else {
      this.employeeService.addEmployee(request).subscribe({
        next: (res) => {
          console.log('Create successful:', res);
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Create failed:', err);
          this.error = err.error?.message || 'Failed to onboard employee. Please ensure all IDs are correct and email is unique.';
          this.loading = false;
        }
      });
    }
  }
}
