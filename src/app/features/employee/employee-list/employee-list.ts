import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService, EmployeeResponse } from '../../../service/employee/employee-service';
import { DepartmentService, DepartmentResponse } from '../../../service/department/department-service';
import { AuthService } from '../../../service/auth/auth-service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  isAdmin = signal<boolean>(false);

  employees = signal<EmployeeResponse[]>([]);
  departments = signal<DepartmentResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  loading = signal(false);
  error = signal('');
  searchTerm = signal('');

  currentStatus = signal<string>('');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isAdmin.set(this.authService.isAdmin());
      this.loadEmployees();
      this.loadDepartments();
    }
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: () => console.error('Failed to load departments for filter')
    });
  }

  loadEmployees(deptId?: string, status?: string): void {
    this.loading.set(true);
    this.error.set('');
    
    // Determine which status to use
    const activeStatus = status !== undefined ? status : this.currentStatus();
    if (status !== undefined) this.currentStatus.set(status);

    let request;
    if (deptId) {
      request = this.employeeService.getAllEmployeesByDepartment(deptId);
    } else if (activeStatus) {
      request = this.employeeService.getEmployeesByStatus(activeStatus);
    } else {
      request = this.employeeService.getAllEmployees();
    }

    (request as any).subscribe({
      next: (response: any) => {
        const content = response.content !== undefined ? response.content : response;
        this.employees.set(content || []);
        
        if (response.content !== undefined) {
          this.totalElements.set(response.totalElements || 0);
          this.totalPages.set(response.totalPages || 1);
          this.currentPage.set(response.number || 0);
        } else {
          this.totalElements.set(content.length);
          this.totalPages.set(1);
          this.currentPage.set(0);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Failed to load employees. Please check your backend connection.');
        this.loading.set(false);
        console.error("Error loading employees:", err);
      }
    });
  }

  executeSearch(rawValue: string) {
  const value = rawValue.trim();

  if (!value) {
    this.loadEmployees();
    return;
  }

  this.loading.set(true);
  this.error.set('');

  console.log('Searching:', value);

  this.employeeService.findEmployeesByName(value).subscribe({
    next: (response: any) => {

      console.log('Name Search Response:', response);

      const emps = Array.isArray(response)
        ? response
        : response?.content || [];

      if (emps.length > 0) {
        console.log('Found by name');

        this.employees.set(emps);
        this.loading.set(false);

      } else {

        console.log('Trying ID search...');
        this.fetchById(value);
      }
    },

    error: (err: any) => {
      console.log('Name search failed, trying ID search');
      this.fetchById(value);
    }
  });
}

fetchById(id: string) {

  this.employeeService.getEmployeeByID(id).subscribe({
    next: (emp) => {

      console.log('ID Response:', emp);

      this.employees.set([emp]);
      this.loading.set(false);
    },

    error: (err: any) => {

      console.log('ID Search Error:', err);

      this.employees.set([]);
      this.loading.set(false);

      if (err.status === 404) {
        this.error.set('Employee not found');
      } else {
        this.error.set('Search failed');
      }
    }
  });
}

  deleteEmployee(id: string) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => this.loadEmployees(),
        error: (err: any) => alert('Delete failed')
      });
    }
  }

  nextPage(): void {
    // Pagination logic placeholder as service currently returns all
  }

  prevPage(): void {
    // Pagination logic placeholder as service currently returns all
  }
}
