import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, ProjectResponse } from '../../../service/project/project-service';
import { EmployeeResponse, EmployeeService } from '../../../service/employee/employee-service';
import { of, Subject } from 'rxjs';
import { catchError, finalize, map, takeUntil, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.css']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  project: ProjectResponse | null = null;
  employees: EmployeeResponse[] = [];
  allEmployees: EmployeeResponse[] = [];
  selectedEmployeeId = '';
  assignProjectRole = 'Member';
  isAssigningEmployee = false;
  isEmployeesLoading = false;
  isLoading = true;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const projectId = params.get('id')?.trim();
        console.debug('ProjectDetails route param id:', projectId);

        if (projectId) {
          const navigationProject = this.getProjectFromNavigationState(projectId);
          this.project = navigationProject;
          this.employees = this.getAssignedEmployeesFromProject(navigationProject);
          this.isLoading = !navigationProject;
          this.errorMessage = '';
          this.loadProjectDetails(projectId);
          this.loadProjectEmployees(projectId);
          this.loadAllEmployees();
        } else {
          this.isLoading = false;
          this.errorMessage = 'Project ID is missing or invalid.';
        }
      });
  }

  loadProjectDetails(projectId: string): void {
    this.errorMessage = '';

    this.projectService.getProjectByID(projectId)
      .pipe(
        timeout({ first: 8000 }),
        catchError((error) => {
          console.error('Error loading project by id, trying project list fallback:', error);

          return this.projectService.getAllProjects().pipe(
            map((projects) =>
              projects.find((project) => this.getProjectId(project) === projectId) || null
            ),
            catchError((fallbackError) => {
              console.error('Error loading project list fallback:', fallbackError);
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          console.debug('Project details response:', data);
          if (!data && !this.project) {
            this.errorMessage = 'Project data is unavailable.';
            this.project = null;
          } else if (data) {
            this.project = data;
            const assignedEmployees = this.getAssignedEmployeesFromProject(data);

            if (assignedEmployees.length > 0) {
              this.employees = assignedEmployees;
            }
          }
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || error?.message || 'Failed to load project details';
          console.error('Error loading project:', error);
        }
      });
  }

  private getProjectFromNavigationState(projectId: string): ProjectResponse | null {
    if (typeof history === 'undefined') {
      return null;
    }

    const project = history.state?.project as ProjectResponse | undefined;

    if (!project || this.getProjectId(project) !== projectId) {
      return null;
    }

    return {
      ...project,
      id: this.getProjectId(project),
    };
  }

  private getProjectId(project: ProjectResponse): string {
    return project.id || project._id || '';
  }

  loadProjectEmployees(projectId: string): void {
    this.isEmployeesLoading = true;

    this.projectService.getProjectEmployees(projectId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isEmployeesLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.employees = this.normalizeEmployeeList(data);
        },
        error: (error) => {
          console.error('Error loading project employees:', error);
          this.employees = [];
        }
      });
  }

  loadAllEmployees(): void {
    this.employeeService.getAllEmployees({ size: 1000, page: 0 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          this.allEmployees = this.normalizeEmployeeList(page.content || []);
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.allEmployees = [];
        }
      });
  }

  get availableEmployees(): EmployeeResponse[] {
    const assignedEmployeeIds = new Set(
      this.employees.map((employee) => this.getEmployeeId(employee))
    );

    return this.allEmployees.filter(
      (employee) => !assignedEmployeeIds.has(this.getEmployeeId(employee))
    );
  }

  onAssignEmployee(): void {
    const projectId = this.project?.id;
    const selectedEmployee = this.allEmployees.find(
      (employee) => this.getEmployeeId(employee) === this.selectedEmployeeId
    );

    if (!projectId) {
      alert('Unable to assign employee: missing project ID.');
      return;
    }

    if (!this.selectedEmployeeId) {
      alert('Please select an employee to assign.');
      return;
    }

    this.isAssigningEmployee = true;
    this.projectService.assignEmployee(projectId, {
      employeeId: this.selectedEmployeeId,
      projectRole: this.assignProjectRole || 'Member'
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isAssigningEmployee = false;
        })
      )
      .subscribe({
        next: () => {
          if (
            selectedEmployee &&
            !this.employees.some((employee) => this.getEmployeeId(employee) === this.getEmployeeId(selectedEmployee))
          ) {
            this.employees = [...this.employees, selectedEmployee];
          }

          this.selectedEmployeeId = '';
          this.assignProjectRole = 'Member';
          this.loadProjectEmployees(projectId);
          alert('Employee assigned to project');
        },
        error: (error) => {
          console.error('Error assigning employee:', error);
          alert('Failed to assign employee to project');
        }
      });
  }

  onEdit(): void {
    if (this.project?.id) {
      this.router.navigate(['/projects/update', this.project.id], { state: { project: this.project } });
    }
  }

  onDelete(): void {
    const projectId = this.project?.id;
    if (!projectId) {
      this.errorMessage = 'Unable to delete project: missing project ID.';
      return;
    }

    if (confirm('Are you sure you want to delete this project?')) {
      this.isLoading = true;
      this.projectService.deleteProject(projectId)
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
    const projectId = this.project?.id;
    if (!projectId) {
      alert('Unable to remove employee: missing project ID.');
      return;
    }

    if (confirm(`Remove ${employee.firstName} ${employee.lastName} from this project?`)) {
      this.projectService.removeEmployeeFromProject(projectId, this.getEmployeeId(employee))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.employees = this.employees.filter(e => this.getEmployeeId(e) !== this.getEmployeeId(employee));
            alert('Employee removed from project');
          },
          error: (error) => {
            console.error('Error removing employee:', error);
            alert('Failed to remove employee from project');
          }
        });
    }
  }

  getEmployeeId(employee: EmployeeResponse): string {
    return employee.id || (employee as any)._id || '';
  }

  private normalizeEmployeeList(data: any): EmployeeResponse[] {
    const employees = Array.isArray(data)
      ? data
      : data?.content || data?.employees || [];

    return employees.map((item: any) => {
      const employee = item.employee || item;

      return {
        ...employee,
        id: employee.id || employee._id || item.employeeId || ''
      } as EmployeeResponse;
    });
  }

  private getAssignedEmployeesFromProject(project: ProjectResponse | null): EmployeeResponse[] {
    const projectData = project as any;

    if (!projectData) {
      return [];
    }

    return this.normalizeEmployeeList(
      projectData.employees ||
      projectData.assignedEmployees ||
      projectData.projectEmployees ||
      projectData.assignments ||
      []
    );
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
