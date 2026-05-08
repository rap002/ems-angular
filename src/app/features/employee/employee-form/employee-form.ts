import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeService, EmployeeRequest } from '../../../service/employee/employee-service';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  loading = false;
  error = '';

  constructor() {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      salary: [null, [Validators.min(0)]],
      hireDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      departmentName: [''],
      roleName: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployeeData(this.employeeId);
    }
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
          departmentName: emp.departmentName,
          roleName: emp.roleName
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
    if (this.employeeForm.invalid) return;

    this.loading = true;
    const formValue = this.employeeForm.value;
    const request: EmployeeRequest = {
      ...formValue,
      fullName: `${formValue.firstName} ${formValue.lastName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, request).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: () => {
          this.error = 'Failed to update employee.';
          this.loading = false;
        }
      });
    } else {
      this.employeeService.addEmployee(request).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: () => {
          this.error = 'Failed to add employee.';
          this.loading = false;
        }
      });
    }
  }
}
