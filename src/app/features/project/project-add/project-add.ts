import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, finalize, map, timeout } from 'rxjs/operators';
import { ProjectService, ProjectRequest, ProjectResponse } from '../../../service/project/project-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-add.html',
  styleUrls: ['./project-add.css']
})
export class ProjectAddComponent implements OnInit {
  projectForm!: FormGroup;
  isLoading = false;
  isEditMode = false;
  projectId = '';
  errorMessage = '';
  successMessage = '';
  statusOptions = [
    { value: 'PLANNED', label: 'Planned' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ON_HOLD', label: 'On Hold' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.projectId = this.route.snapshot.paramMap.get('id')?.trim() || '';
    this.isEditMode = !!this.projectId;

    if (this.isEditMode) {
      const navigationProject = this.getProjectFromNavigationState();
      if (navigationProject) {
        this.patchProjectForm(navigationProject);
      }

      this.loadProjectForEdit(!navigationProject);
    }
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      startDate: ['', Validators.required],
      endDate: [''],
      status: ['PLANNED', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.projectForm.value as ProjectRequest;
    const requestBody: ProjectRequest = {
      name: formValue.name,
      description: formValue.description,
      startDate: formValue.startDate,
      status: formValue.status,
      ...(formValue.endDate ? { endDate: formValue.endDate } : {})
    };

    console.log('Submitting project:', requestBody);

    const request$ = this.isEditMode
      ? this.projectService.updateProject(this.projectId, requestBody)
      : this.projectService.addProject(requestBody);

    request$
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: () => {
          this.successMessage = this.isEditMode
            ? 'Project updated successfully!'
            : 'Project created successfully!';
          alert(this.isEditMode ? 'Project updated successfully' : 'Project added successfully');
          setTimeout(() => {
            this.router.navigate(['/projects']);
          }, 1000);
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            `Failed to ${this.isEditMode ? 'update' : 'create'} project (${error?.status || 'unknown'})`;
          console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} project:`, error);
        }
      });
  }

  onReset(): void {
    if (this.isEditMode) {
      this.loadProjectForEdit();
    } else {
      this.projectForm.reset({ status: 'PLANNED' });
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  onCancel(): void {
    this.router.navigate(['/projects']);
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  get startDate() {
    return this.projectForm.get('startDate');
  }

  get endDate() {
    return this.projectForm.get('endDate');
  }

  private loadProjectForEdit(showLoader = true): void {
    if (!this.projectId) {
      this.errorMessage = 'Project ID is missing.';
      return;
    }

    this.isLoading = showLoader;
    this.errorMessage = '';

    this.projectService.getProjectByID(this.projectId)
      .pipe(
        timeout({ first: 8000 }),
        catchError((error) => {
          console.error('Error loading project by id for edit, trying list fallback:', error);

          return this.projectService.getAllProjects().pipe(
            map((projects) =>
              projects.find((project) => this.getProjectId(project) === this.projectId) || null
            ),
            catchError((fallbackError) => {
              console.error('Error loading project edit fallback:', fallbackError);
              return of(null);
            })
          );
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (project) => {
          if (project) {
            this.patchProjectForm(project);
          } else if (showLoader) {
            this.errorMessage = 'Project details are not available for editing.';
          }
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            'Failed to load project details for editing';
          console.error('Error loading project for edit:', error);
        }
      });
  }

  private patchProjectForm(project: ProjectResponse): void {
    this.projectForm.patchValue({
      name: project.name || '',
      description: project.description || '',
      startDate: this.toDateInputValue(project.startDate),
      endDate: this.toDateInputValue(project.endDate),
      status: project.status || 'PLANNED'
    });
  }

  private toDateInputValue(date?: string): string {
    return date ? date.substring(0, 10) : '';
  }

  private getProjectFromNavigationState(): ProjectResponse | null {
    if (typeof history === 'undefined') {
      return null;
    }

    const project = history.state?.project as ProjectResponse | undefined;

    if (!project || this.getProjectId(project) !== this.projectId) {
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
}
