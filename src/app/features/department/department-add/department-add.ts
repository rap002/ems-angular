import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DepartmentRequest,
  DepartmentService
} from '../../../service/department/department-service';

@Component({
  selector: 'app-department-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-add.html',
  styleUrl: './department-add.css',
})
export class DepartmentAdd implements OnInit {
  name = '';
  description = '';
  departmentId: string | null = null;
  isEditMode = false;

  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(
    private departmentService: DepartmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id');

    if (this.departmentId) {
      this.isEditMode = true;
      this.loadDepartment(this.departmentId);
    }
  }

  loadDepartment(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.departmentService.getDepartment(id).subscribe({
      next: (department) => {
        this.name = department.name;
        this.description = department.description;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load department details.');
        this.loading.set(false);
        console.error('Error loading department:', err);
      }
    });
  }

  addDepartment(): void {
    this.error.set('');
    this.success.set('');

    const departmentName = this.name.trim();
    const departmentDescription = this.description.trim();

    if (!departmentName || !departmentDescription) {
      this.error.set('Please enter department name and description.');
      return;
    }

    this.loading.set(true);
    const request: DepartmentRequest = {
      name: departmentName,
      description: departmentDescription
    };

    const saveRequest = this.isEditMode && this.departmentId
      ? this.departmentService.updateDepartment(this.departmentId, request)
      : this.departmentService.addDepartment(departmentName, departmentDescription);

    saveRequest.subscribe({
      next: () => {
        this.success.set(
          this.isEditMode
            ? 'Department updated successfully.'
            : 'Department added successfully.'
        );
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/departments']);
        }, 800);
      },
      error: (err) => {
        this.error.set('Failed to add department. Please try again.');
        this.loading.set(false);
        console.error('Error adding department:', err);
      }
    });
  }

  resetForm(): void {
    this.name = '';
    this.description = '';
    this.error.set('');
    this.success.set('');
  }

  cancel(): void {
    this.router.navigate(['/departments']);
  }
}
