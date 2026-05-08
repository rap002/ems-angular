import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../service/department/department-service';

@Component({
  selector: 'app-department-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-add.html',
  styleUrl: './department-add.css',
})
export class DepartmentAdd {
  name = '';
  description = '';

  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) {}

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

    this.departmentService.addDepartment(departmentName, departmentDescription).subscribe({
      next: () => {
        this.success.set('Department added successfully.');
        this.name = '';
        this.description = '';
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
}
