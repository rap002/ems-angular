import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../service/auth/auth-service';
import {
  DepartmentResponse,
  DepartmentService
} from '../../../service/department/department-service';

@Component({
  selector: 'app-department-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './department-details.html',
  styleUrl: './department-details.css',
})
export class DepartmentDetails implements OnInit {
  departments = signal<DepartmentResponse[]>([]);
  selectedDepartment = signal<DepartmentResponse | null>(null);

  loading = signal(false);
  detailsLoading = signal(false);
  error = signal('');
  detailsError = signal('');

  isAdmin = signal(false);

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isAdmin.set(this.authService.isAdmin());
    this.loadDepartments();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.loadDepartmentById(id);
      }
    });
  }

  loadDepartments(): void {
    this.loading.set(true);
    this.error.set('');

    this.departmentService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments.set(response);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load departments.');
        this.loading.set(false);
        console.error('Error loading departments:', err);
      }
    });
  }

  loadDepartmentById(id: string): void {
    this.detailsLoading.set(true);
    this.detailsError.set('');

    this.departmentService.getDepartment(id).subscribe({
      next: (response) => {
        this.selectedDepartment.set(response);
        this.detailsLoading.set(false);
      },
      error: (err) => {
        this.detailsError.set('Failed to load department details.');
        this.selectedDepartment.set(null);
        this.detailsLoading.set(false);
        console.error('Error loading department by id:', err);
      }
    });
  }
}
