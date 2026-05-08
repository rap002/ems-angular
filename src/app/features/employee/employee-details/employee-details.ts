import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { EmployeeService, EmployeeResponse } from '../../../service/employee/employee-service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  employee = signal<EmployeeResponse | null>(null);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
  }

  loadEmployee(id: string) {
    this.loading.set(true);
    this.employeeService.getEmployeeByID(id).subscribe({
      next: (emp) => {
        this.employee.set(emp);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Employee not found.');
        this.loading.set(false);
      }
    });
  }

  deleteEmployee() {
    const emp = this.employee();
    if (emp && confirm(`Are you sure you want to terminate ${emp.firstName} ${emp.lastName}?`)) {
      this.employeeService.deleteEmployee(emp.id).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: () => alert('Failed to delete employee.')
      });
    }
  }
}
