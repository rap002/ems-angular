import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService, ProjectResponse } from '../../../service/project/project-service';
import { EmployeeResponse } from '../../../service/employee/employee-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterLink } from '@angular/router';  // ← add this

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],  // ← RouterLink not RouterModule
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  project!: ProjectResponse;
  employees: EmployeeResponse[] = [];
  isLoading = true;
  errorMessage = '';
  isEditing = false;
  showEmployeeModal = false;
  selectedEmployee: EmployeeResponse | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const projectId = params['id'];
        if (projectId) {
          this.loadProjectDetails(projectId);
          this.loadProjectEmployees(projectId);
        }
      });
  }

  loadProjectDetails(projectId: string): void {
    this.projectService.getProjectByID(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.project = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load project details';
          console.error('Error loading project:', error);
        }
      });
  }

  loadProjectEmployees(projectId: string): void {
    this.projectService.getProjectEmployees(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.employees = data;
        },
        error: (error) => {
          console.error('Error loading project employees:', error);
          this.employees = [];
        }
      });
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.isLoading = true;
      this.projectService.deleteProject(this.project.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Project deleted successfully');
            this.router.navigate(['/projects']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to delete project';
            console.error('Error deleting project:', error);
          }
        });
    }
  }

  onRemoveEmployee(employee: EmployeeResponse): void {
    if (confirm(`Remove ${employee.firstName} ${employee.lastName} from this project?`)) {
      this.projectService.removeEmployeeFromProject(this.project.id, employee.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.employees = this.employees.filter(e => e.id !== employee.id);
            alert('Employee removed from project');
          },
          error: (error) => {
            console.error('Error removing employee:', error);
            alert('Failed to remove employee from project');
          }
        });
    }
  }

  viewEmployeeDetails(employee: EmployeeResponse): void {
    this.selectedEmployee = employee;
    this.showEmployeeModal = true;
  }

  closeEmployeeModal(): void {
    this.showEmployeeModal = false;
    this.selectedEmployee = null;
  }

  onBack(): void {
    this.router.navigate(['/projects']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}