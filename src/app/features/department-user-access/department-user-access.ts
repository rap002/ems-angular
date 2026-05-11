import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  DepartmentResponse,
  DepartmentService
} from '../../service/department/department-service';

@Component({
  selector: 'app-department-user-access',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-user-access.html',
  styleUrl: './department-user-access.css',
})
export class DepartmentUserAccess implements OnInit {
  departments = signal<DepartmentResponse[]>([]);
  loading = signal(false);
  error = signal('');
  accessDenied = signal(false);

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    if (!this.isUserLoggedInAsUser()) {
      this.accessDenied.set(true);
      return;
    }

    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.error.set('');

    this.departmentService.getAllDepartments().subscribe({
      next: (response:any) => {
        this.departments.set(response);
        this.loading.set(false);
      },
      error: (err:any) => {
        this.error.set('Failed to load departments.');
        this.loading.set(false);
        console.error('Error loading departments:', err);
      }
    });
  }

  private isUserLoggedInAsUser(): boolean {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return false;
    }

    const token = sessionStorage.getItem('auth');

    if (!token) {
      return false;
    }

    const payload = this.decodeTokenPayload(token);

    if (!payload) {
      return false;
    }

    const role =
      payload.role ||
      payload.roles ||
      payload.authority ||
      payload.authorities;

    if (Array.isArray(role)) {
      return role.some((item: string) =>
        item === 'USER' || item === 'ROLE_USER'
      );
    }

    return role === 'USER' || role === 'ROLE_USER';
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
