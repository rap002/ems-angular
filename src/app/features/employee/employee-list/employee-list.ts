import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, EmployeeResponse } from '../../../service/employee/employee-service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  employees = signal<EmployeeResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);
  pageSize = signal(10);
  loading = signal(false);
  error = signal('');

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(page: number = 0): void {
    this.loading.set(true);
    this.error.set('');
    
    this.employeeService.getAllEmployees().subscribe({
      next: (response) => {
        // Extract content and pagination info from the Page object
        this.employees.set(response.content || []);
        this.totalElements.set(response.totalElements || 0);
        this.totalPages.set(response.totalPages || 1);
        this.currentPage.set(response.number || 0);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load employees. Please check your backend connection.');
        this.loading.set(false);
        console.error("Error loading employees:", err);
      }
    });
  }

  nextPage(): void {
    // Pagination logic placeholder as service currently returns all
  }

  prevPage(): void {
    // Pagination logic placeholder as service currently returns all
  }
}
